# Phase 5: 学習ツリー可視化機能 - 詳細実装計画

**作成日**: 2025-11-12
**基準文書**: `docs/TREE_ENHANCEMENT_SPEC.md`
**目的**: AIベースの高精度学習ツリー構築システムの実装

---

## 概要

Phase 5では、単純な時系列表示ではなく、**ユーザー指定カテゴリを中心とした動的な極座標ツリー**を実装します。中心に近いほど基礎的・抽象的、末端に行くほど専門的・具体的な内容として配置します。

### コンセプト

```
        [中心: 基礎・抽象的]
              ↓
    ┌─────────────────┐
    │   JavaScript    │ ← ユーザー指定カテゴリ
    │     基礎        │
    └────────┬────────┘
             │
      ┌──────┴──────┐
      ↓             ↓
  ┌────────┐   ┌────────┐
  │ React  │   │Node.js │
  │ 基礎   │   │ API    │
  └───┬────┘   └────────┘
      ↓
  ┌────────┐
  │Next.js │
  │App Router│← 末端: 専門的・具体的
  └────────┘
```

### アプローチ

TREE_ENHANCEMENT_SPEC.mdで定義された6つのコンポーネントを、実装難易度と効果を考慮して7つのサブフェーズに再編成します。

---

## Phase 5.1: 基本ツリー表示（必須・最優先）⭐⭐⭐

**目的**: まず動くツリー表示を実装し、後続の拡張基盤を作る

**工数**: 3～4時間
**難易度**: ⭐⭐ (中)
**優先度**: P0 (必須)

### 実装内容

#### タスク 5.1.1: データ変換ロジック

**ファイル**: `lib/tree/treeConverter.ts`

```typescript
/**
 * 確定済みレコードをReact Flowノードに変換
 * この段階では簡易的なカテゴリ抽出のみ
 */
export function convertRecordsToNodes(
  records: ConfirmedRecord[]
): Node[] {
  return records.map((record, index) => ({
    id: record.id,
    type: 'learningRecord',
    position: { x: index * 250, y: 0 }, // 仮配置
    data: {
      title: record.session.title,
      url: record.session.url,
      category: extractSimpleCategory(record.session.url),
      duration: Math.round(record.session.duration / 60000),
      date: record.session.startTime.toISOString().split('T')[0],
      transactionHash: record.transactionHash,
      blockHeight: record.blockHeight,
      verified: record.verified,
    },
  }));
}

/**
 * URLから簡易的にカテゴリを抽出
 */
function extractSimpleCategory(url: string): string {
  if (url.match(/react|next/i)) return 'React/Next.js';
  if (url.match(/typescript|javascript/i)) return 'TypeScript';
  if (url.match(/symbol|blockchain/i)) return 'Blockchain';
  return 'その他';
}

/**
 * 時系列ベースのエッジ生成（同一カテゴリ内）
 */
export function generateTimelineEdges(records: ConfirmedRecord[]): Edge[] {
  // Phase 5.1では同一カテゴリの時系列接続のみ
  // (実装は戦略2と同じ)
}
```

#### タスク 5.1.2: カスタムノードコンポーネント

**ファイル**: `components/LearningTree/LearningRecordNode.tsx`

実装内容は前述の戦略2と同じ（カード型ノード、科目バッジ、ブロックチェーン確認アイコン）

#### タスク 5.1.3: React Flow統合

**ファイル**: `components/LearningTree/LearningTreeView.tsx`

```typescript
export default function LearningTreeView({ records }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const initialNodes = convertRecordsToNodes(records);
    const initialEdges = generateTimelineEdges(records);

    // Phase 5.1: 簡易レイアウト（カテゴリ列×時系列行）
    const layoutedNodes = layoutByCategory(initialNodes);

    setNodes(layoutedNodes);
    setEdges(initialEdges);
  }, [records]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={{ learningRecord: LearningRecordNode }}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} />
      <Controls />
    </ReactFlow>
  );
}
```

#### タスク 5.1.4: ページ統合

**ファイル**: `app/tree/page.tsx`

LocalStorageから確定済みレコード取得 → LearningTreeViewに渡す

### 成果物

