# ツリーページ - ワイヤーフレーム

**ページパス**: `/tree`
**ファイル**: `src/app/tree/page.tsx`

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
│  │                  学習ツリー可視化                        │   │
│  │          学習の進捗と前提関係を視覚的に把握             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  統計情報バー                                            │   │
│  │  📊 総記録数: 15件  ⏱️ 総学習時間: 675分              │   │
│  │  ✅ 完了: 8件  🟡 進行中: 3件  🔒 未着手: 4件         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  コントロールパネル                                       │   │
│  │  [🔍 Zoom In] [🔍 Zoom Out] [🔄 Reset View] [💾 Save]  │   │
│  │  表示: [✓ 完了済み] [✓ 進行中] [✓ 未着手]              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    LearningTree Component                        │
│                   (React Flow Visualization)                     │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                             │ │
│  │         ┌─────────────────┐                               │ │
│  │         │  JavaScript 基礎│  ✅                           │ │
│  │         │  ⏱️ 60分 📊 3/5 │                              │ │
│  │         │  🏷️ JavaScript  │                              │ │
│  │         └────────┬────────┘                               │ │
│  │                  │                                          │ │
│  │                  ↓                                          │ │
│  │         ┌────────┴────────┐                               │ │
│  │         │                  │                                │ │
│  │   ┌─────▼──────┐    ┌────▼─────────┐                    │ │
│  │   │ TypeScript │ ✅ │ React 基礎    │ ✅                │ │
│  │   │ ⏱️ 90分    │    │ ⏱️ 120分      │                   │ │
│  │   │ 📊 4/5     │    │ 📊 4/5        │                   │ │
│  │   │ 🏷️ TS      │    │ 🏷️ React     │                   │ │
│  │   └─────┬──────┘    └────┬─────────┘                    │ │
│  │         │                  │                                │ │
│  │         │        ┌─────────┴──────────┐                   │ │
│  │         │        │                     │                   │ │
│  │         │  ┌─────▼──────┐      ┌─────▼────────┐         │ │
│  │         │  │ React Hooks│ ✅   │ Next.js 基礎 │ 🟡      │ │
│  │         │  │ ⏱️ 75分    │      │ ⏱️ 45分      │         │ │
│  │         │  │ 📊 5/5     │      │ 📊 4/5       │         │ │
│  │         │  │ 🏷️ React   │      │ 🏷️ Next.js  │         │ │
│  │         │  └─────┬──────┘      └─────┬────────┘         │ │
│  │         │        │                     │                   │ │
│  │         │        └──────────┬──────────┘                   │ │
│  │         │                   │                               │ │
│  │         └──────────┬────────┘                             │ │
│  │                    │                                        │ │
│  │           ┌────────▼─────────┐                            │ │
│  │           │ Next.js Advanced │ 🔒                         │ │
│  │           │ ⏱️ 0分           │                            │ │
│  │           │ 📊 -/5           │                            │ │
│  │           │ 🏷️ Next.js       │                            │ │
│  │           └──────────────────┘                            │ │
│  │                                                             │ │
│  │                              ┌──────────────┐             │ │
│  │                              │ Symbol SDK   │ ✅          │ │
│  │                              │ ⏱️ 120分     │             │ │
│  │                              │ 📊 5/5       │             │ │
│  │                              │ 🏷️ Symbol    │             │ │
│  │                              └──────┬───────┘             │ │
│  │                                     │                      │ │
│  │                              ┌──────▼───────┐             │ │
│  │                              │ Aggregate Tx │ 🟡          │ │
│  │                              │ ⏱️ 90分      │             │ │
│  │                              │ 📊 4/5       │             │ │
│  │                              │ 🏷️ Symbol    │             │ │
│  │                              └──────────────┘             │ │
│  │                                                             │ │
│  │  [ドラッグでパン] [マウスホイールでズーム]                │ │
│  │                                                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   NodeDetailModal (オーバーレイ)                │
│  (ノードクリック時に表示)                                       │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                  [×]     │   │
│  │              学習記録詳細                                │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │   │
│  │                                                           │   │
│  │  📌 React Hooks                                          │   │
│  │  🔗 https://react.dev/learn/hooks                        │   │
│  │                                                           │   │
│  │  ステータス: ✅ 完了                                     │   │
│  │  完了日時: 2024-11-01 15:30:00                           │   │
│  │                                                           │   │
│  │  ⏱️  学習時間: 75分                                      │   │
│  │  📊 理解度: 5/5 ⭐⭐⭐⭐⭐                              │   │
│  │  🏷️  タグ: React, Hooks, JavaScript                     │   │
│  │                                                           │   │
│  │  📝 メモ:                                                │   │
│  │  自動記録されたセッション (スクロール深度: 95%,         │   │
│  │  再訪回数: 3回)                                          │   │
│  │                                                           │   │
│  │  🤖 AI要約:                                              │   │
│  │  React Hooksの使い方を学習。useState、useEffect、       │   │
│  │  useContextなどの基本的なHooksを理解し、関数           │   │
│  │  コンポーネントでの状態管理方法を習得。                 │   │
│  │                                                           │   │
│  │  ⛓️  ブロックチェーン証明:                              │   │
│  │  TxHash: A1B2C3D4...E9F0A1B2                             │   │
│  │  Block: 1235500                                           │   │
│  │                                                           │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │   │
│  │                                                           │   │
│  │  📊 前提となる学習:                                      │   │
│  │  • React 基礎 (完了)                                     │   │
│  │                                                           │   │
│  │  📚 この学習が必要な次のステップ:                        │   │
│  │  • Next.js Advanced (未着手)                             │   │
│  │                                                           │   │
│  │                                                           │   │
│  │  [Symbol Explorerで確認]  [ホームに戻る]  [閉じる]     │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## コンポーネント構成

