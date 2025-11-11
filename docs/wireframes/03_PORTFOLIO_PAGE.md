# ポートフォリオページ - ワイヤーフレーム

**ページパス**: `/portfolio/[id]`
**ファイル**: `src/app/portfolio/[id]/page.tsx`

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
│  │                  ポートフォリオヘッダー                  │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │   │
│  │                                                           │   │
│  │  👤 ユーザー ID: TABC1234...XYZ                         │   │
│  │  📅 ポートフォリオ作成日: 2024-10-25                    │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │        学習統計ダッシュボード                    │   │   │
│  │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │   │   │
│  │  │                                                   │   │   │
│  │  │  📊 総記録数: 15件     ⏱️  総学習時間: 675分  │   │   │
│  │  │  📈 平均理解度: 4.2/5  🎯 完了率: 80%         │   │   │
│  │  │                                                   │   │   │
│  │  │  🏷️  頻出タグ TOP5:                            │   │   │
│  │  │  [Next.js] [React] [Symbol] [TypeScript] [API] │   │   │
│  │  │                                                   │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │           [📤 URLをコピー]  [📥 PDFでエクスポート]      │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              AI生成 全体サマリー                         │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │   │
│  │                                                           │   │
│  │  🤖 学習の概要:                                          │   │
│  │                                                           │   │
│  │  このポートフォリオは、Web開発とブロックチェーン技術に  │   │
│  │  関する包括的な学習記録を示しています。主にNext.js、    │   │
│  │  React、TypeScriptを中心としたフロントエンド開発、      │   │
│  │  およびSymbol SDKを用いたブロックチェーン統合の         │   │
│  │  スキルを習得しました。総学習時間は675分におよび、      │   │
│  │  平均理解度4.2という高い習熟度を達成しています。        │   │
│  │                                                           │   │
│  │  🎯 主要な学習トピック:                                  │   │
│  │  • Next.js App Routerによるモダンなフロントエンド開発   │   │
│  │  • React HooksとState管理の実践                         │   │
│  │  • TypeScriptによる型安全な開発                         │   │
│  │  • Symbol blockchainのSDKとトランザクション処理         │   │
│  │  • React Flowを用いた可視化技術                         │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      セクションタブ                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│  [📚 学習記録一覧] [🌳 学習ツリー] [✅ 検証情報]              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               学習記録一覧セクション (デフォルト表示)           │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  🔍 検索とフィルター                                       │ │
│  │  [検索...] [タグ: すべて ▼] [理解度: すべて ▼]          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  📄 RecordCard #1                     [✅ Confirmed] [⛓️]   │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │ │
│  │  📌 Routing: Defining Routes | Next.js                    │ │
│  │  🔗 nextjs.org/docs/app/building-your-application...      │ │
│  │                                                             │ │
│  │  ⏱️  学習時間: 45分    📊 理解度: 4/5                    │ │
│  │  🏷️  タグ: Next.js, web-development, ルーティング        │ │
│  │  📅 記録日時: 2024-11-01 15:15                            │ │
│  │                                                             │ │
│  │  🤖 AI要約:                                               │ │
│  │  Next.jsのApp Routerについて学習。サーバーコンポーネントと│ │
│  │  クライアントコンポーネントの使い分けを理解し、           │ │
│  │  ルーティングの基本概念を習得。                           │ │
│  │                                                             │ │
│  │  ⛓️  ブロックチェーン証明:                               │ │
│  │  TxHash: E7A4B9...F2A4B6                                   │ │
│  │  Block: 1234567                                             │ │
│  │                                                             │ │
│  │  [Symbol Explorerで確認]                                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  📄 RecordCard #2                     [✅ Confirmed] [⛓️]   │ │
│  │  ... (同様の形式で表示)                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  📄 RecordCard #3-15                                       │ │
│  │  ... (残りの記録)                                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
│  [さらに読み込む...]                                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│           学習ツリーセクション (タブクリック時に表示)           │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                             │ │
│  │           [LearningTree コンポーネント埋め込み]            │ │
│  │                                                             │ │
│  │  (Tree Pageと同じツリー可視化、読み取り専用モード)        │ │
│  │                                                             │ │
│  │  • ズーム・パン可能                                        │ │
│  │  • ノードクリックで詳細表示                               │ │
│  │  • ドラッグ不可（配置変更不可）                           │ │
│  │                                                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│             検証情報セクション (タブクリック時に表示)           │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ブロックチェーン検証ガイド                                │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │ │
│  │                                                             │ │
│  │  このポートフォリオのすべての学習記録は、Symbol          │ │
│  │  Testnet上に記録されており、第三者が真正性を検証できます│ │
│  │                                                             │ │
│  │  🔍 検証手順:                                             │ │
│  │  1. 各記録のトランザクションハッシュをコピー              │ │
│  │  2. Verifyページにアクセス                                │ │
│  │  3. ハッシュを入力して検証                                │ │
│  │  4. Symbol Explorerで詳細確認                             │ │
│  │                                                             │ │
│  │  ⛓️  ブロックチェーン統計:                               │ │
│  │  • 総トランザクション数: 15件                            │ │
│  │  • 最古の記録: 2024-10-25 (Block 1234500)                │ │
│  │  • 最新の記録: 2024-11-01 (Block 1235600)                │ │
│  │  • 平均確認時間: 32秒                                     │ │
│  │                                                             │ │
│  │           [すべての記録を一括検証]                        │ │
│  │                                                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  トランザクション一覧                                      │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │ │
│  │                                                             │ │
│  │  1. E7A4B9...F2A4B6  Block: 1234567  [検証済み ✅]       │ │
│  │  2. A1B2C3...E9F0A1  Block: 1234700  [検証済み ✅]       │ │
│  │  3. C5D6E7...B2C4D6  Block: 1234850  [検証済み ✅]       │ │
│  │  ... (残り12件)                                           │ │
│  │                                                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          フッター                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│                                                                   │
│  📬 このポートフォリオについて:                                 │
│  • すべての学習記録は自動的に生成され、ユーザーによる編集は    │
│    行われていません                                             │
│  • 各記録はSymbol blockchainに記録されており、改ざん不可能です │
│  • AI要約はGoogle Gemini APIによって自動生成されています       │
│                                                                   │
│  🔗 検証リンク:                                                 │
│  Symbol Testnet Explorer: https://testnet.symbol.fyi/           │
│  Verifyページ: /verify                                          │
│                                                                   │
│  ⚖️  このポートフォリオの使用について:                         │
│  このポートフォリオは就職活動や学習証明として使用できます。     │
│  URLを共有することで、誰でも内容を閲覧し、ブロックチェーン     │
│  上で真正性を検証できます。                                     │
│                                                                   │
│  生成日時: 2024-11-01 16:00:00                                  │
│  最終更新: 2024-11-01 16:00:00                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## コンポーネント構成

