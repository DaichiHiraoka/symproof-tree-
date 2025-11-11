# symproof-tree アーキテクチャ設計書

## 目次
1. [システム全体構成](#システム全体構成)
2. [データフロー](#データフロー)
3. [コンポーネント構成](#コンポーネント構成)
4. [ディレクトリ構造](#ディレクトリ構造)
5. [技術スタック](#技術スタック)
6. [データモデル関連図](#データモデル関連図)

---

## システム全体構成

### 高レベルアーキテクチャ

```mermaid
graph TB
    subgraph "ユーザー環境"
        Browser[Webブラウザ]
        Wallet[Symbol Wallet]
    end

    subgraph "Next.js Application"
        Frontend[React Frontend<br/>App Router]
        API[API Routes<br/>/api/summarize]
        Storage[LocalStorage<br/>オフチェーンデータ]
    end

    subgraph "外部サービス"
        SymbolNode[Symbol Testnet Node<br/>sym-test-03.opening-line.jp:3001]
        GeminiAPI[Google Gemini API<br/>gemini-1.5-flash]
        Explorer[Symbol Explorer<br/>testnet.symbol.fyi]
    end

    subgraph "データソース"
        MockData[Mock JSON Files<br/>mock-browsing-sessions.json<br/>mock-confirmed-records.json]
    end

    Browser -->|HTTP Request| Frontend
    Frontend -->|API Call| API
    Frontend <-->|Read/Write| Storage
    Frontend -->|SDK Call| SymbolNode
    Frontend -->|Trigger Signature| Wallet
    Wallet -->|Sign & Announce Tx| SymbolNode
    API -->|Summarization Request| GeminiAPI
    MockData -->|Load on Init| Frontend
    Browser -->|Verify Transaction| Explorer

    style Frontend fill:#4A90E2
    style SymbolNode fill:#44D62C
    style GeminiAPI fill:#FF6B6B
    style Storage fill:#FFA500
```

### レイヤー構成

```mermaid
graph TB
    subgraph "Presentation Layer"
        Pages[Pages<br/>page.tsx, tree/page.tsx<br/>portfolio/page.tsx, verify/page.tsx]
        Components[Components<br/>PendingRecords, ConfirmedRecords<br/>LearningTree, VerifyPanel]
    end

    subgraph "Business Logic Layer"
        Detection[Detection Logic<br/>auto-tracker.ts<br/>score-calculator.ts<br/>tag-extractor.ts]
        Symbol[Symbol Integration<br/>client.ts, transaction.ts<br/>verify.ts]
        AI[AI Integration<br/>summarize.ts]
    end

    subgraph "Data Layer"
        LocalStore[LocalStorage<br/>local.ts]
        Utils[Utilities<br/>hash.ts, validation.ts]
        Types[Type Definitions<br/>types/index.ts]
    end

    subgraph "External"
        Blockchain[Symbol Blockchain]
        AIService[Gemini API]
    end

    Pages --> Components
    Components --> Detection
    Components --> Symbol
    Components --> AI
    Detection --> Utils
    Symbol --> Utils
    Symbol --> LocalStore
    AI --> LocalStore
    Symbol --> Blockchain
    AI --> AIService

    style Pages fill:#E3F2FD
    style Detection fill:#FFF9C4
    style Symbol fill:#C8E6C9
    style AI fill:#FFCCBC
```

---

## データフロー

### 1. 自動検出から確認までのフロー

```mermaid
sequenceDiagram
    participant Mock as Mock JSON
    participant AutoTracker as Auto Tracker
    participant Frontend as Frontend
    participant LocalStorage as LocalStorage
    participant User as User

    Mock->>AutoTracker: Load browsing sessions
    AutoTracker->>AutoTracker: Calculate duration
    AutoTracker->>AutoTracker: Estimate understanding score
    AutoTracker->>AutoTracker: Extract tags from URL
    AutoTracker->>AutoTracker: Generate auto note
    AutoTracker->>LocalStorage: Save as pending records
    LocalStorage->>Frontend: Load pending records
    Frontend->>User: Display in "Pending" tab (read-only)
    User->>Frontend: Click record card
    Frontend->>User: Show confirmation modal
    User->>Frontend: Click "ブロックチェーンに記録する"
    Frontend->>Frontend: Calculate content hash
    Note over Frontend: User cannot edit any fields
```

### 2. ブロックチェーン記録フロー

```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as Frontend
    participant SymbolSDK as Symbol SDK
    participant Wallet as Symbol Wallet
    participant Node as Symbol Node
    participant LocalStorage as LocalStorage
    participant GeminiAPI as Gemini API

    User->>Frontend: Confirm record
    Frontend->>Frontend: Generate content hash (SHA-256)
    Frontend->>SymbolSDK: Create TransferTransaction
    SymbolSDK->>SymbolSDK: Build transaction payload
    SymbolSDK->>Wallet: Request signature
    Wallet->>User: Show signature prompt
    User->>Wallet: Approve signature
    Wallet->>Node: Announce signed transaction
    Node->>Node: Add to mempool
    Node-->>Frontend: Transaction hash
    Frontend->>LocalStorage: Update record with txHash
    Frontend->>Frontend: Start polling (3s interval, 60s max)

    loop Every 3 seconds
        Frontend->>Node: Check transaction status
        Node-->>Frontend: Status response
    end

    Node-->>Frontend: Confirmed (in block)
    Frontend->>LocalStorage: Update proofStatus to 'confirmed'
    Frontend->>LocalStorage: Save block height
    Frontend->>GeminiAPI: Request AI summary
    GeminiAPI-->>Frontend: Summary text
    Frontend->>LocalStorage: Save AI summary
    Frontend->>User: Show confirmed record with proof
```

### 3. 検証フロー

```mermaid
sequenceDiagram
    participant User as Verifier (Third Party)
    participant VerifyPage as Verify Page
    participant SymbolNode as Symbol Node
    participant LocalStorage as LocalStorage
    participant Frontend as Frontend

    User->>VerifyPage: Enter transaction hash
    VerifyPage->>SymbolNode: Fetch transaction by hash
    SymbolNode-->>VerifyPage: Transaction data
    VerifyPage->>VerifyPage: Parse message payload
    VerifyPage->>LocalStorage: Get local record by ID
    LocalStorage-->>VerifyPage: Local record data
    VerifyPage->>VerifyPage: Recalculate content hash
    VerifyPage->>VerifyPage: Compare hashes
    VerifyPage->>VerifyPage: Compare timestamps
    VerifyPage->>User: Display verification result

    alt Hash matches
        VerifyPage->>User: ✅ Valid (no tampering)
    else Hash mismatch
        VerifyPage->>User: ❌ Invalid (potential tampering)
    end

    User->>VerifyPage: Click Symbol Explorer link
    VerifyPage->>User: Open blockchain explorer
```

### 4. AI要約生成フロー

```mermaid
sequenceDiagram
    participant Frontend as Frontend
    participant APIRoute as /api/summarize
    participant GeminiAPI as Gemini API
    participant LocalStorage as LocalStorage

    Frontend->>APIRoute: POST /api/summarize
    Note over Frontend,APIRoute: { record: LearningRecord }
    APIRoute->>APIRoute: Build prompt (Japanese)
    APIRoute->>GeminiAPI: Generate content
    Note over APIRoute,GeminiAPI: Model: gemini-1.5-flash
    GeminiAPI->>GeminiAPI: Generate summary
    GeminiAPI-->>APIRoute: Response with summary text
    APIRoute-->>Frontend: { summary: string }
    Frontend->>LocalStorage: Update record.aiSummary
    Frontend->>LocalStorage: Set summaryStatus = 'ready'
    Frontend->>Frontend: Re-render with summary

    alt API Error
        GeminiAPI-->>APIRoute: Error response
        APIRoute-->>Frontend: Error status
        Frontend->>LocalStorage: Set summaryStatus = 'failed'
        Frontend->>Frontend: Show retry button
    end
```

---

## コンポーネント構成

### Reactコンポーネント階層

```mermaid
graph TB
    RootLayout[layout.tsx<br/>Root Layout]

    subgraph "Pages"
        HomePage[page.tsx<br/>Home Page]
        TreePage[tree/page.tsx<br/>Tree Page]
        PortfolioPage[portfolio/id/page.tsx<br/>Portfolio Page]
        VerifyPage[verify/page.tsx<br/>Verify Page]
    end

    subgraph "Shared Components"
        Header[Header.tsx<br/>Navigation]
    end

    subgraph "Home Page Components"
        PendingRecords[PendingRecords.tsx<br/>Auto-detected Records List]
        ConfirmedRecords[ConfirmedRecords.tsx<br/>Blockchain-confirmed List]
        ConfirmationModal[ConfirmationModal.tsx<br/>Review & Confirm Modal]
        RecordCard[RecordCard.tsx<br/>Individual Record Display]
    end

    subgraph "Tree Page Components"
        LearningTree[LearningTree.tsx<br/>React Flow Visualization]
    end

    subgraph "Verify Page Components"
        VerifyPanel[VerifyPanel.tsx<br/>Verification UI]
        ProofCard[ProofCard.tsx<br/>Proof Display]
    end

    RootLayout --> Header
    RootLayout --> HomePage
    RootLayout --> TreePage
    RootLayout --> PortfolioPage
    RootLayout --> VerifyPage

    HomePage --> PendingRecords
    HomePage --> ConfirmedRecords
    PendingRecords --> RecordCard
    ConfirmedRecords --> RecordCard
    RecordCard --> ConfirmationModal

    TreePage --> LearningTree

    PortfolioPage --> ConfirmedRecords
    PortfolioPage --> LearningTree

    VerifyPage --> VerifyPanel
    VerifyPanel --> ProofCard

    style HomePage fill:#E8F5E9
    style TreePage fill:#E3F2FD
    style PortfolioPage fill:#FFF9C4
    style VerifyPage fill:#FCE4EC
```

### 状態管理フロー

```mermaid
graph LR
    subgraph "State Sources"
        LS[LocalStorage]
        Mock[Mock JSON]
    end

    subgraph "React State"
        Pending[pendingRecords<br/>useState]
        Confirmed[confirmedRecords<br/>useState]
        Selected[selectedRecord<br/>useState]
        Loading[isLoading<br/>useState]
    end

    subgraph "Actions"
        Load[Load Records]
        Confirm[Confirm Record]
        Verify[Verify Proof]
    end

    Mock -->|useEffect on mount| Pending
    LS -->|useEffect on mount| Confirmed

    Load --> Pending
    Load --> Confirmed

    Pending -->|User clicks| Selected
    Selected -->|User confirms| Confirm
    Confirm -->|Create Tx| Loading
    Loading -->|Success| Confirmed
    Loading -->|Update| LS

    Confirmed -->|User clicks verify| Verify

    style Pending fill:#FFF9C4
    style Confirmed fill:#C8E6C9
    style Selected fill:#FFCCBC
    style Loading fill:#B0BEC5
```

---

## ディレクトリ構造

### プロジェクト全体構造図

```mermaid
graph TB
    Root[symproof-tree/]

    Root --> Src[src/]
    Root --> Public[public/]
    Root --> Docs[docs/]
    Root --> Config[Config Files]

    Src --> App[app/]
    Src --> Components[components/]
    Src --> Lib[lib/]
    Src --> Types[types/]
    Src --> Constants[constants/]

    App --> HomePage[page.tsx]
    App --> TreePage[tree/page.tsx]
    App --> PortfolioPage[portfolio/id/page.tsx]
    App --> VerifyPage[verify/page.tsx]
    App --> LayoutPage[layout.tsx]
    App --> APIRoute[api/summarize/route.ts]

    Components --> C1[PendingRecords.tsx]
    Components --> C2[ConfirmedRecords.tsx]
    Components --> C3[ConfirmationModal.tsx]
    Components --> C4[LearningTree.tsx]
    Components --> C5[RecordCard.tsx]
    Components --> C6[ProofCard.tsx]
    Components --> C7[VerifyPanel.tsx]
    Components --> C8[Header.tsx]

    Lib --> Detection[detection/]
    Lib --> Symbol[symbol/]
    Lib --> AI[ai/]
    Lib --> Storage[storage/]
    Lib --> Utils[utils/]

    Detection --> D1[auto-tracker.ts]
    Detection --> D2[score-calculator.ts]
    Detection --> D3[tag-extractor.ts]

    Symbol --> S1[client.ts]
    Symbol --> S2[transaction.ts]
    Symbol --> S3[verify.ts]
    Symbol --> S4[types.ts]

    AI --> A1[summarize.ts]

    Storage --> St1[local.ts]

    Utils --> U1[hash.ts]
    Utils --> U2[validation.ts]

    Types --> T1[index.ts]

    Constants --> Const1[index.ts]

    Public --> Mock1[mock-browsing-sessions.json]
    Public --> Mock2[mock-confirmed-records.json]

    Docs --> Doc1[SPEC.md]
    Docs --> Doc2[ARCHITECTURE.md]
    Docs --> Doc3[SETUP.md]
    Docs --> Doc4[DEMO_GUIDE.md]
    Docs --> Doc5[DATA_MODELS.md]

    Config --> Conf1[package.json]
    Config --> Conf2[tsconfig.json]
    Config --> Conf3[tailwind.config.ts]
    Config --> Conf4[next.config.js]
    Config --> Conf5[.env.local]
    Config --> Conf6[.env.example]

    style Src fill:#E3F2FD
    style Lib fill:#FFF9C4
    style Components fill:#C8E6C9
    style Public fill:#FFCCBC
    style Docs fill:#F3E5F5
```

### ファイル責務マトリクス

| ディレクトリ | ファイル | 責務 |
|------------|---------|------|
| `src/app/` | `page.tsx` | ホームページ: Pending/Confirmed records表示 |
| | `tree/page.tsx` | 学習ツリー可視化ページ |
| | `portfolio/[id]/page.tsx` | ポートフォリオ共有ページ |
| | `verify/page.tsx` | ブロックチェーン検証ページ |
| | `layout.tsx` | ルートレイアウト・ナビゲーション |
| | `api/summarize/route.ts` | Gemini API統合 |
| `src/components/` | `PendingRecords.tsx` | 自動検出された保留中記録のリスト |
| | `ConfirmedRecords.tsx` | ブロックチェーン確認済み記録のリスト |
| | `ConfirmationModal.tsx` | 記録確認・承認モーダル |
| | `LearningTree.tsx` | React Flowツリー可視化 |
| | `RecordCard.tsx` | 個別記録カード（読み取り専用） |
| | `ProofCard.tsx` | ブロックチェーン証明表示 |
| | `VerifyPanel.tsx` | 検証UIパネル |
| | `Header.tsx` | ナビゲーションヘッダー |
| `src/lib/detection/` | `auto-tracker.ts` | BrowsingSession → LearningRecord変換 |
| | `score-calculator.ts` | 理解度スコア計算ロジック |
| | `tag-extractor.ts` | URLからタグ抽出 |
| `src/lib/symbol/` | `client.ts` | Symbol SDK初期化 |
| | `transaction.ts` | トランザクション作成・送信 |
| | `verify.ts` | ブロックチェーン検証ロジック |
| | `types.ts` | Symbol固有の型定義 |
| `src/lib/ai/` | `summarize.ts` | Gemini API呼び出しロジック |
| `src/lib/storage/` | `local.ts` | LocalStorage操作 |
| `src/lib/utils/` | `hash.ts` | SHA-256ハッシュ計算 |
| | `validation.ts` | データ検証 |
| `src/types/` | `index.ts` | グローバル型定義 |
| `src/constants/` | `index.ts` | アプリケーション定数 |
| `public/` | `mock-browsing-sessions.json` | デモ用ブラウジングセッションデータ |
| | `mock-confirmed-records.json` | デモ用確認済み記録データ |

---

## 技術スタック

### フロントエンド技術

```mermaid
graph TB
    subgraph "Frontend Stack"
        Next[Next.js 14<br/>App Router]
        React[React 18<br/>UI Library]
        TS[TypeScript<br/>Strict Mode]
        Tailwind[Tailwind CSS<br/>Styling]
        ReactFlow[React Flow<br/>Tree Visualization]
    end

    subgraph "State Management"
        Hooks[React Hooks<br/>useState, useEffect, useContext]
        LocalStorage[LocalStorage API<br/>Browser Storage]
    end

    subgraph "Blockchain Integration"
        SymbolSDK[symbol-sdk v3<br/>Transaction & Account]
        SymbolNode[Symbol Testnet Node<br/>sym-test-03.opening-line.jp:3001]
    end

    subgraph "AI Integration"
        GeminiSDK[@google/generative-ai<br/>Gemini API Client]
        GeminiModel[gemini-1.5-flash<br/>Summarization Model]
    end

    subgraph "Build Tools"
        Node[Node.js]
        NPM[npm<br/>Package Manager]
        PostCSS[PostCSS<br/>Autoprefixer]
    end

    Next --> React
    Next --> TS
    React --> Hooks
    React --> Tailwind
    React --> ReactFlow
    Hooks --> LocalStorage
    Next --> SymbolSDK
    SymbolSDK --> SymbolNode
    Next --> GeminiSDK
    GeminiSDK --> GeminiModel
    Next --> PostCSS

    style Next fill:#000000,color:#FFFFFF
    style SymbolSDK fill:#44D62C
    style GeminiSDK fill:#FF6B6B
    style ReactFlow fill:#FF69B4
```

### 依存パッケージ

| パッケージ | バージョン | 用途 |
|-----------|----------|------|
| `next` | 14.x | Reactフレームワーク |
| `react` | 18.x | UIライブラリ |
| `typescript` | 5.x | 型安全性 |
| `tailwindcss` | 3.x | スタイリング |
| `symbol-sdk` | 3.x | Symbol blockchain統合 |
| `@google/generative-ai` | latest | Gemini API統合 |
| `reactflow` | latest | グラフ可視化 |
| `uuid` | 9.x | UUID生成 |
| `@types/uuid` | 9.x | UUID型定義 |

---

## データモデル関連図

### エンティティ関係図

```mermaid
erDiagram
    BrowsingSession ||--o{ LearningRecord : "converts to"
    LearningRecord ||--o| SymbolTransaction : "creates"
    LearningRecord ||--o| AISummary : "generates"
    LearningRecord ||--|| LearningNode : "represented as"
    Portfolio ||--|{ LearningRecord : "contains"
    Portfolio ||--|{ LearningNode : "contains"

    BrowsingSession {
        string id PK
        string url
        string title
        string startTime
        string endTime
        number scrollDepth
        number revisits
        string domain
        string category
    }

    LearningRecord {
        string id PK
        string userId
        string url
        string title
        string description
        array tags
        number duration
        number understanding
        string note
        string createdAt
        string updatedAt
        string contentHash
        string txHash FK
        number blockHeight
        enum proofStatus
        string aiSummary FK
        enum summaryStatus
    }

    SymbolTransaction {
        string txHash PK
        string type
        string version
        string recordId FK
        string contentHash
        string timestamp
        object metadata
    }

    AISummary {
        string recordId FK
        string summary
        string generatedAt
        enum status
    }

    LearningNode {
        string id PK
        string recordId FK
        object position
        array prerequisites
        array dependents
        enum status
        string completedAt
    }

    Portfolio {
        string userId PK
        string displayName
        array records FK
        array treeData FK
        string summary
        object stats
        string publicUrl
        boolean isPublic
        string createdAt
        string updatedAt
    }
```

### 状態遷移図

```mermaid
stateDiagram-v2
    [*] --> MockData: App Initialize
    MockData --> Pending: Auto Detection

    state Pending {
        [*] --> PendingDisplay
        PendingDisplay --> ReviewModal: User Clicks
        ReviewModal --> PendingDisplay: Cancel
    }

    ReviewModal --> BlockchainProcessing: User Confirms

    state BlockchainProcessing {
        [*] --> GenerateHash
        GenerateHash --> CreateTx
        CreateTx --> RequestSignature
        RequestSignature --> AnnounceToNetwork
        AnnounceToNetwork --> Polling
        Polling --> Polling: Check Status (every 3s)
        Polling --> Confirmed: Transaction Confirmed
        Polling --> Failed: Timeout (60s)
    }

    Confirmed --> AIProcessing

    state AIProcessing {
        [*] --> RequestSummary
        RequestSummary --> GeneratingSummary
        GeneratingSummary --> SummaryReady: Success
        GeneratingSummary --> SummaryFailed: Error
    }

    SummaryReady --> ConfirmedDisplay
    SummaryFailed --> ConfirmedDisplay
    Failed --> PendingDisplay: Retry Available

    ConfirmedDisplay --> TreeVisualization: Navigate to Tree
    ConfirmedDisplay --> PortfolioView: Navigate to Portfolio
    ConfirmedDisplay --> Verification: Verify Proof

    Verification --> [*]

    note right of Pending
        ユーザーは記録を編集不可
        確認または却下のみ可能
    end note

    note right of BlockchainProcessing
        Symbol Testnetへの記録
        最大60秒でタイムアウト
    end note

    note right of AIProcessing
        Gemini APIで要約生成
        リトライロジック付き
    end note
```

### データ変換フロー

```mermaid
graph LR
    subgraph "Input"
        BS[BrowsingSession<br/>url, title, timestamps<br/>scrollDepth, revisits]
    end

    subgraph "Detection Logic"
        Calc1[Calculate Duration<br/>endTime - startTime]
        Calc2[Calculate Understanding<br/>formula-based score]
        Calc3[Extract Tags<br/>from URL & domain]
        Calc4[Generate Auto Note<br/>template-based]
    end

    subgraph "Output"
        LR[LearningRecord<br/>id, userId, url, title<br/>duration, understanding<br/>tags, note, createdAt<br/>proofStatus: pending]
    end

    subgraph "Blockchain"
        Hash[Calculate Content Hash<br/>SHA-256 of record fields]
        Payload[Create Transaction Payload<br/>type, version, metadata]
        Tx[SymbolTransaction<br/>txHash, blockHeight]
    end

    subgraph "AI Enhancement"
        Summary[Generate AI Summary<br/>Gemini API]
        Enhanced[Enhanced LearningRecord<br/>with aiSummary]
    end

    BS --> Calc1
    BS --> Calc2
    BS --> Calc3
    BS --> Calc4

    Calc1 --> LR
    Calc2 --> LR
    Calc3 --> LR
    Calc4 --> LR

    LR --> Hash
    Hash --> Payload
    Payload --> Tx

    Tx --> Summary
    Summary --> Enhanced

    style BS fill:#FFF9C4
    style LR fill:#C8E6C9
    style Tx fill:#81C784
    style Enhanced fill:#4CAF50
```

---

## セキュリティ考慮事項

### データ整合性保証

```mermaid
graph TB
    subgraph "Content Hash Calculation"
        Fields[Record Fields<br/>id, url, title, duration<br/>understanding, note<br/>tags, createdAt]
        Normalize[Normalize Data<br/>JSON.stringify with sorted keys]
        Hash[SHA-256 Hash<br/>crypto.subtle.digest]
    end

    subgraph "Blockchain Storage"
        Payload[Transaction Payload<br/>contentHash included]
        Immutable[Immutable Ledger<br/>Symbol Blockchain]
    end

    subgraph "Verification Process"
        LocalData[Local Record]
        Recalculate[Recalculate Hash]
        Compare[Compare Hashes]
        Result[Verification Result<br/>✅ Valid / ❌ Invalid]
    end

    Fields --> Normalize
    Normalize --> Hash
    Hash --> Payload
    Payload --> Immutable

    Immutable --> Compare
    LocalData --> Recalculate
    Recalculate --> Compare
    Compare --> Result

    style Hash fill:#FF6B6B
    style Immutable fill:#44D62C
    style Result fill:#4A90E2
```

### 改ざん防止メカニズム

1. **自動記録**: ユーザーがデータを編集不可（システムが生成）
2. **コンテンツハッシュ**: 記録内容のSHA-256ハッシュを計算
3. **ブロックチェーン記録**: ハッシュをSymbol Testnetに記録
4. **検証可能性**: 第三者が任意に真正性を検証可能

---

## パフォーマンス考慮事項

### データ読み込み戦略

```mermaid
graph LR
    subgraph "Initial Load"
        Mount[Component Mount]
        LoadMock[Load Mock JSON<br/>~10-15 records]
        LoadLocal[Load LocalStorage<br/>Confirmed records]
    end

    subgraph "Lazy Loading"
        TreePage[Tree Page]
        PortfolioPage[Portfolio Page]
        LazyLoad[Load on Demand<br/>React Flow library]
    end

    subgraph "Caching"
        LocalCache[LocalStorage Cache<br/>5-10MB limit]
        AICache[AI Summary Cache<br/>Avoid regeneration]
    end

    Mount --> LoadMock
    Mount --> LoadLocal
    LoadMock --> LocalCache
    LoadLocal --> LocalCache

    TreePage --> LazyLoad
    PortfolioPage --> LazyLoad

    AICache --> LocalCache

    style LoadMock fill:#FFF9C4
    style LocalCache fill:#FFB74D
    style LazyLoad fill:#81C784
```

### トランザクション最適化

- **ポーリング戦略**: 3秒間隔、最大60秒
- **バッチ処理**: 将来的に複数記録を一度に確認可能
- **リトライロジック**: AI要約生成は最大3回リトライ（指数バックオフ）

---

## デプロイメント構成

```mermaid
graph TB
    subgraph "Development"
        DevEnv[Local Development<br/>localhost:3000]
        TestWallet[Symbol Testnet Wallet<br/>Manual Testing]
    end

    subgraph "Production (Future)"
        Vercel[Vercel Deployment<br/>Next.js Hosting]
        EdgeFunc[Edge Functions<br/>API Routes]
        StaticAssets[Static Assets<br/>CDN]
    end

    subgraph "External Services"
        SymbolTest[Symbol Testnet<br/>Always Available]
        GeminiProd[Gemini API<br/>Production Endpoint]
    end

    DevEnv --> TestWallet
    DevEnv --> SymbolTest
    DevEnv --> GeminiProd

    Vercel --> EdgeFunc
    Vercel --> StaticAssets
    EdgeFunc --> GeminiProd
    StaticAssets --> SymbolTest

    style DevEnv fill:#4A90E2
    style Vercel fill:#000000,color:#FFFFFF
    style SymbolTest fill:#44D62C
    style GeminiProd fill:#FF6B6B
```

---

## 今後の拡張性

### Phase 2: Browser Extension

```mermaid
graph TB
    subgraph "Browser Extension"
        Background[Background Script<br/>Real Browsing Detection]
        ContentScript[Content Script<br/>Page Activity Tracking]
        Popup[Extension Popup<br/>Quick View]
    end

    subgraph "Web App"
        WebUI[Next.js Web UI<br/>Full Management]
        API[API Endpoints<br/>Sync Extension Data]
    end

    subgraph "Backend (Future)"
        Database[PostgreSQL<br/>Multi-user Support]
        Auth[Authentication<br/>User Accounts]
    end

    Background --> ContentScript
    ContentScript --> Popup
    Popup --> API
    API --> WebUI
    API --> Database
    WebUI --> Auth

    style Background fill:#FFA726
    style WebUI fill:#4A90E2
    style Database fill:#66BB6A
```

---

## まとめ

本アーキテクチャは以下の原則に基づいて設計されています：

1. **自動性**: ユーザー入力を最小化し、システムが客観的にデータを生成
2. **透明性**: すべてのデータフローが可視化され、検証可能
3. **改ざん耐性**: ブロックチェーンによる暗号学的保証
4. **拡張性**: モジュール設計により、将来的な機能追加が容易
5. **シンプルさ**: デモスコープに最適化し、不要な複雑性を排除

この設計により、2-3週間でのMVP実装が可能であり、インターンシップのデモンストレーションに十分な価値を提供できます。