- ✅ 動作する学習ツリー表示
- ✅ カテゴリごとの縦列表示
- ✅ 時系列順の縦配置
- ✅ ズーム・パン操作

### テスト

- [ ] レコード0件: 空状態メッセージ表示
- [ ] レコード1件: 単一ノード表示
- [ ] レコード10件: カテゴリ分類とレイアウト
- [ ] ズーム・パン動作確認

---

## Phase 5.2: ドメイン語彙オントロジーの構築（必須）⭐⭐⭐

**目的**: 用語の正規化により、分類精度を向上

**工数**: 2～3時間
**難易度**: ⭐ (低)
**優先度**: P0 (必須)

### 実装内容

#### タスク 5.2.1: オントロジーデータ構造

**ファイル**: `lib/tree/ontology.ts`

```typescript
export interface VocabularyOntology {
  terms: {
    [canonical: string]: {
      aliases: string[];           // 別名リスト
      category: string;             // カテゴリ
      prerequisites?: string[];     // 前提用語
      abstractionLevel?: number;    // 抽象度（1～5）
    };
  };
  categories: {
    [name: string]: {
      parent?: string;
      description: string;
      color: string;
    };
  };
}

export const DEFAULT_ONTOLOGY: VocabularyOntology = {
  terms: {
    'React': {
      aliases: ['react', 'React.js', 'ReactJS', 'リアクト'],
      category: 'React/Next.js',
      prerequisites: ['JavaScript', 'HTML/CSS'],
      abstractionLevel: 2,
    },
    'React Hooks': {
      aliases: ['hooks', 'useState', 'useEffect', 'フック'],
      category: 'React/Next.js',
      prerequisites: ['React'],
      abstractionLevel: 3,
    },
    'Next.js': {
      aliases: ['nextjs', 'next', 'Next'],
      category: 'React/Next.js',
      prerequisites: ['React', 'React Hooks'],
      abstractionLevel: 3,
    },
    'TypeScript': {
      aliases: ['typescript', 'ts', 'TS', 'タイプスクリプト'],
      category: 'TypeScript',
      prerequisites: ['JavaScript'],
      abstractionLevel: 2,
    },
    'Symbol Blockchain': {
      aliases: ['symbol', 'Symbol SDK', 'symbolブロックチェーン'],
      category: 'Blockchain',
      prerequisites: ['JavaScript', 'Web3基礎'],
      abstractionLevel: 4,
    },
    'JavaScript': {
      aliases: ['javascript', 'js', 'JS', 'ジャバスクリプト'],
      category: 'JavaScript',
      prerequisites: [],
      abstractionLevel: 1,
    },
    // ... 20～30用語を定義
  },
  categories: {
    'React/Next.js': {
      description: 'React及びNext.jsフレームワーク',
      color: 'blue',
    },
    'TypeScript': {
      description: 'TypeScript言語',
      color: 'indigo',
    },
    'Blockchain': {
      description: 'ブロックチェーン技術',
      color: 'green',
    },
    'JavaScript': {
      parent: 'Programming',
      description: 'JavaScript基礎',
      color: 'yellow',
    },
    // ...
  },
};
```

#### タスク 5.2.2: 正規化関数

```typescript
/**
 * テキストから用語を抽出し、正規化
 */
export function normalizeTerms(
  text: string,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): string[] {
  const lowerText = text.toLowerCase();
  const found: string[] = [];

  Object.entries(ontology.terms).forEach(([canonical, term]) => {
    // canonical自身をチェック
    if (lowerText.includes(canonical.toLowerCase())) {
      found.push(canonical);
    }
    // エイリアスをチェック
    term.aliases.forEach(alias => {
      if (lowerText.includes(alias.toLowerCase())) {
        found.push(canonical);
      }
    });
  });

  return [...new Set(found)]; // 重複除去
}

/**
 * レコードから正規化されたカテゴリを取得
 */
export function extractNormalizedCategory(
  record: ConfirmedRecord,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): string {
  const text = `${record.session.url} ${record.session.title}`;
  const terms = normalizeTerms(text, ontology);

  if (terms.length === 0) return 'その他';

  // 最初に見つかった用語のカテゴリを返す
  const firstTerm = terms[0];
  return ontology.terms[firstTerm]?.category || 'その他';
}
```

