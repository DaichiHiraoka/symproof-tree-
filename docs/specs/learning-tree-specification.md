# 学習ツリー可視化機能 仕様書

**作成日**: 2025-11-12
**対象機能**: Phase 5 - Learning Tree Visualization
**実装優先度**: High
**想定工数**: 4～6時間

---

## 概要

学習ツリー可視化機能は、確定済み学習記録を階層的なツリー構造として表示する機能です。React Flowライブラリを使用して、インタラクティブで視覚的に理解しやすい学習進捗の表現を実現します。

---

## 目的

### ユーザーメリット

1. **学習の全体像把握**: 記録した学習内容を鳥瞰的に確認
2. **知識の関連性理解**: 学習トピック間の前提関係を可視化
3. **進捗のモチベーション**: 積み上げた学習記録を視覚的に確認
4. **ポートフォリオ強化**: 就職活動で学習体系を視覚的にアピール

### ビジネスメリット

1. **差別化**: 他の学習管理システムにない独自機能
2. **デモ映え**: インターンシップ発表で視覚的インパクト
3. **拡張性**: 将来的なAI推薦機能の基盤

---

## 機能要件

### FR-1: 学習ツリーの表示

**説明**: 確定済みレコードをノードとしてツリー表示

**詳細**:
- LocalStorageから確定済みレコードを取得
- 各レコードをReact Flowのノードに変換
- タイトル、科目、学習時間を表示
- ブロックチェーン登録済みの視覚的インジケーター（緑色のバッジ）

**UI要素**:
- ノード: 学習記録を表すカード型コンポーネント
  - タイトル: 太字、最大2行
  - 科目: 小さめのバッジ
  - 学習時間: "90分"形式
  - 理解度: 星アイコン × 1～5
  - 日付: "2025-11-12"形式
  - ブロックチェーンアイコン: 緑色のチェックマーク
- エッジ: ノード間を結ぶ矢印（方向性あり）

### FR-2: インタラクティブ操作

**説明**: ユーザーがツリーを操作できる機能

**詳細**:
- **パン**: マウスドラッグで表示領域を移動
- **ズーム**: マウスホイールで拡大・縮小
- **ノードクリック**: クリックでレコード詳細をモーダル表示
- **ミニマップ**: 全体構造を俯瞰するミニマップ（オプション）

**操作方法**:
- ドラッグ: キャンバス全体を移動
- ホイール: ズームイン・アウト
- ノードクリック: 詳細モーダル表示
- ダブルクリック: ノードを中心に移動（オプション）

### FR-3: 自動レイアウト

**説明**: ノード配置を自動計算

**詳細**:
- 階層レイアウトアルゴリズムを使用
- 科目ごとにグルーピング（オプション）
- 時系列順（古い順に上から下へ）または階層順（前提→応用）

**レイアウトオプション**:
1. **時系列レイアウト**: 日付順に縦方向に配置
2. **階層レイアウト**: 科目・前提関係に基づき階層配置
3. **クラスターレイアウト**: 科目ごとにグループ化

### FR-4: フィルタリング・検索

**説明**: 表示するレコードを絞り込み

**詳細**:
- 科目フィルター: 特定の科目のみ表示
- 期間フィルター: 指定期間内のレコードのみ表示
- 検索: タイトルやメモで検索

**UI要素**:
- 画面上部にフィルターバー
- ドロップダウン（科目選択）
- 日付ピッカー（期間選択）
- 検索ボックス

### FR-5: ノード詳細表示

**説明**: ノードクリック時の詳細情報表示

**詳細**:
- モーダルまたはサイドパネルで表示
- 学習記録の全情報を表示
- トランザクションハッシュとブロック高
- 「検証ページで確認」リンク
- 「Symbol Explorerで確認」リンク

---

## 非機能要件

### NFR-1: パフォーマンス

- 100ノードまで滑らかに動作（60fps）
- 初期ロード時間: 2秒以内
- ズーム・パン操作の遅延: 16ms以内

### NFR-2: レスポンシブデザイン

- デスクトップ（1920×1080以上）で最適
- タブレット（768px以上）で表示可能
- モバイル（375px以上）では簡易表示またはスクロール

### NFR-3: アクセシビリティ

- キーボードナビゲーション対応
- スクリーンリーダー対応（ノードラベル）
- 高コントラストモード対応

---

## データ構造

### React Flow ノード形式