### 1. **Header** (`src/components/Header.tsx`)

**役割**: グローバルナビゲーション（全ページ共通）

---

### 2. **ポートフォリオヘッダー**

**役割**: ユーザー情報と学習統計のサマリー

**表示内容**:

#### ユーザー情報
- 👤 ユーザーID: Symbol address（短縮表示）
- 📅 ポートフォリオ作成日

#### 学習統計ダッシュボード
- 📊 総記録数
- ⏱️ 総学習時間（分）
- 📈 平均理解度（小数点1桁）
- 🎯 完了率（%）
- 🏷️ 頻出タグ TOP5

**アクション**:
- 📤 URLをコピー: 現在のページURLをクリップボードにコピー
- 📥 PDFでエクスポート: ポートフォリオをPDF形式でダウンロード（将来機能）

**データ計算**:
```typescript
const calculateStats = (records: LearningRecord[]): PortfolioStats => {
  const totalRecords = records.length;
  const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);
  const totalUnderstanding = records.reduce((sum, r) => sum + r.understanding, 0);
  const averageUnderstanding = totalRecords > 0
    ? Math.round((totalUnderstanding / totalRecords) * 10) / 10
    : 0;

  const confirmedRecords = records.filter(r => r.proofStatus === 'confirmed');
  const completionRate = totalRecords > 0
    ? Math.round((confirmedRecords.length / totalRecords) * 100)
    : 0;

  // タグ頻度計算
  const tagFrequency: Record<string, number> = {};
  records.forEach(record => {
    record.tags.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });
  });

  const topTags = Object.entries(tagFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  return {
    totalRecords,
    totalDuration,
    averageUnderstanding,
    completionRate,
    topTags,
  };
};
```

---

### 3. **AI生成 全体サマリー**

**役割**: ポートフォリオ全体の学習内容を要約

**データソース**:
- Gemini API で生成（ポートフォリオ作成時またはキャッシュ）

**表示内容**:
- 🤖 学習の概要: 2-3段落の包括的な要約
- 🎯 主要な学習トピック: 箇条書きリスト（5-7項目）