#### タスク 5.2.3: Phase 5.1への統合

`treeConverter.ts` を修正:

```typescript
// 修正前
category: extractSimpleCategory(record.session.url),

// 修正後
category: extractNormalizedCategory(record, DEFAULT_ONTOLOGY),
```

### 成果物

- ✅ オントロジーJSONデータ（20～30用語）
- ✅ 正規化関数
- ✅ Phase 5.1への統合

### テスト

- [ ] "React.js" → "React" 正規化
- [ ] "リアクト" → "React" 正規化
- [ ] 未知の用語 → そのまま返す

---

## Phase 5.3: 2段階抽象度推定の実装（必須）⭐⭐⭐

**目的**: ノードを中心からの距離（抽象度）で配置するための基盤

**工数**: 3～4時間
**難易度**: ⭐⭐ (中)
**優先度**: P0 (必須)

### 実装内容

#### タスク 5.3.1: Stage 1 ルールベース推定

**ファイル**: `lib/tree/abstractionEstimator.ts`

```typescript
/**
 * URLとタイトルからルールベースで抽象度を推定
 * 1: 基礎・入門
 * 2: 基本
 * 3: 中級
 * 4: 応用
 * 5: 専門・高度
 */
export function estimateAbstractionStage1(
  url: string,
  title: string
): { level: number; reasoning: string } {
  const text = `${url} ${title}`.toLowerCase();

  // レベル1のキーワード
  const level1Keywords = [
    'tutorial', 'getting-started', 'introduction', 'intro',
    'basics', 'beginner', '入門', '初心者', '基礎',
  ];

  // レベル2のキーワード
  const level2Keywords = [
    'guide', 'overview', 'fundamentals', '概要', 'ガイド',
  ];

  // レベル4-5のキーワード
  const advancedKeywords = [
    'advanced', 'optimization', 'internals', 'architecture',
    'performance', '最適化', 'アーキテクチャ', '内部実装',
  ];

  if (level1Keywords.some(kw => text.includes(kw))) {
    return { level: 1, reasoning: 'URL/タイトルに入門キーワードを検出' };
  }

  if (level2Keywords.some(kw => text.includes(kw))) {
    return { level: 2, reasoning: 'URL/タイトルに基本キーワードを検出' };
  }

  if (advancedKeywords.some(kw => text.includes(kw))) {
    return { level: 4, reasoning: 'URL/タイトルに応用キーワードを検出' };
  }

  // デフォルト: 中級
  return { level: 3, reasoning: 'キーワード不一致、中級と推定' };
}
```

#### タスク 5.3.2: Stage 2 LLMベース推定（オプション実装）

**ファイル**: `app/api/estimate-abstraction/route.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  const { title, url, stage1Estimate } = await request.json();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
あなたは学習コンテンツの抽象度を判定する専門家です。

以下の学習記録の抽象度を1～5で評価してください:
- タイトル: ${title}
- URL: ${url}

参考情報:
- ルールベース推定: レベル${stage1Estimate.level} (${stage1Estimate.reasoning})

抽象度の定義:
1: 入門・基礎（チュートリアル、Getting Started）
2: 基本（基本概念の理解）
3: 中級（実践的な使い方）
4: 応用（最適化、アーキテクチャ）
5: 専門（内部実装、高度な技術）

JSON形式で回答してください:
{
  "level": 数値(1-5),
  "reasoning": "判定理由",
  "confidence": 数値(0-1)
}
  `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // JSONパース
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Invalid LLM response');
  }

  const stage2 = JSON.parse(jsonMatch[0]);

  return Response.json({
    stage1: stage1Estimate,
    stage2,
    discrepancy: Math.abs(stage1Estimate.level - stage2.level),
  });
}
```

#### タスク 5.3.3: 抽象度データの保存

`types/index.ts` に追加:

```typescript
interface ConfirmedRecordEnhanced extends ConfirmedRecord {
  abstractionAnalysis?: {
    stage1: { level: number; reasoning: string };
    stage2?: { level: number; reasoning: string; confidence: number };
    finalLevel: number;
  };
}
```

LocalStorageに保存する際、抽象度情報も含める。

### 成果物

- ✅ Stage 1ルールベース推定
- ✅ (オプション) Stage 2 LLM推定API
- ✅ 抽象度データの保存

### テスト

- [ ] "Getting Started" → レベル1
- [ ] "Advanced Techniques" → レベル4
- [ ] 通常のドキュメント → レベル3（デフォルト）

---

## Phase 5.4: マルチシグナル類似度スコアリング（推奨）⭐⭐

**目的**: レコード間の関連性を複数の手法で測定

**工数**: 4～5時間
**難易度**: ⭐⭐⭐ (高)
**優先度**: P1 (推奨)

### 実装内容

#### タスク 5.4.1: ルールベース類似度

```typescript
/**
 * URLドメインとカテゴリに基づく類似度
 */
