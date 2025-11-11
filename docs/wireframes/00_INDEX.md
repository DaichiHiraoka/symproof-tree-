# Wireframes Index

## 概要

このディレクトリには、symproof-tree アプリケーションの全ページの実装後ワイヤーフレームが含まれています。各ワイヤーフレームは、画面レイアウト、コンポーネント構成、データフロー、実装例を提供します。

## ページ一覧

### 1. [HOME - ホームページ](./01_HOME_PAGE.md)
**パス**: `/`
**役割**: 学習記録の一覧表示とブロックチェーン承認管理

**主要コンポーネント**:
- `Header` - ナビゲーションバー
- `TabGroup` - Pending/Confirmed切り替え
- `RecordCard` - 学習記録カード表示
- `ActionButtons` - 承認・詳細ボタン

**主要機能**:
- 学習記録の自動検出と表示
- ブロックチェーン承認リクエスト
- ステータス別フィルタリング
- 学習ツリー・ポートフォリオへの遷移

---

### 2. [TREE - 学習ツリーページ](./02_TREE_PAGE.md)
**パス**: `/tree`
**役割**: 学習記録のインタラクティブなグラフ可視化

**主要コンポーネント**:
- `ReactFlow` - グラフ描画エンジン
- `LearningNode` - カスタムノードコンポーネント
- `NodeDetailPanel` - 選択ノード詳細表示
- `Controls` - ズーム・フィット操作
- `MiniMap` - ナビゲーションマップ

**主要機能**:
- タグベースの自動階層構造生成
- ドラッグ&ドロップでノード配置調整
- ノードクリックで詳細表示
- 理解度に応じた色分け表示
- 学習時間による重み付け

---

### 3. [PORTFOLIO - ポートフォリオページ](./03_PORTFOLIO_PAGE.md)
**パス**: `/portfolio/[userId]`
**役割**: 学習成果の公開・共有ページ

**主要コンポーネント**:
- `StatsSection` - 学習統計ダッシュボード
- `AISummarySection` - Gemini生成の学習サマリ
- `RecordsSection` - 学習記録リスト
- `VerificationSection` - ブロックチェーン検証リンク

**主要機能**:
- 学習記録の統計表示（総時間、平均理解度、完了率）
- AI生成の学習サマリ
- タグ別分布表示
- ブロックチェーン証明への検証リンク
- 就職活動・インターンシップでの活用

---

### 4. [VERIFY - 検証ページ](./04_VERIFY_PAGE.md)
**パス**: `/verify`
**役割**: ブロックチェーン記録の第三者検証

**主要コンポーネント**:
- `SearchForm` - トランザクションハッシュ入力
- `VerificationSteps` - 検証プロセス表示
- `ResultCard` - 検証結果表示
- `RecordDisplay` - 元データ表示

**主要機能**:
- トランザクションハッシュからの記録検証
- Symbol Testnetからのデータ取得
- コンテンツハッシュ整合性チェック
- タイムスタンプ検証
- Symbol Explorerへのリンク

---

## ページ関係図

```
┌─────────────────────────────────────────────────────────────┐
│                        Application Flow                      │
└─────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │   HOME   │ ◄─── Entry Point
    │    /     │
    └────┬─────┘
         │
         ├─────────────┬─────────────┬──────────────┐
         │             │             │              │
    ┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐  ┌─────▼──────┐
    │   TREE   │ │ PORTFOLIO│ │  VERIFY  │  │ New Record │
    │  /tree   │ │/portfolio│ │ /verify  │  │  (Auto)    │
    └────┬─────┘ └────┬─────┘ └──────────┘  └─────┬──────┘
         │            │                            │
         │            │                            │
         └────────────┴────────────────────────────┘
                      │
                 ┌────▼─────┐
                 │ Blockchain│
                 │ Confirmation│
                 └──────────┘
```

## コンポーネント再利用マトリックス

| コンポーネント | HOME | TREE | PORTFOLIO | VERIFY | 説明 |
|--------------|------|------|-----------|--------|------|
| `Header` | ✓ | ✓ | ✓ | ✓ | グローバルナビゲーション |
| `RecordCard` | ✓ | - | ✓ | ✓ | 学習記録カード表示 |
| `StatusBadge` | ✓ | ✓ | ✓ | ✓ | ステータス表示バッジ |
| `UnderstandingStars` | ✓ | ✓ | ✓ | ✓ | 理解度の星表示 |
| `TagList` | ✓ | ✓ | ✓ | ✓ | タグリスト表示 |
| `LoadingSpinner` | ✓ | ✓ | ✓ | ✓ | ローディング状態 |
| `ErrorMessage` | ✓ | ✓ | ✓ | ✓ | エラー表示 |
| `LearningNode` | - | ✓ | - | - | React Flow カスタムノード |
| `NodeDetailPanel` | - | ✓ | - | - | ノード詳細パネル |
| `StatsCard` | - | - | ✓ | - | 統計カード |
| `VerificationSteps` | - | - | - | ✓ | 検証ステップ表示 |

## 共通パターン

### 1. データフェッチング
全ページで共通のデータ取得パターンを使用:

```typescript
const [records, setRecords] = useState<LearningRecord[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchRecords();
      setRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### 2. エラーハンドリング
統一されたエラー表示UI:

```typescript
{error && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <p className="text-red-800">{error}</p>
  </div>
)}
```

### 3. ローディング状態
全ページで一貫したローディングUI:

```typescript
{loading && (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)}
```

### 4. レスポンシブデザイン
Tailwind CSSのブレークポイントを使用:
- `sm:` - 640px以上
- `md:` - 768px以上
- `lg:` - 1024px以上

### 5. アクセシビリティ
- セマンティックHTML使用 (`<nav>`, `<main>`, `<section>`)
- ARIA属性 (`aria-label`, `role`)
- キーボードナビゲーション対応
- スクリーンリーダー対応

## データフロー概要

```
┌──────────────┐
│ Browser      │
│ LocalStorage │
└──────┬───────┘
       │
       │ Read/Write Learning Records
       │
┌──────▼───────────────────────────────────────────────┐
│ React Context (AppContext)                           │
│ - records: LearningRecord[]                          │
│ - addRecord(record: LearningRecord): void            │
│ - updateRecord(id: string, updates: Partial): void   │
│ - deleteRecord(id: string): void                     │
└──────┬───────────────────────────────────────────────┘
       │
       │ Provide to all pages
       │
┌──────▼─────┬──────────┬──────────┬──────────┐
│ HOME       │ TREE     │ PORTFOLIO│ VERIFY   │
└────────────┴──────────┴──────────┴──────────┘
```

## 実装優先順位

### フェーズ1: コア機能 (Week 1-2)
1. **HOME ページ** - 基本的な記録表示とステータス管理
2. **共通コンポーネント** - RecordCard, Header, StatusBadge
3. **LocalStorage統合** - データ永続化
4. **ブロックチェーン統合** - Symbol SDK基本実装

### フェーズ2: 可視化 (Week 3)
1. **TREE ページ** - React Flow統合
2. **ノードレイアウトアルゴリズム** - タグベース階層生成
3. **インタラクション** - ノード選択・ドラッグ

### フェーズ3: 共有機能 (Week 4)
1. **PORTFOLIO ページ** - 統計計算とAIサマリ
2. **Gemini API統合** - 学習サマリ生成
3. **VERIFY ページ** - ブロックチェーン検証

### フェーズ4: 仕上げ (Week 5)
1. **レスポンシブデザイン** - モバイル対応
2. **エラーハンドリング** - 包括的なエラー処理
3. **パフォーマンス最適化** - メモ化、遅延読み込み
4. **アクセシビリティ** - WCAG準拠

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript (Strict Mode)
- **スタイリング**: Tailwind CSS
- **グラフ可視化**: React Flow
- **ブロックチェーン**: Symbol SDK
- **AI**: Google Gemini API (gemini-1.5-flash)
- **状態管理**: React Context + LocalStorage
- **ルーティング**: Next.js File-based Routing

## 開発ガイドライン

### コンポーネント設計原則
1. **単一責任**: 各コンポーネントは1つの責任を持つ
2. **再利用性**: 共通コンポーネントは抽象化して再利用
3. **型安全**: すべてのPropsとStateに型定義
4. **テスタビリティ**: 純粋関数として設計

### ファイル構造
```
src/
├── app/
│   ├── page.tsx              # HOME
│   ├── tree/
│   │   └── page.tsx          # TREE
│   ├── portfolio/
│   │   └── [userId]/
│   │       └── page.tsx      # PORTFOLIO
│   └── verify/
│       └── page.tsx          # VERIFY
├── components/
│   ├── common/               # 共通コンポーネント
│   ├── home/                 # HOMEページ専用
│   ├── tree/                 # TREEページ専用
│   ├── portfolio/            # PORTFOLIOページ専用
│   └── verify/               # VERIFYページ専用
├── contexts/
│   └── AppContext.tsx        # グローバル状態管理
├── lib/
│   ├── symbol.ts             # Symbol SDK関数
│   ├── gemini.ts             # Gemini API関数
│   └── storage.ts            # LocalStorage関数
└── types/
    └── index.ts              # 型定義
```

### コーディング規約
- **インデント**: 2スペース
- **命名規則**:
  - コンポーネント: PascalCase
  - 関数/変数: camelCase
  - 定数: UPPER_SNAKE_CASE
  - インターフェース: PascalCase (I prefix なし)
- **コメント**: JSDocスタイル
- **import順序**: React → 外部ライブラリ → 内部モジュール

## テスト戦略

### 単体テスト
- **対象**: ユーティリティ関数、カスタムHooks
- **ツール**: Jest + React Testing Library

### 統合テスト
- **対象**: ページコンポーネント、データフロー
- **ツール**: Jest + React Testing Library

### E2Eテスト
- **対象**: ユーザーフロー全体
- **ツール**: Playwright

## 参考資料

- [SPEC.md](../SPEC.md) - 完全な仕様書
- [ARCHITECTURE.md](../ARCHITECTURE.md) - システムアーキテクチャ
- [DATA_MODELS.md](../DATA_MODELS.md) - データモデル仕様
- [SETUP.md](../SETUP.md) - 環境セットアップ
- [DEMO_GUIDE.md](../DEMO_GUIDE.md) - デモシナリオ

---

## 更新履歴

- 2025-11-12: 初版作成 (全4ページのワイヤーフレーム完成)