**生成プロンプト例**:
```
以下の学習記録ポートフォリオ全体を要約してください：

総記録数: 15件
総学習時間: 675分
主要タグ: Next.js, React, Symbol, TypeScript

記録一覧:
1. Next.js App Router (45分, 理解度4/5)
2. Symbol Aggregate Transaction (120分, 理解度5/5)
...

上記の情報から:
1. 学習全体の概要を2-3段落で説明
2. 主要な学習トピックを5-7個の箇条書きで列挙
```

**スタイリング**:
- 背景: ライトブルーまたはグレー
- パディング: 十分な余白
- 読みやすいフォントサイズ

---

### 4. **セクションタブナビゲーション**

**役割**: 3つのセクション間の切り替え

**タブ**:
1. 📚 学習記録一覧（デフォルト）
2. 🌳 学習ツリー
3. ✅ 検証情報

**状態管理**:
```typescript
const [activeSection, setActiveSection] = useState<'records' | 'tree' | 'verification'>('records');
```

---

### 5. **学習記録一覧セクション**

**役割**: すべての確認済み学習記録を一覧表示

#### 検索とフィルター

**機能**:
- 🔍 テキスト検索: タイトル・URLで検索
- タグフィルター: ドロップダウンでタグを選択
- 理解度フィルター: 1-5のスコアで絞り込み

**状態管理**:
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [selectedTag, setSelectedTag] = useState<string | null>(null);
const [selectedUnderstanding, setSelectedUnderstanding] = useState<number | null>(null);

const filteredRecords = useMemo(() => {
  return records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = !selectedTag || record.tags.includes(selectedTag);

    const matchesUnderstanding = !selectedUnderstanding ||
                                 record.understanding === selectedUnderstanding;

    return matchesSearch && matchesTag && matchesUnderstanding;
  });
}, [records, searchQuery, selectedTag, selectedUnderstanding]);
```

#### RecordCard一覧

**表示内容**:
- ConfirmedRecords コンポーネントと同じRecordCard
- ただしポートフォリオ用に読み取り専用モード
- ページネーションまたは無限スクロール（記録が多い場合）

**インタラクション**:
- "Symbol Explorerで確認" リンク → 外部リンク
- カード全体クリック → 詳細モーダル表示（オプション）

---

### 6. **学習ツリーセクション**

**役割**: 学習の全体像を可視化

**コンポーネント**:
- LearningTree コンポーネントを埋め込み
- Tree Pageと同じ機能

**読み取り専用モード**:
- ノードのドラッグ不可
- 配置変更の保存不可
- ズーム・パン・クリックは可能

**表示モード**:
```typescript
<LearningTree
  nodes={nodes}
  edges={edges}
  readonly={true}
  onNodeClick={handleNodeClick}
/>
```

---

### 7. **検証情報セクション**

**役割**: ブロックチェーン検証に関する情報提供

#### 検証ガイド

**表示内容**:
- 検証手順の説明（4ステップ）
- ブロックチェーン統計:
  - 総トランザクション数
  - 最古の記録（日時とブロック高）
  - 最新の記録（日時とブロック高）
  - 平均確認時間
- "すべての記録を一括検証" ボタン

**一括検証機能**:
```typescript
const verifyAllRecords = async () => {
  const results = await Promise.all(
    records.map(record => verifyProof(record.txHash))
  );

  const allValid = results.every(r => r.valid);

  if (allValid) {
    showNotification('✅ すべての記録が検証されました');
  } else {
    showNotification('⚠️ 一部の記録に問題があります');
  }
};
```

#### トランザクション一覧

**表示内容**:
- トランザクションハッシュ（短縮表示）
- ブロック高
- 検証ステータス（✅ または ⚠️）
- クリックで詳細表示

**テーブル形式**:
```
| # | TxHash         | Block   | Status |
|---|----------------|---------|--------|
| 1 | E7A4B9...F2A4B6| 1234567 | ✅     |
| 2 | A1B2C3...E9F0A1| 1234700 | ✅     |
...
```

---

### 8. **フッター**

**役割**: ポートフォリオの使用方法と信頼性情報

**表示内容**:
- 📬 このポートフォリオについて: 3つの重要ポイント
- 🔗 検証リンク: Symbol Explorer、Verifyページ
- ⚖️ 使用について: 利用方法の説明
- 生成日時と最終更新日時

---

## ページロジック

### 初期化

```typescript
// src/app/portfolio/[id]/page.tsx