function calculateRuleSimilarity(
  record1: ConfirmedRecord,
  record2: ConfirmedRecord
): number {
  let score = 0;

  // 同じドメイン
  const domain1 = new URL(record1.session.url).hostname;
  const domain2 = new URL(record2.session.url).hostname;
  if (domain1 === domain2) score += 0.5;

  // 同じカテゴリ
  const cat1 = extractNormalizedCategory(record1);
  const cat2 = extractNormalizedCategory(record2);
  if (cat1 === cat2) score += 0.5;

  return score;
}
```

#### タスク 5.4.2: 統計ベース類似度（TF-IDF）

**ファイル**: `lib/tree/tfidf.ts`

```typescript
import { TfIdf } from 'natural';

/**
 * TF-IDFを使ったテキスト類似度計算
 */
export class TFIDFSimilarity {
  private tfidf: TfIdf;
  private documents: Map<string, string>;

  constructor(records: ConfirmedRecord[]) {
    this.tfidf = new TfIdf();
    this.documents = new Map();

    records.forEach(record => {
      const text = `${record.session.title} ${record.session.url}`;
      this.tfidf.addDocument(text);
      this.documents.set(record.id, text);
    });
  }

  /**
   * 2つのレコードの類似度を計算
   */
  calculateSimilarity(id1: string, id2: string): number {
    // 簡易実装: 両方のTF-IDFベクトルのコサイン類似度
    // (本格実装はnaturalライブラリのtfidf.tfidfメソッド使用)

    // 仮実装: 共通単語の数で近似
    const text1 = this.documents.get(id1) || '';
    const text2 = this.documents.get(id2) || '';

    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size; // Jaccard類似度
  }
}
```

#### タスク 5.4.3: マルチシグナル統合

```typescript
interface SimilaritySignals {
  rule: number;
  statistical: number;
  semantic?: number; // Phase 5.5で実装
}

interface SimilarityWeights {
  rule: number;
  statistical: number;
  semantic: number;
}

const DEFAULT_WEIGHTS: SimilarityWeights = {
  rule: 0.3,
  statistical: 0.7,
  semantic: 0.0, // Phase 5.5まで未使用
};

/**
 * 複数シグナルを統合して最終類似度を計算
 */
export function calculateMultiSignalSimilarity(
  record1: ConfirmedRecord,
  record2: ConfirmedRecord,
  tfidf: TFIDFSimilarity,
  weights: SimilarityWeights = DEFAULT_WEIGHTS
): { score: number; signals: SimilaritySignals } {
  const signals: SimilaritySignals = {
    rule: calculateRuleSimilarity(record1, record2),
    statistical: tfidf.calculateSimilarity(record1.id, record2.id),
  };

  // 重み付き平均（semanticはPhase 5.5まで0）
  const totalWeight = weights.rule + weights.statistical;
  const score =
    (signals.rule * weights.rule + signals.statistical * weights.statistical) /
    totalWeight;

  return { score, signals };
}
```

#### タスク 5.4.4: 類似度行列の生成

```typescript
/**
 * 全レコード間の類似度行列を計算
 */
