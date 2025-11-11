# ホームページ - ワイヤーフレーム

**ページパス**: `/`
**ファイル**: `src/app/page.tsx`

---

## 画面構成図

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header                                   │
│  [Logo] symproof-tree    [Home] [Tree] [Portfolio] [Verify]    │
│                                          [Symbol Testnet 🟢]    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     ページタイトル                        │   │
│  │                                                           │   │
│  │              学習記録管理システム                         │   │
│  │     Web上での学習活動を自動記録し、ブロックチェーンで    │   │
│  │               改ざん不可能な証跡として保存               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Pending Records] タブ    [Confirmed Records] タブ     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Pending Records タブの内容 (PendingRecords コンポーネント)│ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  📄 RecordCard #1                      [🔵 Pending] │ │ │
│  │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │ │ │
│  │  │  📌 Routing: Defining Routes | Next.js            │ │ │
│  │  │  🔗 nextjs.org/docs/app/building-your...          │ │ │
│  │  │                                                     │ │ │
│  │  │  ⏱️  学習時間: 45分    📊 理解度: 4/5             │ │ │
│  │  │  🏷️  タグ: Next.js, web-development, ルーティング │ │ │
│  │  │                                                     │ │ │
│  │  │  📝 自動記録されたセッション (スクロール深度: 85%)  │ │ │
│  │  │                                                     │ │ │
│  │  │              [ブロックチェーンに記録する]          │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  📄 RecordCard #2                      [🔵 Pending] │ │ │
│  │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │ │ │
│  │  │  📌 Aggregate Transaction - Symbol Docs           │ │ │
│  │  │  🔗 docs.symbol.dev/concepts/aggregate...          │ │ │
│  │  │                                                     │ │ │
│  │  │  ⏱️  学習時間: 120分   📊 理解度: 5/5             │ │ │
│  │  │  🏷️  タグ: Symbol, Blockchain, トランザクション   │ │ │
│  │  │                                                     │ │ │
│  │  │  📝 自動記録されたセッション (スクロール深度: 95%)  │ │ │
│  │  │                                                     │ │ │
│  │  │              [ブロックチェーンに記録する]          │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  📄 RecordCard #3                      [🔵 Pending] │ │ │
│  │  │  ... (同様のカード)                                │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ※ Confirmed Recordsタブをクリックすると下記に切り替わる       │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Confirmed Records (ConfirmedRecords コンポーネント)        │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  📄 RecordCard #1              [✅ Confirmed] [⛓️]   │ │ │
│  │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │ │ │
│  │  │  📌 Learn React                                     │ │ │
│  │  │  🔗 react.dev/learn                                 │ │ │
│  │  │                                                     │ │ │
│  │  │  ⏱️  学習時間: 90分    📊 理解度: 4/5             │ │ │
│  │  │  🏷️  タグ: React, JavaScript                       │ │ │
│  │  │                                                     │ │ │
│  │  │  🤖 AI要約:                                        │ │ │
│  │  │     Reactの基本概念について学習。コンポーネント、   │ │ │
│  │  │     Props、Stateの仕組みを理解。                   │ │ │
│  │  │                                                     │ │ │
│  │  │  ⛓️  TxHash: E7A4B9C2...F2A4B6                     │ │ │
│  │  │  📦 Block: 1234567                                  │ │ │
│  │  │                                                     │ │ │
│  │  │     [Symbol Explorerで確認]  [詳細を見る]         │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  📄 RecordCard #2              [✅ Confirmed] [⛓️]   │ │ │
│  │  │  ... (同様のカード、ブロックチェーン情報付き)        │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     ConfirmationModal                            │
│  (RecordCardクリック時にオーバーレイで表示)                     │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                  [×]     │   │
│  │              記録内容の確認                              │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │   │
│  │                                                           │   │
│  │  📌 タイトル: Routing: Defining Routes | Next.js        │   │
│  │  🔗 URL: https://nextjs.org/docs/app/building...        │   │
│  │                                                           │   │
│  │  ⏱️  学習時間: 45分                                      │   │
│  │  📊 理解度: 4/5 ⭐⭐⭐⭐☆                              │   │
│  │  🏷️  タグ: Next.js, web-development, ルーティング       │   │
│  │                                                           │   │
│  │  📝 メモ:                                                │   │
│  │  自動記録されたセッション (スクロール深度: 85%,         │   │
│  │  再訪回数: 2回)                                          │   │
│  │                                                           │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │   │
│  │                                                           │   │
│  │  🔐 コンテンツハッシュ (SHA-256):                        │   │
│  │  a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4...   │   │
│  │                                                           │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │   │
│  │                                                           │   │
│  │  ⚠️  警告: 記録後は変更できません                       │   │
│  │  この記録をSymbol Testnetに永続的に記録します。         │   │
│  │                                                           │   │
│  │                                                           │   │
│  │          [キャンセル]  [ブロックチェーンに記録する]      │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## コンポーネント構成