### 1. **Header** (`src/components/Header.tsx`)

**役割**: グローバルナビゲーション（全ページ共通）

---

### 2. **ページタイトルセクション**

**役割**: ページの目的説明

**表示内容**:
- タイトル: "学習ツリー可視化"
- サブタイトル: "学習の進捗と前提関係を視覚的に把握"

---

### 3. **統計情報バー**

**役割**: 学習の全体統計を一目で把握

**表示内容**:
- 📊 総記録数: 全学習記録の数
- ⏱️ 総学習時間: 累計学習時間（分）
- ✅ 完了: 完了した学習の数
- 🟡 進行中: 現在進行中の学習の数
- 🔒 未着手: まだ始めていない学習の数

**データ計算**:
```typescript
const stats = {
  totalRecords: nodes.length,
  totalDuration: nodes.reduce((sum, node) => sum + node.record.duration, 0),
  completed: nodes.filter(n => n.status === 'completed').length,
  inProgress: nodes.filter(n => n.status === 'in-progress').length,
  locked: nodes.filter(n => n.status === 'locked').length,
};
```

---

### 4. **コントロールパネル**

**役割**: ツリー表示の操作コントロール

**機能**:

#### ズームコントロール
- 🔍 Zoom In: ツリーを拡大
- 🔍 Zoom Out: ツリーを縮小
- 🔄 Reset View: 初期表示位置に戻る

#### 保存機能
- 💾 Save: 現在のノード配置を保存（LocalStorage）

#### フィルター
- チェックボックス: 各ステータスの表示/非表示切り替え
  - ✓ 完了済み（緑）
  - ✓ 進行中（黄）
  - ✓ 未着手（グレー）

**状態管理**:
```typescript
const [zoomLevel, setZoomLevel] = useState(1);
const [showCompleted, setShowCompleted] = useState(true);
const [showInProgress, setShowInProgress] = useState(true);
const [showLocked, setShowLocked] = useState(true);
```

---

### 5. **LearningTree** (`src/components/LearningTree.tsx`)

**役割**: 学習記録をノードグラフとして可視化

