# 学習ツリー - 関係性定義戦略

**作成日**: 2025-11-12
**問題**: 現在のデータ構造には学習記録間の前提関係を示す情報が存在しない
**目的**: ツリー構造を実現するための実装可能な戦略を定義

---

## 問題分析

### 現在のデータ構造

```typescript
interface BrowsingSession {
  id: string;
  url: string;          // 学習したURL
  title: string;        // ページタイトル
  startTime: Date;
  endTime: Date;
  duration: number;
  contentHash: string;
  metadata?: {
    description?: string;
    keywords?: string[];
    [key: string]: any;
  };
}

interface ConfirmedRecord {
  id: string;
  session: BrowsingSession;
  transactionHash: string;
  blockHeight: number;
  timestamp: Date;
  signerAddress: string;
  verified: boolean;
}
```

### 不足している情報

- ❌ **前提関係**: どのレコードが前提知識か
- ❌ **科目分類**: 明示的なカテゴリ情報
- ❌ **依存関係**: 学習の順序や関連性
- ❌ **階層レベル**: 基礎→応用→実践などのレベル

---

## 戦略オプション

### 🎯 戦略1: URLベースの暗黙的関係推定（推奨）

**概要**: URLとタイトルから学習トピックを抽出し、暗黙的な前提関係を推定

#### 実装方法

##### A. トピック抽出ルール

```typescript
interface TopicRule {
  pattern: RegExp;
  topic: string;
  category: string;
  level: number;  // 1:基礎、2:中級、3:応用
  prerequisites?: string[];  // 前提トピック
}

const TOPIC_RULES: TopicRule[] = [
  // React基礎
  {
    pattern: /react.*getting.?started|react.*introduction|react.*basics/i,
    topic: 'React基礎',
    category: 'React',
    level: 1,
    prerequisites: ['JavaScript基礎', 'HTML/CSS'],
  },
  // React Hooks
  {
    pattern: /react.*hooks?/i,
    topic: 'React Hooks',
    category: 'React',
    level: 2,
    prerequisites: ['React基礎'],
  },
  // Next.js App Router
  {
    pattern: /next.*app.?router/i,
    topic: 'Next.js App Router',
    category: 'Next.js',
    level: 2,
    prerequisites: ['React基礎', 'React Hooks'],
  },
  // TypeScript基礎
  {
    pattern: /typescript.*basic|typescript.*introduction/i,
    topic: 'TypeScript基礎',
    category: 'TypeScript',
    level: 1,
    prerequisites: ['JavaScript基礎'],
  },
  // Symbol Blockchain
  {
    pattern: /symbol.*blockchain|symbol.*sdk/i,
    topic: 'Symbol Blockchain',
    category: 'Blockchain',
    level: 2,
    prerequisites: ['Web3基礎', 'JavaScript基礎'],
  },
];
```

##### B. 関係推定アルゴリズム

```typescript
/**
 * レコードからトピックを抽出
 */
function extractTopic(record: ConfirmedRecord): TopicRule | null {
  const searchText = `${record.session.url} ${record.session.title}`.toLowerCase();

  for (const rule of TOPIC_RULES) {
    if (rule.pattern.test(searchText)) {
      return rule;
    }
  }

  return null;
}

/**
 * レコード間の前提関係を推定
 */
function inferRelationships(records: ConfirmedRecord[]): Edge[] {
  const edges: Edge[] = [];

  // 各レコードのトピックを抽出
  const recordTopics = records.map(record => ({
    record,
    topic: extractTopic(record),
  }));

  // 前提関係に基づいてエッジを生成
  recordTopics.forEach(({ record, topic }) => {
    if (!topic || !topic.prerequisites) return;

    // 前提トピックを学習済みのレコードを探す
    topic.prerequisites.forEach(prereqTopic => {
      const prereqRecord = recordTopics.find(rt =>
        rt.topic?.topic === prereqTopic
      );

      if (prereqRecord) {
        edges.push({
          id: `edge-${prereqRecord.record.id}-${record.id}`,
          source: prereqRecord.record.id,
          target: record.id,
          label: '前提知識',
        });
      }
    });
  });

  return edges;
}
```

#### メリット
- ✅ **既存データで実装可能**: データ構造変更不要
- ✅ **即座に実装可能**: 追加の入力不要
- ✅ **自動化**: ユーザー操作なしで関係推定

#### デメリット
- ⚠️ **精度が低い**: URLパターンに依存
- ⚠️ **拡張性に課題**: 新しいトピックごとにルール追加が必要

---

### 🎯 戦略2: 時系列＋カテゴリベースの単純グラフ

**概要**: 同じカテゴリ内で時系列順に接続する単純なグラフ構造

#### 実装方法