const PortfolioPage = ({ params }: { params: { id: string } }) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'records' | 'tree' | 'verification'>('records');

  useEffect(() => {
    loadPortfolio(params.id);
  }, [params.id]);

  const loadPortfolio = async (userId: string) => {
    setIsLoading(true);
    try {
      // 1. LocalStorageからポートフォリオデータ取得
      const portfolioData = getPortfolioByUserId(userId);

      if (!portfolioData) {
        // ポートフォリオが存在しない
        throw new Error('Portfolio not found');
      }

      // 2. AI全体サマリーを生成（キャッシュがない場合）
      if (!portfolioData.summary) {
        const summary = await generatePortfolioSummary(portfolioData.records);
        portfolioData.summary = summary;
        savePortfolio(portfolioData);
      }

      // 3. 統計情報を計算
      portfolioData.stats = calculateStats(portfolioData.records);

      setPortfolio(portfolioData);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
      // エラー表示
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showNotification('✅ URLをコピーしました');
  };

  const handleExportPdf = async () => {
    // PDF生成ロジック（将来実装）
    showNotification('🚧 この機能は開発中です');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!portfolio) {
    return <PortfolioNotFound />;
  }

  return (
    <div>
      <Header />

      <main>
        <PortfolioHeader
          userId={portfolio.userId}
          createdAt={portfolio.createdAt}
          stats={portfolio.stats}
          onCopyUrl={handleCopyUrl}
          onExportPdf={handleExportPdf}
        />

        <AiSummarySection summary={portfolio.summary} />

        <SectionTabs
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {activeSection === 'records' && (
          <RecordsSection records={portfolio.records} />
        )}

        {activeSection === 'tree' && (
          <TreeSection treeData={portfolio.treeData} records={portfolio.records} />
        )}

        {activeSection === 'verification' && (
          <VerificationSection records={portfolio.records} />
        )}
      </main>

      <PortfolioFooter
        createdAt={portfolio.createdAt}
        updatedAt={portfolio.updatedAt}
      />
    </div>
  );
};
```

---

## データフロー

### ポートフォリオ生成

```
1. ユーザーが初めてPortfolioページにアクセス
   ↓
2. [id]からuserIdを取得
   ↓
3. LocalStorageで該当ポートフォリオを検索
   ↓
4. 存在しない場合 → "Portfolio not found" 表示
   ↓
5. 存在する場合 → データ読み込み
   ↓
6. AI全体サマリーがない場合 → Gemini APIで生成
   ↓
7. 統計情報を計算
   ↓
8. ポートフォリオを表示
```

### セクション切り替え

```
ユーザーがタブをクリック
  ↓
activeSection状態を更新
  ↓
該当セクションのコンポーネントをレンダリング
  ↓
他のセクションは非表示
```

---

## 公開URL生成

### URL構造

```
https://yourdomain.com/portfolio/[userId]
```

**例**:
```
http://localhost:3000/portfolio/TABC1234567890XYZABC1234567890XYZABC1234
```

### シェア機能

**URLコピー**:
```typescript
const copyPortfolioUrl = () => {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${userId}`;
  navigator.clipboard.writeText(url);
  toast.success('ポートフォリオURLをコピーしました');
};
```

**SNSシェア**（将来機能）:
- Twitter
- LinkedIn
- Facebook

---

## レスポンシブデザイン

### デスクトップ（1024px以上）
- 統計ダッシュボード: 横並び4カラム
- RecordCard: 2カラムグリッド
- ツリー: フルサイズ表示

### タブレット（768px - 1023px）
- 統計ダッシュボード: 2カラム
- RecordCard: 1-2カラムグリッド
- ツリー: 画面幅に合わせて縮小

### モバイル（767px以下）
- 統計ダッシュボード: 1カラム縦スタック
- RecordCard: 1カラム
- ツリー: タッチ操作対応
- タブナビゲーション: スクロール可能

---

## SEO最適化

### メタタグ

```typescript
export const metadata: Metadata = {
  title: `学習ポートフォリオ | symproof-tree`,
  description: `Symbol blockchainで検証可能な学習記録ポートフォリオ。総学習時間${stats.totalDuration}分、${stats.totalRecords}件の記録。`,
  openGraph: {
    title: '学習ポートフォリオ',
    description: 'ブロックチェーンで検証可能な学習記録',
    images: ['/og-image.png'],
  },
};
```

---

## アクセシビリティ

- すべてのセクションにheading構造（h2, h3）
- ARIAラベル付きのナビゲーション
- キーボードナビゲーション対応
- スクリーンリーダー対応

---

このページは **就職活動や学習証明として第三者に共有する**ための最も重要なページです。信頼性と専門性を視覚的に伝えるデザインが重要です。