**使用ライブラリ**: React Flow (https://reactflow.dev/)

**データソース**:
- `localStorage`: `symproof-tree:tree-nodes`
- `localStorage`: `symproof-tree:confirmed-records`

**ノードの種類**:

#### 完了ノード（Completed）
- 色: 緑系（`#4CAF50`）
- ボーダー: 実線、太め
- 背景: ライトグリーン
- アイコン: ✅

#### 進行中ノード（In Progress）
- 色: 黄色系（`#FFC107`）
- ボーダー: 破線
- 背景: ライトイエロー
- アイコン: 🟡

#### 未着手ノード（Locked）
- 色: グレー系（`#9E9E9E`）
- ボーダー: 点線
- 背景: ライトグレー
- アイコン: 🔒
- 透明度: 0.6

**ノード表示内容**:
- タイトル（30文字まで、超過は...）
- 学習時間（分）
- 理解度スコア（星またはスコア表示）
- 主要タグ（1-2個）
- ステータスアイコン

**エッジ（矢印）**:
- タイプ: Smooth Step（段階的な曲線）
- 色: `#666`（デフォルト）
- 進行中のノードへのエッジ: アニメーション付き
- 太さ: 1-2px

**インタラクション**:

1. **パン（移動）**
   - マウスドラッグでキャンバス全体を移動
   - タッチデバイス: スワイプで移動

2. **ズーム**
   - マウスホイールでズームイン/アウト
   - ピンチジェスチャー（モバイル）
   - コントロールパネルのボタン

3. **ノードクリック**
   - NodeDetailModal を表示
   - 選択されたノードをハイライト

4. **ノードドラッグ**
   - ノードを自由に配置
   - 自動保存機能（debounce 1秒）

5. **ノードホバー**
   - ツールチップ表示（タイトル完全版、URL、完了日時）

**レイアウトアルゴリズム**:

初期配置: Dagre（階層的自動レイアウト）
```typescript
import dagre from 'dagre';

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB' }); // Top to Bottom

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 100 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
```

**React Flow設定**:
```typescript
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onNodeClick={handleNodeClick}
  onNodeDrag={handleNodeDrag}
  fitView
  minZoom={0.5}
  maxZoom={2}
  defaultZoom={1}
  nodeTypes={nodeTypes}
  edgeTypes={edgeTypes}
  connectionLineType={ConnectionLineType.SmoothStep}
>
  <Background color="#f0f0f0" gap={16} />
  <Controls />
  <MiniMap
    nodeColor={(node) => {
      switch (node.data.status) {
        case 'completed': return '#4CAF50';
        case 'in-progress': return '#FFC107';
        case 'locked': return '#9E9E9E';
        default: return '#666';
      }
    }}
  />
</ReactFlow>
```

---

### 6. **NodeDetailModal** (`src/components/NodeDetailModal.tsx`)

**役割**: ノードの詳細情報をモーダルで表示

**Props**:
```typescript
interface NodeDetailModalProps {
  node: LearningNode | null;
  record: LearningRecord | null;
  isOpen: boolean;
  onClose: () => void;
}
```

**表示内容**:

#### 基本情報
- タイトル（完全版）
- URL（クリック可能リンク）
- ステータス（アイコン + テキスト）
- 完了日時（完了済みの場合）

#### メトリクス
- 学習時間（分）
- 理解度スコア（星表示）
- タグ一覧（すべて表示）

#### メモ
- 自動生成メモの全文

#### AI要約
- Gemini生成の要約（2-3文）
- 生成失敗時: "要約生成失敗" + リトライボタン

#### ブロックチェーン証明（完了済みの場合）
- トランザクションハッシュ（クリック可能）
- ブロック高
- "Symbol Explorerで確認" リンク

#### 関連情報
- **前提となる学習**: prerequisites配列のノードリスト
  - 各ノードのタイトル + ステータス
  - クリックで該当ノードにフォーカス
- **この学習が必要な次のステップ**: dependents配列のノードリスト
  - 各ノードのタイトル + ステータス
  - クリックで該当ノードにフォーカス

**アクション**:
- "Symbol Explorerで確認": 外部リンク（新しいタブ）
- "ホームに戻る": ホームページに遷移
- "閉じる": モーダルを閉じる

**スタイリング**:
- オーバーレイ: 背景暗転、半透明
- モーダル: 中央配置、最大幅600px
- スクロール可能（内容が多い場合）
- アニメーション: フェードイン/アウト

---

## データ構造

### LearningNode

```typescript
interface LearningNode {
  id: string;
  recordId: string;
  position: { x: number; y: number };
  prerequisites: string[];  // 前提ノードIDの配列
  dependents: string[];     // 依存ノードIDの配列
  status: 'completed' | 'in-progress' | 'locked';
  completedAt?: string;
}
```

### React Flow用に変換

```typescript
const convertToReactFlowNode = (
  learningNode: LearningNode,
  record: LearningRecord
): Node => {
  return {
    id: learningNode.id,
    type: 'custom',
    position: learningNode.position,
    data: {
      label: record.title,
      duration: record.duration,
      understanding: record.understanding,
      tags: record.tags,
      status: learningNode.status,
      proofStatus: record.proofStatus,
    },
    style: {
      ...getNodeStyle(learningNode.status),
    },
  };
};

const convertToReactFlowEdges = (nodes: LearningNode[]): Edge[] => {
  const edges: Edge[] = [];

  nodes.forEach((node) => {
    node.prerequisites.forEach((prereqId) => {
      edges.push({
        id: `${prereqId}-${node.id}`,
        source: prereqId,
        target: node.id,
        type: 'smoothstep',
        animated: node.status === 'in-progress',
        style: { stroke: '#666' },
      });
    });
  });

  return edges;
};
```

---

## ページロジック

### 初期化

```typescript
// src/app/tree/page.tsx

const TreePage = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<LearningNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTreeData();
  }, []);

  const loadTreeData = async () => {
    // 1. LocalStorageから学習ノードとレコードを取得
    const learningNodes = getTreeNodes();
    const records = getConfirmedRecords();

    // 2. レコードとノードをマッピング
    const nodesWithRecords = learningNodes.map(node => {
      const record = records.find(r => r.id === node.recordId);
      return { node, record };
    });

    // 3. React Flow形式に変換
    const reactFlowNodes = nodesWithRecords.map(({ node, record }) =>
      convertToReactFlowNode(node, record)
    );

    const reactFlowEdges = convertToReactFlowEdges(learningNodes);

    // 4. 自動レイアウト適用
    const { nodes: layoutedNodes, edges: layoutedEdges } =
      getLayoutedElements(reactFlowNodes, reactFlowEdges);

    // 5. 状態更新
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  };

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    const learningNode = findLearningNodeById(node.id);
    setSelectedNode(learningNode);
    setIsModalOpen(true);
  };

  const handleNodeDrag = useCallback(
    debounce((node: Node) => {
      // ノード位置を保存
      saveNodePosition(node.id, node.position);
    }, 1000),
    []
  );

  return (
    <div>
      <Header />

      <main>
        <PageTitle />
        <StatsBar stats={calculateStats(nodes)} />
        <ControlPanel
          onZoomIn={() => /* ズーム処理 */}
          onZoomOut={() => /* ズーム処理 */}
          onResetView={() => /* リセット処理 */}
          onSave={() => saveLayout(nodes)}
        />

        <LearningTree
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          onNodeDrag={handleNodeDrag}
        />
      </main>

      <NodeDetailModal
        node={selectedNode}
        record={getRecordByNodeId(selectedNode?.recordId)}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
```

---

## インタラクションフロー

### 1. ページ読み込み
```
ページアクセス
  ↓
LocalStorageからデータ取得
  ↓
React Flow形式に変換
  ↓
自動レイアウト適用
  ↓
ツリー表示
```

### 2. ノードクリック
```
ユーザーがノードをクリック
  ↓
該当LearningNodeを特定
  ↓
対応するLearningRecordを取得
  ↓
NodeDetailModalを表示
  ↓
前提・依存関係も表示
```

### 3. ノード配置変更
```
ユーザーがノードをドラッグ
  ↓
新しい位置を取得
  ↓
1秒後（debounce）
  ↓
LocalStorageに保存
```

---

## レスポンシブデザイン

### デスクトップ（1024px以上）
- ツリーキャンバス: フルスクリーン
- ノードサイズ: 200x100px
- コントロールパネル: 上部固定

### タブレット（768px - 1023px）
- ツリーキャンバス: フルスクリーン
- ノードサイズ: 180x90px
- コントロールパネル: コンパクト表示

### モバイル（767px以下）
- ツリーキャンバス: フルスクリーン
- ノードサイズ: 150x80px
- コントロールパネル: ドロワー形式
- タッチジェスチャー対応（ピンチズーム）

---

## パフォーマンス最適化

- **仮想化**: 100ノード以上の場合、画面外のノードを簡略化
- **メモ化**: ノード・エッジの再計算を最小化
- **デバウンス**: ドラッグ保存は1秒間隔
- **遅延読み込み**: AI要約は必要時に取得

---

このページは学習の全体像を俯瞰し、学習の進捗と関連性を視覚的に理解するための重要なインターフェースです。