```typescript
/**
 * URLからカテゴリを抽出
 */
function extractCategory(url: string, title: string): string {
  const text = `${url} ${title}`.toLowerCase();

  if (text.match(/react|next\.?js/)) return 'React/Next.js';
  if (text.match(/typescript|javascript/)) return 'TypeScript/JavaScript';
  if (text.match(/symbol|blockchain|web3/)) return 'Blockchain';
  if (text.match(/css|tailwind|styling/)) return 'CSS/デザイン';
  if (text.match(/node|express|api/)) return 'バックエンド';

  return 'その他';
}

/**
 * カテゴリごとに時系列でエッジを生成
 */
function generateTimelineEdges(records: ConfirmedRecord[]): Edge[] {
  const edges: Edge[] = [];

  // カテゴリごとにグルーピング
  const categories: Record<string, ConfirmedRecord[]> = {};

  records.forEach(record => {
    const category = extractCategory(
      record.session.url,
      record.session.title
    );

    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(record);
  });

  // 各カテゴリ内で時系列順にソート＆接続
  Object.values(categories).forEach(categoryRecords => {
    const sorted = [...categoryRecords].sort(
      (a, b) => a.session.startTime.getTime() - b.session.startTime.getTime()
    );

    for (let i = 0; i < sorted.length - 1; i++) {
      edges.push({
        id: `edge-${sorted[i].id}-${sorted[i + 1].id}`,
        source: sorted[i].id,
        target: sorted[i + 1].id,
        type: 'smoothstep',
      });
    }
  });

  return edges;
}
```

#### ノードレイアウト

```typescript
/**
 * カテゴリごとに縦列、時系列で縦に配置
 */
function layoutNodesByCategory(records: ConfirmedRecord[]): Node[] {
  const COLUMN_WIDTH = 300;
  const ROW_HEIGHT = 150;

  // カテゴリごとにグルーピング
  const categories: Record<string, ConfirmedRecord[]> = {};

  records.forEach(record => {
    const category = extractCategory(
      record.session.url,
      record.session.title
    );

    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(record);
  });

  const nodes: Node[] = [];
  const categoryNames = Object.keys(categories);

  categoryNames.forEach((categoryName, colIndex) => {
    const categoryRecords = categories[categoryName];

    // 時系列ソート
    const sorted = [...categoryRecords].sort(
      (a, b) => a.session.startTime.getTime() - b.session.startTime.getTime()
    );

    sorted.forEach((record, rowIndex) => {
      nodes.push({
        id: record.id,
        type: 'learningRecord',
        position: {
          x: colIndex * COLUMN_WIDTH,
          y: rowIndex * ROW_HEIGHT,
        },
        data: {
          title: record.session.title,
          category: categoryName,
          duration: Math.round(record.session.duration / 60000),
          date: record.session.startTime.toISOString().split('T')[0],
          transactionHash: record.transactionHash,
          verified: record.verified,
        },
      });
    });
  });

  return nodes;
}
```

#### 視覚化イメージ

```
React/Next.js列      TypeScript列      Blockchain列
    ↓                   ↓                 ↓
┌─────────┐        ┌─────────┐      ┌─────────┐
│React基礎 │        │TS基礎   │      │Web3入門 │
│2025-11-01│        │2025-11-02│      │2025-11-05│
└────┬────┘        └────┬────┘      └────┬────┘
     ↓                   ↓                 ↓
┌─────────┐        ┌─────────┐      ┌─────────┐
│Hooks   │        │型推論   │      │Symbol SDK│
│2025-11-03│        │2025-11-04│      │2025-11-06│
└────┬────┘        └─────────┘      └─────────┘
     ↓
┌─────────┐
│App Router│
│2025-11-07│
└─────────┘
```

#### メリット
- ✅ **実装が簡単**: シンプルなロジック
- ✅ **視覚的に明確**: カテゴリごとに縦列表示
- ✅ **時系列が分かる**: 学習の順序が一目瞭然

#### デメリット
- ⚠️ **前提関係が不明確**: カテゴリ内の順序のみ
- ⚠️ **カテゴリ間の関係なし**: 例: TypeScript → React の関係が表現できない

---

### 🎯 戦略3: ユーザー指定による明示的関係定義

**概要**: ユーザーが手動で前提関係を指定

#### 実装方法

##### A. データ構造拡張

```typescript
interface ConfirmedRecordExtended extends ConfirmedRecord {
  relationships?: {
    prerequisites: string[];  // 前提レコードIDの配列
    relatedTo: string[];      // 関連レコードIDの配列
  };
}
```

##### B. UI実装

確定済みレコードページに「関係を編集」ボタンを追加:

```typescript
// 編集モーダル
<Modal>
  <h2>学習の前提関係を設定</h2>
  <p>現在のレコード: {record.session.title}</p>

  <label>このレコードの前提となる学習:</label>
  <MultiSelect
    options={otherRecords}
    selected={record.relationships?.prerequisites}
    onChange={handlePrerequisitesChange}
  />

  <button onClick={saveRelationships}>保存</button>
</Modal>
```

#### メリット
- ✅ **精度が高い**: ユーザーが正確に関係を定義
- ✅ **柔軟性**: 任意の関係を表現可能

#### デメリット
- ❌ **手動操作が必要**: ユーザー負担大
- ❌ **データ構造変更**: LocalStorageスキーマの更新が必要
- ❌ **ブロックチェーンとの不整合**: 既存トランザクションには関係情報なし

---

### 🎯 戦略4: AIによる関係推定（将来拡張）