export function buildSimilarityMatrix(
  records: ConfirmedRecord[]
): Map<string, Array<{ recordId: string; score: number; signals: SimilaritySignals }>> {
  const tfidf = new TFIDFSimilarity(records);
  const matrix = new Map();

  records.forEach((record1, i) => {
    const similarities: Array<{ recordId: string; score: number; signals: SimilaritySignals }> = [];

    records.forEach((record2, j) => {
      if (i === j) return; // 自分自身は除外

      const { score, signals } = calculateMultiSignalSimilarity(
        record1,
        record2,
        tfidf
      );

      similarities.push({
        recordId: record2.id,
        score,
        signals,
      });
    });

    // スコア降順でソート、上位5件のみ保存
    similarities.sort((a, b) => b.score - a.score);
    matrix.set(record1.id, similarities.slice(0, 5));
  });

  return matrix;
}
```

### 成果物

- ✅ ルールベース類似度関数
- ✅ TF-IDF類似度関数
- ✅ マルチシグナル統合関数
- ✅ 類似度行列生成

### テスト

- [ ] 同じURL → 高スコア
- [ ] 全く無関係 → 低スコア
- [ ] 類似タイトル → 中程度スコア

---

## Phase 5.5: 埋め込みベクトル生成とLLM分類API統合（推奨）⭐⭐⭐

**目的**: セマンティック類似度とLLMによる高精度分類

**工数**: 5～6時間
**難易度**: ⭐⭐⭐ (高)
**優先度**: P1 (推奨)

### 実装内容

#### タスク 5.5.1: 埋め込みベクトル生成API

**ファイル**: `app/api/generate-embedding/route.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  const { text } = await request.json();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'embedding-001' });

  const result = await model.embedContent(text);
  const embedding = result.embedding.values;

  return Response.json({
    embedding,
    model: 'embedding-001',
    dimension: embedding.length,
  });
}
```

#### タスク 5.5.2: コサイン類似度計算

```typescript
/**
 * 2つのベクトルのコサイン類似度を計算
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vector dimensions must match');
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}
```

#### タスク 5.5.3: LLM分類API

**ファイル**: `app/api/classify-record/route.ts`

```typescript
export async function POST(request: Request) {
  const { title, url, description } = await request.json();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
以下の学習記録を分析し、カテゴリと抽象度を判定してください。

タイトル: ${title}
URL: ${url}
説明: ${description || 'なし'}

以下のカテゴリから最も適切なものを選んでください:
- React/Next.js
- TypeScript
- JavaScript
- Blockchain
- CSS/Design
- Backend
- その他

また、抽象度を1～5で評価してください:
1: 入門・基礎
2: 基本
3: 中級
4: 応用
5: 専門

さらに、このトピックの前提知識を列挙してください。

JSON形式で回答:
{
  "category": "カテゴリ名",
  "abstractionLevel": 数値(1-5),
  "prerequisites": ["前提1", "前提2"],
  "reasoning": "判定理由",
  "confidence": 数値(0-1)
}
  `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Invalid LLM response');
  }

  return Response.json(JSON.parse(jsonMatch[0]));
}
```

#### タスク 5.5.4: Phase 5.4への統合

`calculateMultiSignalSimilarity` を拡張:

```typescript
// semanticシグナルを追加
if (record1.embedding && record2.embedding) {
  signals.semantic = cosineSimilarity(record1.embedding, record2.embedding);
}

// 重みを再調整
const weights = { rule: 0.2, statistical: 0.3, semantic: 0.5 };
```

### 成果物

- ✅ 埋め込み生成API
- ✅ コサイン類似度計算
- ✅ LLM分類API
- ✅ セマンティックシグナルの統合

### テスト

- [ ] "React Hooks" と "React フック" → 高類似度
- [ ] LLM分類が適切なカテゴリを返す
- [ ] 埋め込みベクトル生成が成功

---

## Phase 5.6: 動的ツリー再構築とポーラーレイアウト（必須）⭐⭐⭐

**目的**: ユーザー指定カテゴリを中心とした極座標ツリー

**工数**: 4～5時間
**難易度**: ⭐⭐⭐ (高)
**優先度**: P0 (必須)

### 実装内容

#### タスク 5.6.1: ポーラーレイアウト計算

**ファイル**: `lib/tree/polarLayout.ts`

```typescript
/**
 * 極座標レイアウトでノードを配置
 * - 中心: 基礎的・抽象的
 * - 末端: 専門的・具体的
 */