```typescript
interface ReactFlowNode {
  id: string;                    // レコードID
  type: 'learningRecord';        // カスタムノードタイプ
  position: { x: number; y: number };
  data: {
    title: string;               // タイトル
    subject: string;             // 科目
    duration: number;            // 分単位
    understanding: number;       // 1～5
    date: string;                // ISO形式
    transactionHash: string;     // トランザクションハッシュ
    blockHeight: number;         // ブロック高
    verified: boolean;           // 検証済みフラグ
  };
}
```

### React Flow エッジ形式

```typescript
interface ReactFlowEdge {
  id: string;                    // エッジID（"edge-{source}-{target}"）
  source: string;                // 元ノードID
  target: string;                // 先ノードID
  type?: 'smoothstep' | 'default';
  animated?: boolean;            // アニメーション（オプション）
  label?: string;                // エッジラベル（例: "前提知識"）
}
```

---

## UI設計

### ページレイアウト

```
┌─────────────────────────────────────────────────────────┐
│ ナビゲーションヘッダー                                     │
├─────────────────────────────────────────────────────────┤
│ ページタイトル: 学習ツリー                                 │
├─────────────────────────────────────────────────────────┤
│ フィルターバー                                            │
│ [科目: 全て ▼] [期間: 全期間 ▼] [検索: _______]          │
├─────────────────────────────────────────────────────────┤
│                                                           │
│                    React Flow キャンバス                  │
│                                                           │
│   ┌──────────┐                                          │
│   │ Node 1   │                                          │
│   │ Title    │                                          │
│   │ 90分 ★★★★│                                          │
│   └────┬─────┘                                          │
│        │                                                 │
│        ↓                                                 │
│   ┌──────────┐      ┌──────────┐                       │
│   │ Node 2   │      │ Node 3   │                       │
│   │ Title    │      │ Title    │                       │
│   │ 60分 ★★★ │      │ 120分 ★★★★★│                      │
│   └──────────┘      └──────────┘                       │
│                                                           │
├─────────────────────────────────────────────────────────┤
│ コントロール: [+ Zoom In] [- Zoom Out] [⟲ Reset View]   │
└─────────────────────────────────────────────────────────┘
```

### ノードデザイン

```
┌─────────────────────────────┐
│ ✓ [科目バッジ]              │ ← ブロックチェーン確認アイコン
├─────────────────────────────┤
│ タイトル（太字・2行まで）      │
├─────────────────────────────┤
│ 90分  ★★★★☆                │ ← 学習時間と理解度
│ 2025-11-12                  │ ← 日付
└─────────────────────────────┘
```

**カラースキーム**:
- 背景: 白（ライトモード）/ ダークグレー（ダークモード）
- ボーダー: 青色（通常）/ 緑色（ブロックチェーン確認済み）
- 科目バッジ: カテゴリごとに色分け
  - プログラミング: 青
  - 数学: 緑
  - デザイン: 紫
  - その他: グレー

---

## 技術実装

### 使用ライブラリ

| ライブラリ | バージョン | 用途 |
|----------|-----------|------|
| reactflow | 11.11.4 | メインの可視化ライブラリ |
| dagre | (オプション) | 自動レイアウト計算 |

### ファイル構成

```
app/tree/
├── page.tsx                    # メインページコンポーネント

components/
├── LearningTree/
│   ├── LearningTreeView.tsx    # React Flow統合
│   ├── LearningRecordNode.tsx  # カスタムノードコンポーネント
│   ├── NodeDetailModal.tsx     # ノード詳細モーダル
│   └── TreeControls.tsx        # ズーム・リセットコントロール

lib/tree/
├── treeLayout.ts              # レイアウト計算ロジック
└── treeConverter.ts           # ConfirmedRecord → ReactFlow変換
```

### 実装手順

#### Step 1: データ変換ロジック実装

**ファイル**: `lib/tree/treeConverter.ts`