**概要**: Gemini APIを使ってタイトルとURLから関係を推定

#### 実装イメージ

```typescript
async function inferRelationshipsWithAI(
  records: ConfirmedRecord[]
): Promise<Edge[]> {
  const prompt = `
以下の学習記録リストから、前提関係を推定してください。

レコード:
${records.map((r, i) => `${i + 1}. ${r.session.title} (${r.session.url})`).join('\n')}

出力形式（JSON）:
{
  "relationships": [
    { "from": 1, "to": 3, "reason": "React基礎はApp Routerの前提知識" }
  ]
}
  `;

  const response = await callGeminiAPI(prompt);
  const relationships = parseAIResponse(response);

  return convertToEdges(relationships);
}
```

#### メリット
- ✅ **精度が高い**: AI判定による正確な関係推定
- ✅ **自動化**: ユーザー操作不要

#### デメリット
- ❌ **実装コスト**: Gemini API統合が必要
- ❌ **レスポンス時間**: API呼び出しで遅延
- ❌ **コスト**: APIコールごとに課金

---

## 推奨実装戦略

### Phase 5.1: 戦略2を採用（時系列＋カテゴリベース）

**理由**:
1. **実装が最も簡単** - 3時間以内で完成可能
2. **視覚的に明確** - カテゴリごとの縦列表示で分かりやすい
3. **既存データで動作** - データ構造変更不要
4. **デモに最適** - 学習の時系列進捗を視覚的にアピール

**実装内容**:
- カテゴリ抽出: URLとタイトルから5～7カテゴリを自動分類
- レイアウト: カテゴリごとに縦列、時系列で上から下へ配置
- エッジ: 同じカテゴリ内の連続するレコードを接続
- ラベル: エッジに日数差を表示（例: "2日後"）

### Phase 5.2: 戦略1を追加（URLベース関係推定）

**実装時期**: Phase 5.1完了後、追加機能として実装

**実装内容**:
- トピックルールの定義（10～20パターン）
- 前提関係の推定ロジック
- カテゴリ間のエッジ追加（例: TypeScript → React）

### Phase 5.3: 戦略4を検討（AI推定）

**実装時期**: 将来拡張（Phase 6以降）

**前提条件**:
- Gemini API統合完了
- 十分なテストデータ蓄積
- APIコスト検証完了

---

## 実装優先度

| 戦略 | 優先度 | 実装時期 | 工数 |
|------|--------|---------|------|
| 戦略2（時系列＋カテゴリ） | P0 | Phase 5.1 | 3時間 |
| 戦略1（URLベース推定） | P1 | Phase 5.2 | 2時間 |
| 戦略3（ユーザー指定） | P2 | Phase 6 | 4時間 |
| 戦略4（AI推定） | P3 | Phase 7 | 6時間 |

---

## 実装例：戦略2（推奨）

### ファイル構成

```
lib/tree/
├── categoryExtractor.ts    # カテゴリ抽出ロジック
├── treeConverter.ts         # レコード→ノード変換
└── treeLayout.ts            # レイアウト計算
```

### コード例

**lib/tree/categoryExtractor.ts**:

```typescript
export interface Category {
  name: string;
  color: string;
  icon: string;
}

export const CATEGORIES: Record<string, Category> = {
  'React/Next.js': {
    name: 'React/Next.js',
    color: 'blue',
    icon: '⚛️',
  },
  'TypeScript': {
    name: 'TypeScript',
    color: 'indigo',
    icon: '📘',
  },
  'Blockchain': {
    name: 'Blockchain',
    color: 'green',
    icon: '⛓️',
  },
  'CSS/Design': {
    name: 'CSS/Design',
    color: 'purple',
    icon: '🎨',
  },
  'Backend': {
    name: 'Backend',
    color: 'yellow',
    icon: '🔧',
  },
  'その他': {
    name: 'その他',
    color: 'gray',
    icon: '📚',
  },
};

export function extractCategory(url: string, title: string): string {
  const text = `${url} ${title}`.toLowerCase();

  if (text.match(/react|next\.?js/)) return 'React/Next.js';
  if (text.match(/typescript/)) return 'TypeScript';
  if (text.match(/symbol|blockchain|web3/)) return 'Blockchain';
  if (text.match(/css|tailwind|styling|design/)) return 'CSS/Design';
  if (text.match(/node|express|api|backend|server/)) return 'Backend';

  return 'その他';
}
```

---

## ユーザーへの説明（デモシナリオ）

### デモ時の説明文

「学習ツリーページでは、ブロックチェーンに記録した学習活動を視覚化しています。

**カテゴリごとに縦列で表示**され、各列内では**時系列順に上から下へ**配置されています。これにより、どの分野をいつ学習したかが一目で分かります。

例えば、左の列は React/Next.js、中央は TypeScript、右側は Blockchain と、学習分野ごとに整理されています。

矢印は学習の順序を示しており、同じカテゴリ内で次に学んだ内容へと繋がっています。

この視覚化により、自分の学習の全体像と進捗を把握でき、就職活動でのポートフォリオとしても活用できます。」

---

**Document Version**: 1.0
**Status**: 戦略2の実装を推奨