export function calculatePolarLayout(
  records: ConfirmedRecord[],
  centerCategory: string,
  similarityMatrix: Map<string, Array<{ recordId: string; score: number }>>
): Node[] {
  const nodes: Node[] = [];

  // 1. 中心カテゴリのレコードを抽出
  const centerRecords = records.filter(
    r => extractNormalizedCategory(r) === centerCategory
  );

  // 2. 抽象度でソート（低い順 = 基礎から）
  const sortedCenter = [...centerRecords].sort(
    (a, b) =>
      (a.abstractionAnalysis?.finalLevel || 3) -
      (b.abstractionAnalysis?.finalLevel || 3)
  );

  // 3. 中心に基礎レコードを配置
  const centerRadius = 100;
  sortedCenter.forEach((record, i) => {
    const angle = (i / sortedCenter.length) * 2 * Math.PI;
    nodes.push({
      id: record.id,
      type: 'learningRecord',
      position: {
        x: Math.cos(angle) * centerRadius,
        y: Math.sin(angle) * centerRadius,
      },
      data: createNodeData(record),
    });
  });

  // 4. 関連レコードを外側に配置
  const visitedRecords = new Set(sortedCenter.map(r => r.id));
  let currentRadius = 250;

  sortedCenter.forEach(centerRecord => {
    const similar = similarityMatrix.get(centerRecord.id) || [];

    similar.forEach((sim, i) => {
      if (visitedRecords.has(sim.recordId)) return;

      const relatedRecord = records.find(r => r.id === sim.recordId);
      if (!relatedRecord) return;

      const angle = (i / similar.length) * 2 * Math.PI;
      const radius =
        currentRadius +
        (relatedRecord.abstractionAnalysis?.finalLevel || 3) * 50;

      nodes.push({
        id: relatedRecord.id,
        type: 'learningRecord',
        position: {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        },
        data: createNodeData(relatedRecord),
      });

      visitedRecords.add(sim.recordId);
    });

    currentRadius += 200;
  });

  return nodes;
}
```

#### タスク 5.6.2: カテゴリ選択UI

**ファイル**: `components/LearningTree/CategorySelector.tsx`

```typescript
interface Props {
  records: ConfirmedRecord[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategorySelector({ records, selectedCategory, onSelectCategory }: Props) {
  // 利用可能なカテゴリを抽出
  const categories = [...new Set(records.map(r => extractNormalizedCategory(r)))];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">中心カテゴリ</label>
      <select
        value={selectedCategory}
        onChange={e => onSelectCategory(e.target.value)}
        className="px-4 py-2 border rounded-lg"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
```

#### タスク 5.6.3: 動的再構築

```typescript
export default function LearningTreeView({ records }: Props) {
  const [centerCategory, setCenterCategory] = useState('React/Next.js');
  const [similarityMatrix, setSimilarityMatrix] = useState<Map<...>>(new Map());

  useEffect(() => {
    // 類似度行列を計算（初回のみ）
    const matrix = buildSimilarityMatrix(records);
    setSimilarityMatrix(matrix);
  }, [records]);

  useEffect(() => {
    // カテゴリ変更時にレイアウト再計算
    if (similarityMatrix.size === 0) return;

    const layoutedNodes = calculatePolarLayout(
      records,
      centerCategory,
      similarityMatrix
    );

    const edges = generateSimilarityEdges(records, similarityMatrix);

    setNodes(layoutedNodes);
    setEdges(edges);
  }, [centerCategory, similarityMatrix]);

  return (
    <>
      <CategorySelector
        records={records}
        selectedCategory={centerCategory}
        onSelectCategory={setCenterCategory}
      />
      <ReactFlow ... />
    </>
  );
}
```

### 成果物

- ✅ ポーラーレイアウトアルゴリズム
- ✅ カテゴリ選択UI
- ✅ 動的再構築機能

### テスト

- [ ] カテゴリ選択でレイアウトが変わる
- [ ] 中心に基礎レコード、外側に専門レコード
- [ ] 関連レコードが近くに配置される

---

## Phase 5.7: ブロックチェーン証明の拡張（推奨）⭐

**目的**: 分析結果もブロックチェーンで証明

**工数**: 2～3時間
**難易度**: ⭐⭐ (中)
**優先度**: P2 (推奨)

### 実装内容

#### タスク 5.7.1: 拡張メッセージ構造

```typescript
interface ExtendedBlockchainMessage {
  type: 'learning_record_v2';
  // 既存フィールド
  url: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  contentHash: string;
  // 新規フィールド
  analysisArtifacts?: {
    embeddingHash?: string;
    embeddingModel?: string;
    abstractionLevel: number;
    category: string;
    analysisTimestamp: string;
  };
}
```

#### タスク 5.7.2: ハッシュ生成

```typescript
import crypto from 'crypto';

/**
 * 埋め込みベクトルのハッシュを生成
 */
export function hashEmbedding(embedding: number[]): string {
  const buffer = Buffer.from(new Float32Array(embedding).buffer);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
```

#### タスク 5.7.3: トランザクション作成の拡張

`lib/symbol/sssSimple.ts` の `createAndSignTransferTransaction` を修正:

```typescript
// メッセージに分析結果を追加
const extendedMessage = {
  ...basicMessage,
  analysisArtifacts: {
    embeddingHash: record.embedding ? hashEmbedding(record.embedding) : undefined,
    embeddingModel: 'embedding-001',
    abstractionLevel: record.abstractionAnalysis?.finalLevel || 3,
    category: extractNormalizedCategory(record),
    analysisTimestamp: new Date().toISOString(),
  },
};
```

### 成果物

- ✅ 拡張メッセージ構造
- ✅ ハッシュ生成関数
- ✅ トランザクション作成の拡張

### テスト

- [ ] トランザクションに分析結果が含まれる
- [ ] ハッシュが正しく生成される
- [ ] 検証ページで分析結果を確認できる

---

## 実装優先度まとめ

### ✅ 必須（Phase 5.1～5.3, 5.6）

| サブフェーズ | 内容 | 工数 | 依存関係 |
|------------|------|------|---------|
| 5.1 | 基本ツリー表示 | 3～4h | なし |
| 5.2 | オントロジー構築 | 2～3h | 5.1 |
| 5.3 | 抽象度推定 | 3～4h | 5.1, 5.2 |
| 5.6 | ポーラーレイアウト | 4～5h | 5.1～5.4 |

**合計**: 12～16時間

### 🎯 推奨（Phase 5.4, 5.5）

| サブフェーズ | 内容 | 工数 | 依存関係 |
|------------|------|------|---------|
| 5.4 | マルチシグナル類似度 | 4～5h | 5.1, 5.2 |
| 5.5 | 埋め込み＆LLM分類 | 5～6h | 5.4 |

**合計**: 9～11時間

### ⭐ オプション（Phase 5.7）

| サブフェーズ | 内容 | 工数 | 依存関係 |
|------------|------|------|---------|
| 5.7 | ブロックチェーン証明拡張 | 2～3h | 5.5 |

---

## 総合スケジュール

### 最小構成（必須のみ）: 12～16時間

Day 1 (4h): Phase 5.1 基本ツリー表示
Day 2 (3h): Phase 5.2 オントロジー構築
Day 3 (4h): Phase 5.3 抽象度推定
Day 4-5 (5h): Phase 5.6 ポーラーレイアウト

### 推奨構成（必須＋推奨）: 21～27時間

上記 + Phase 5.4, 5.5

### フル構成（全機能）: 23～30時間

上記 + Phase 5.7

---

## 次のアクション

実装を開始しますか？推奨は以下の順序です：

1. **Phase 5.1** から開始（基本ツリー表示）
2. **Phase 5.2** でオントロジー追加（精度向上）
3. **Phase 5.3** で抽象度推定実装
4. **Phase 5.4** で類似度スコアリング
5. **Phase 5.5** で埋め込み＆LLM統合（時間あれば）
6. **Phase 5.6** でポーラーレイアウト実装
7. **Phase 5.7** でブロックチェーン拡張（時間あれば）

---

**Document Version**: 1.0
**Status**: 実装待ち
**Estimated Total Time**: 12～30時間（構成による）