```typescript
import { ConfirmedRecord } from '@/types';
import { Node, Edge } from 'reactflow';

/**
 * 確定済みレコードをReact Flowノードに変換
 */
export function convertRecordsToNodes(
  records: ConfirmedRecord[]
): Node[] {
  return records.map((record, index) => ({
    id: record.id,
    type: 'learningRecord',
    position: { x: index * 250, y: 0 }, // 仮の位置（後でレイアウト計算）
    data: {
      title: record.session.title,
      subject: extractSubject(record.session.url),
      duration: Math.round(record.session.duration / 60000), // ミリ秒→分
      understanding: calculateUnderstanding(record),
      date: record.session.startTime.toISOString().split('T')[0],
      transactionHash: record.transactionHash,
      blockHeight: record.blockHeight,
      verified: record.verified,
    },
  }));
}

/**
 * レコード間のエッジを生成（前提関係）
 */
export function generateEdges(records: ConfirmedRecord[]): Edge[] {
  const edges: Edge[] = [];

  // 簡易実装: 時系列順にエッジを生成
  const sortedRecords = [...records].sort(
    (a, b) => a.session.startTime.getTime() - b.session.startTime.getTime()
  );

  for (let i = 0; i < sortedRecords.length - 1; i++) {
    // 同じ科目の連続するレコードを接続
    const current = sortedRecords[i];
    const next = sortedRecords[i + 1];

    if (extractSubject(current.session.url) === extractSubject(next.session.url)) {
      edges.push({
        id: `edge-${current.id}-${next.id}`,
        source: current.id,
        target: next.id,
        type: 'smoothstep',
        animated: false,
      });
    }
  }

  return edges;
}

/**
 * URLから科目を抽出（簡易版）
 */
function extractSubject(url: string): string {
  if (url.includes('react') || url.includes('nextjs')) return 'プログラミング';
  if (url.includes('symbol') || url.includes('blockchain')) return 'ブロックチェーン';
  if (url.includes('typescript')) return 'プログラミング';
  return 'その他';
}

/**
 * 理解度を計算（簡易版）
 */
function calculateUnderstanding(record: ConfirmedRecord): number {
  // 実際にはBrowsingSessionのmetadataから取得すべき
  // 仮実装: ランダムに3～5を返す
  return Math.floor(Math.random() * 3) + 3;
}
```

#### Step 2: レイアウト計算ロジック実装

**ファイル**: `lib/tree/treeLayout.ts`

```typescript
import { Node, Edge } from 'reactflow';

/**
 * ノードの位置を自動計算（階層レイアウト）
 */
export function calculateLayout(
  nodes: Node[],
  edges: Edge[]
): Node[] {
  // 簡易実装: 時系列に従って縦に配置
  const sortedNodes = [...nodes].sort((a, b) => {
    const dateA = new Date(a.data.date).getTime();
    const dateB = new Date(b.data.date).getTime();
    return dateA - dateB;
  });

  const VERTICAL_SPACING = 150; // ノード間の縦間隔
  const HORIZONTAL_SPACING = 300; // ノード間の横間隔

  // 科目ごとにグループ化
  const subjectGroups: { [subject: string]: Node[] } = {};

  sortedNodes.forEach(node => {
    const subject = node.data.subject;
    if (!subjectGroups[subject]) {
      subjectGroups[subject] = [];
    }
    subjectGroups[subject].push(node);
  });

  // 各科目グループを横並びに配置
  const subjects = Object.keys(subjectGroups);
  const layoutedNodes: Node[] = [];

  subjects.forEach((subject, colIndex) => {
    const groupNodes = subjectGroups[subject];

    groupNodes.forEach((node, rowIndex) => {
      layoutedNodes.push({
        ...node,
        position: {
          x: colIndex * HORIZONTAL_SPACING,
          y: rowIndex * VERTICAL_SPACING,
        },
      });
    });
  });

  return layoutedNodes;
}
```

#### Step 3: カスタムノードコンポーネント実装

**ファイル**: `components/LearningTree/LearningRecordNode.tsx`

```typescript
'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface LearningRecordNodeData {
  title: string;
  subject: string;
  duration: number;
  understanding: number;
  date: string;
  transactionHash: string;
  blockHeight: number;
  verified: boolean;
}

function LearningRecordNode({ data }: NodeProps<LearningRecordNodeData>) {
  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'プログラミング':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ブロックチェーン':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case '数学':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <>
      {/* 入力ハンドル（上部） */}
      <Handle type="target" position={Position.Top} />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-blue-500 dark:border-blue-400 p-4 min-w-[220px] max-w-[280px]">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs px-2 py-1 rounded ${getSubjectColor(data.subject)}`}>
            {data.subject}
          </span>
          {data.verified && (
            <span className="text-green-600 dark:text-green-400 text-lg" title="ブロックチェーン確認済み">
              ✓
            </span>
          )}
        </div>

        {/* タイトル */}
        <h3 className="font-bold text-sm mb-2 line-clamp-2 text-gray-900 dark:text-gray-100">
          {data.title}
        </h3>

        {/* 詳細情報 */}
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-between">
            <span>{data.duration}分</span>
            <span className="text-base">{renderStars(data.understanding)}</span>
          </div>
          <div className="text-xs">{data.date}</div>
        </div>
      </div>

      {/* 出力ハンドル（下部） */}
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default memo(LearningRecordNode);
```

#### Step 4: メインビューコンポーネント実装

**ファイル**: `components/LearningTree/LearningTreeView.tsx`

```typescript
'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import LearningRecordNode from './LearningRecordNode';
import { ConfirmedRecord } from '@/types';
import { convertRecordsToNodes, generateEdges } from '@/lib/tree/treeConverter';
import { calculateLayout } from '@/lib/tree/treeLayout';

