/**
 * 学習ツリーメインビューコンポーネント
 * React Flow統合
 */

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
  MiniMap,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import LearningRecordNode from './LearningRecordNode';
import CategorySelector from './CategorySelector';
import { ConfirmedRecord } from '@/types';
import {
  convertRecordsToNodes,
  generateTimelineEdges,
  generateSimilarityEdges,
  getCategoryStats,
} from '@/lib/tree/treeConverter';
import { layoutNodesByCategory, getCategoryPositions } from '@/lib/tree/treeLayout';
import {
  calculatePolarLayout,
  generatePolarEdges,
  getAvailableCategories,
} from '@/lib/tree/polarLayout';
import { AbstractionLevel } from '@/lib/tree/abstractionEstimator';

const nodeTypes = {
  learningRecord: LearningRecordNode,
};

interface LearningTreeViewProps {
  records: ConfirmedRecord[];
}

export default function LearningTreeView({ records }: LearningTreeViewProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [categoryStats, setCategoryStats] = useState<ReturnType<typeof getCategoryStats>>([]);
  const [showSimilarityEdges, setShowSimilarityEdges] = useState(false);

  // Phase 5.6: レイアウトモード
  const [layoutMode, setLayoutMode] = useState<'timeline' | 'polar'>('timeline');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<Array<{ category: string; count: number }>>([]);

  useEffect(() => {
    if (records.length === 0) return;

    // レコードをノードに変換
    const initialNodes = convertRecordsToNodes(records);

    // 抽象度レベルマップを構築
    const abstractionLevels = new Map<string, AbstractionLevel>();
    initialNodes.forEach(node => {
      if (node.data.abstractionLevel) {
        abstractionLevels.set(node.id, node.data.abstractionLevel);
      }
    });

    // カテゴリ一覧を取得
    const categories = getAvailableCategories(records);
    setAvailableCategories(categories);

    // 初回のみ: 最多カテゴリを選択
    if (selectedCategory === '' && categories.length > 0) {
      setSelectedCategory(categories[0].category);
    }

    // レイアウト計算
    let layoutedNodes: Node[];
    let layoutEdges: Edge[];

    if (layoutMode === 'polar' && selectedCategory) {
      // ポーラーレイアウト
      layoutedNodes = calculatePolarLayout(
        records,
        selectedCategory,
        abstractionLevels
      );
      layoutEdges = generatePolarEdges(
        records,
        abstractionLevels,
        layoutedNodes
      );
    } else {
      // タイムラインレイアウト（デフォルト）
      layoutedNodes = layoutNodesByCategory(initialNodes, records);
      const timelineEdges = generateTimelineEdges(records);
      const similarityEdges = showSimilarityEdges
        ? generateSimilarityEdges(records, abstractionLevels, 0.5)
        : [];
      layoutEdges = [...timelineEdges, ...similarityEdges];
    }

    // 統計情報を計算
    const stats = getCategoryStats(records);

    setNodes(layoutedNodes);
    setEdges(layoutEdges);
    setCategoryStats(stats);
  }, [records, showSimilarityEdges, layoutMode, selectedCategory, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      console.log('Node clicked:', node);
      // TODO: モーダルを開く処理（Phase 5.1では未実装）
    },
    []
  );

  if (records.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
            確定済みレコードがありません
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            保留中レコードをブロックチェーンに登録してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Phase 5.6: レイアウト切り替えとカテゴリ選択 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        {/* レイアウトモード切り替え */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            📐 レイアウトモード
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setLayoutMode('timeline')}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  layoutMode === 'timeline'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              📅 タイムライン
            </button>
            <button
              onClick={() => setLayoutMode('polar')}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  layoutMode === 'polar'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              🎯 ポーラー（極座標）
            </button>
          </div>
        </div>

        {/* ポーラーモード時のカテゴリ選択 */}
        {layoutMode === 'polar' && (
          <CategorySelector
            categories={availableCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )}
      </div>

      {/* ツリー表示 */}
      <div className="h-[700px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: layoutMode === 'polar' ? 0.3 : 0.2,
            minZoom: layoutMode === 'polar' ? 0.2 : 0.5,
            maxZoom: layoutMode === 'polar' ? 1.0 : 1.5,
          }}
          minZoom={0.1}
          maxZoom={2}
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
        >
        {/* 背景グリッド */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#cbd5e1"
          className="dark:opacity-30"
        />

        {/* コントロール（ズーム・パン）*/}
        <Controls
          showInteractive={false}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow"
        />

        {/* ミニマップ */}
        <MiniMap
          nodeColor={(node) => {
            // カテゴリに応じた色
            const category = (node.data as any).category;
            const colorMap: Record<string, string> = {
              'React/Next.js': '#3b82f6',
              TypeScript: '#6366f1',
              JavaScript: '#eab308',
              Blockchain: '#22c55e',
              'CSS/Design': '#a855f7',
              Backend: '#f97316',
            };
            return colorMap[category] || '#9ca3af';
          }}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"
          maskColor="rgba(0, 0, 0, 0.1)"
        />

        {/* 統計情報パネル */}
        <Panel position="top-right" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs space-y-1">
            <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              📊 カテゴリ統計
            </div>
            {categoryStats.map((stat) => (
              <div
                key={stat.category}
                className="flex items-center justify-between gap-3 text-gray-600 dark:text-gray-400"
              >
                <span className="truncate">{stat.category}:</span>
                <span className="font-medium whitespace-nowrap">
                  {stat.count}件 ({stat.totalDuration}分)
                </span>
              </div>
            ))}
          </div>
        </Panel>

        {/* 操作ガイドと設定パネル */}
        <Panel position="top-left" className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 text-xs">
          <div className="space-y-2 text-blue-800 dark:text-blue-300">
            <div className="font-semibold mb-1">💡 操作方法</div>
            <div>🖱️ ドラッグ: 移動</div>
            <div>🔍 ホイール: ズーム</div>
            <div>📍 ノードクリック: 詳細表示</div>

            {/* Phase 5.4: 類似度エッジ表示切替（タイムラインモードのみ） */}
            {layoutMode === 'timeline' && (
              <div className="border-t border-blue-200 dark:border-blue-700 pt-2 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSimilarityEdges}
                    onChange={(e) => setShowSimilarityEdges(e.target.checked)}
                    className="rounded"
                  />
                  <span className="font-medium">🔗 類似度エッジ表示</span>
                </label>
                {showSimilarityEdges && (
                  <div className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                    類似するレコード間を接続
                  </div>
                )}
              </div>
            )}

            {/* Phase 5.6: ポーラーモードの説明 */}
            {layoutMode === 'polar' && (
              <div className="border-t border-blue-200 dark:border-blue-700 pt-2 mt-2">
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>ポーラーレイアウト:</strong>
                  <br />
                  中心 → 基礎・抽象的
                  <br />
                  末端 → 専門・具体的
                </div>
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>
      </div>
    </div>
  );
}