### 1. **Header** (`src/components/Header.tsx`)

**役割**: グローバルナビゲーション

**機能**:
- ロゴ表示
- ページ間ナビゲーション（Home, Tree, Portfolio, Verify）
- Symbol Testnet接続状態インジケーター
- レスポンシブメニュー（モバイル対応）

**表示内容**:
- アプリケーション名: "symproof-tree"
- ナビゲーションリンク
- ネットワークステータス: "Symbol Testnet 🟢"

---

### 2. **ページタイトルセクション**

**役割**: アプリケーションの説明

**表示内容**:
- メインタイトル: "学習記録管理システム"
- サブタイトル: システムの価値提案を簡潔に説明

---

### 3. **タブナビゲーション**

**役割**: Pending/Confirmedの切り替え

**機能**:
- 2つのタブ: "Pending Records" / "Confirmed Records"
- アクティブタブのハイライト表示
- クリックで表示内容切り替え

**状態管理**:
```typescript
const [activeTab, setActiveTab] = useState<'pending' | 'confirmed'>('pending');
```

---

### 4. **PendingRecords** (`src/components/PendingRecords.tsx`)

**役割**: 自動検出された未確認の学習記録リストを表示

**データソース**:
- `localStorage`: `symproof-tree:pending-records`
- または `public/mock-browsing-sessions.json` を変換

**表示内容**:
- RecordCardのリスト（複数）
- 各カードは自動生成された学習データ
- "ブロックチェーンに記録する" ボタン

**インタラクション**:
- カードクリック → ConfirmationModal表示
- "ブロックチェーンに記録する"ボタンクリック → トランザクション開始

**状態**:
```typescript
const [pendingRecords, setPendingRecords] = useState<LearningRecord[]>([]);
```

---

### 5. **ConfirmedRecords** (`src/components/ConfirmedRecords.tsx`)

**役割**: ブロックチェーンで確認済みの学習記録リストを表示

**データソース**:
- `localStorage`: `symproof-tree:confirmed-records`

**表示内容**:
- RecordCardのリスト（Confirmed状態）
- 各カードにブロックチェーン証明情報
  - トランザクションハッシュ
  - ブロック高
  - AI生成要約
- "Symbol Explorerで確認" ボタン
- "詳細を見る" ボタン

**インタラクション**:
- "Symbol Explorerで確認" → 外部リンク（新しいタブ）
- カードクリック → 詳細モーダル表示

**状態**:
```typescript
const [confirmedRecords, setConfirmedRecords] = useState<LearningRecord[]>([]);
```

---

### 6. **RecordCard** (`src/components/RecordCard.tsx`)

**役割**: 個別の学習記録を表示するカードコンポーネント

**Props**:
```typescript
interface RecordCardProps {
  record: LearningRecord;
  status: 'pending' | 'confirmed';
  onConfirm?: (recordId: string) => void;
  onClick?: (recordId: string) => void;
}
```

**表示内容**:

#### Pending状態の場合:
- ステータスバッジ: "🔵 Pending"
- タイトル
- URL（短縮表示）
- 学習時間
- 理解度スコア（星またはスコア）
- タグ（複数）
- 自動生成メモ
- "ブロックチェーンに記録する" ボタン

#### Confirmed状態の場合:
- ステータスバッジ: "✅ Confirmed" + "⛓️"（ブロックチェーンアイコン）
- 上記に加えて:
  - AI生成要約
  - トランザクションハッシュ
  - ブロック高
  - "Symbol Explorerで確認" リンク

**スタイリング**:
- ホバー効果: カード全体が少し浮き上がる
- クリッカブル: カーソルがポインターに変化
- レスポンシブ: モバイルでは1カラム、デスクトップでは2-3カラム

---

### 7. **ConfirmationModal** (`src/components/ConfirmationModal.tsx`)

**役割**: 記録をブロックチェーンに送信する前の最終確認

**Props**:
```typescript
interface ConfirmationModalProps {
  record: LearningRecord;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recordId: string) => void;
}
```

**表示内容**:
- 記録の全詳細（読み取り専用）
  - タイトル
  - URL（完全版）
  - 学習時間
  - 理解度スコア（星表示）
  - タグ一覧
  - 自動生成メモ
- コンテンツハッシュ（SHA-256、完全表示）
- 警告メッセージ: "⚠️ 記録後は変更できません"
- 説明文: "この記録をSymbol Testnetに永続的に記録します。"

**アクション**:
- "キャンセル" ボタン → モーダルを閉じる
- "ブロックチェーンに記録する" ボタン → トランザクション処理開始

**インタラクション**:
1. ユーザーが "ブロックチェーンに記録する" をクリック
2. コンテンツハッシュを計算
3. Symbol Walletの署名プロンプトを表示
4. トランザクションを送信
5. ポーリングで確認待ち（最大60秒）
6. 確認完了 → ConfirmedRecordsタブに移動
7. AI要約を非同期で生成