const nodeTypes = {
  learningRecord: LearningRecordNode,
};

interface LearningTreeViewProps {
  records: ConfirmedRecord[];
}

export default function LearningTreeView({ records }: LearningTreeViewProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (records.length === 0) return;

    // レコードをノードとエッジに変換
    const initialNodes = convertRecordsToNodes(records);
    const initialEdges = generateEdges(records);

    // レイアウト計算
    const layoutedNodes = calculateLayout(initialNodes, initialEdges);

    setNodes(layoutedNodes);
    setEdges(initialEdges);
  }, [records, setNodes, setEdges]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    // TODO: モーダルを開く処理
  }, []);

  if (records.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          確定済みレコードがありません。レコードをブロックチェーンに登録してください。
        </p>
      </div>
    );
  }

  return (
    <div className="h-[600px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

#### Step 5: ページ統合

**ファイル**: `app/tree/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { ConfirmedRecord } from '@/types';
import { getConfirmedRecords } from '@/lib/storage/localStorage';
import LearningTreeView from '@/components/LearningTree/LearningTreeView';

export default function TreePage() {
  const [records, setRecords] = useState<ConfirmedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const confirmedRecords = getConfirmedRecords();
    setRecords(confirmedRecords);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-lg">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">学習ツリー</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          ブロックチェーンに記録した学習の進捗を可視化します
        </p>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">確定済みレコード</p>
            <p className="text-2xl font-bold">{records.length}件</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">総学習時間</p>
            <p className="text-2xl font-bold">
              {Math.round(
                records.reduce((sum, r) => sum + r.session.duration, 0) / 60000
              )}分
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">ブロックチェーン証明</p>
            <p className="text-2xl font-bold text-green-600">100%</p>
          </div>
        </div>

        {/* ツリー表示 */}
        <LearningTreeView records={records} />
      </div>
    </div>
  );
}
```

---

## 実装優先度

### Phase 5.1: 基本表示（必須）

- [P0] データ変換ロジック実装
- [P0] カスタムノードコンポーネント作成
- [P0] React Flow統合
- [P0] ページ実装

**所要時間**: 3時間

### Phase 5.2: レイアウト最適化（推奨）

- [P1] 階層レイアウトアルゴリズム実装
- [P1] 科目別グルーピング

**所要時間**: 2時間

### Phase 5.3: インタラクション強化（オプション）

- [P2] ノード詳細モーダル
- [P2] フィルタリング機能
- [P2] 検索機能

**所要時間**: 3時間

---

## テスト計画

### 単体テスト

- [ ] `treeConverter.ts`: レコード→ノード変換の正確性
- [ ] `treeLayout.ts`: レイアウト計算の妥当性
- [ ] `LearningRecordNode.tsx`: ノードの表示内容

### 統合テスト

- [ ] 0件レコードでの空状態表示
- [ ] 1件レコードでの単一ノード表示
- [ ] 10件以上レコードでのレイアウト
- [ ] ズーム・パン操作
- [ ] ノードクリック

### ビジュアルテスト

- [ ] ライトモード表示
- [ ] ダークモード表示
- [ ] モバイル表示（簡易版）

---

## 今後の拡張案

### AI推薦機能

- 学習履歴に基づく次の学習内容の推薦
- 不足している前提知識の検出

### ソーシャル機能

- 学習ツリーの共有
- 他ユーザーのツリーとの比較

### アナリティクス

- 科目別学習時間の円グラフ
- 週間・月間の学習推移グラフ

---

**Document Version**: 1.0
**Status**: 実装待ち