**スタイリング**:
- オーバーレイ: 背景を暗く半透明に
- モーダル: 中央配置、白背景、影付き
- スクロール可能（内容が多い場合）

---

## データフロー

### Pending → Confirmed への流れ

```
1. ページ読み込み
   ↓
2. localStorage / mock JSONから Pending Records取得
   ↓
3. PendingRecords コンポーネントに渡す
   ↓
4. RecordCard を複数レンダリング
   ↓
5. ユーザーがカードをクリック
   ↓
6. ConfirmationModal を表示
   ↓
7. ユーザーが "ブロックチェーンに記録する" をクリック
   ↓
8. コンテンツハッシュ計算
   ↓
9. Symbol SDK で TransferTransaction 作成
   ↓
10. Symbol Wallet で署名
   ↓
11. トランザクション送信
   ↓
12. トランザクションハッシュ取得
   ↓
13. ポーリング開始（3秒ごと、最大60秒）
   ↓
14. ブロックチェーンで確認
   ↓
15. 記録を Pending から Confirmed に移動
   ↓
16. localStorage を更新
   ↓
17. Gemini API で要約生成（非同期）
   ↓
18. 要約を記録に追加
   ↓
19. Confirmed Records タブに表示
```

---

## 状態管理

### ページレベルの状態

```typescript
// src/app/page.tsx

const HomePage = () => {
  // タブ状態
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed'>('pending');

  // 記録データ
  const [pendingRecords, setPendingRecords] = useState<LearningRecord[]>([]);
  const [confirmedRecords, setConfirmedRecords] = useState<LearningRecord[]>([]);

  // モーダル状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<LearningRecord | null>(null);

  // ローディング状態
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    // 初期データ読み込み
    loadPendingRecords();
    loadConfirmedRecords();
  }, []);

  const handleConfirm = async (recordId: string) => {
    setIsConfirming(true);
    try {
      // 1. コンテンツハッシュ計算
      const hash = await calculateContentHash(record);

      // 2. Symbol トランザクション作成
      const tx = await createLearningProof(record);

      // 3. 署名と送信
      const txHash = await signAndAnnounce(tx);

      // 4. ポーリングで確認
      await waitForConfirmation(txHash);

      // 5. Confirmed に移動
      moveToConfirmed(recordId);

      // 6. AI要約生成（非同期）
      generateSummary(recordId);

    } catch (error) {
      console.error('Confirmation failed:', error);
      // エラーハンドリング
    } finally {
      setIsConfirming(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <Header />

      <main>
        <PageTitle />

        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'pending' ? (
          <PendingRecords
            records={pendingRecords}
            onRecordClick={(record) => {
              setSelectedRecord(record);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <ConfirmedRecords
            records={confirmedRecords}
          />
        )}
      </main>

      <ConfirmationModal
        record={selectedRecord}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        isLoading={isConfirming}
      />
    </div>
  );
};
```

---

## ユーザーインタラクション

### 主要な操作フロー

1. **Pending Records の閲覧**
   - ページにアクセス
   - デフォルトで Pending タブが表示される
   - 自動検出された学習記録のリストを確認

2. **記録の詳細確認**
   - RecordCard をクリック
   - ConfirmationModal が表示される
   - すべてのフィールドが読み取り専用で表示される

3. **ブロックチェーンへの記録**
   - "ブロックチェーンに記録する" をクリック
   - Symbol Wallet の署名画面が表示される
   - 署名を承認
   - トランザクション送信
   - ローディングインジケーター表示
   - 確認完了（約30秒）

4. **Confirmed Records の確認**
   - Confirmed タブに自動切り替え
   - ブロックチェーン証明付きの記録が表示される
   - AI要約が生成される（10-20秒後）

5. **外部検証**
   - "Symbol Explorerで確認" をクリック
   - 新しいタブでブロックチェーンエクスプローラーが開く
   - トランザクションの詳細を第三者として確認可能

---

## レスポンシブデザイン

### デスクトップ（1024px以上）
- RecordCard: 2-3カラムのグリッドレイアウト
- 各カードの幅: 約350-400px

### タブレット（768px - 1023px）
- RecordCard: 2カラムのグリッドレイアウト
- 各カードの幅: 約300px

### モバイル（767px以下）
- RecordCard: 1カラムの縦スタック
- 各カードの幅: 画面幅の90%
- タブナビゲーションがスクロール可能に

---

## アクセシビリティ

- すべてのボタンに適切な aria-label
- モーダルに focus trap 実装
- キーボードナビゲーション対応（Tab, Enter, Esc）
- カラーコントラスト比 WCAG AA準拠

---

## パフォーマンス考慮

- 仮想スクロール（記録が100件以上の場合）
- 画像の遅延読み込み（もしあれば）
- メモ化（useMemo, useCallback）
- デバウンス処理（検索機能追加時）

---

このページが **symproof-tree** アプリケーションのメインインターフェースとなり、ユーザーが最も多くの時間を費やす画面です。
