'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  useEdgesState,
  useNodesState,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import type { ConfirmedRecord } from '@/types';
import LearningRecordNode from './LearningRecordNode';
import CategoryLegend from './CategoryLegend';
import {
  convertRecordsToNodes,
  generateTimelineEdges,
  layoutByCategory,
  layoutPolar,
  type LearningRecordNodeData,
} from '@/lib/tree/treeConverter';
import { generateSimilarityEdges } from '@/lib/tree/similarity';

type Props = {
  records: ConfirmedRecord[];
};

export default function LearningTreeView({ records }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<LearningRecordNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [showSimilarity, setShowSimilarity] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'polar'>('grid');
  const [centerCategory, setCenterCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const tmp = new Set<string>();
    records.forEach((r) => {
      const title = r.session.title || '';
      const url = r.session.url || '';
      const text = `${url} ${title}`;
      if (/react|next/i.test(text)) tmp.add('React/Next.js');
      else if (/typescript|javascript\b/i.test(text)) tmp.add('TypeScript/JavaScript');
      else if (/symbol|blockchain|web3/i.test(text)) tmp.add('Blockchain');
      else if (/css|style|ui|ux/i.test(text)) tmp.add('CSS/Design');
      else tmp.add('その他');
    });
    return Array.from(tmp);
  }, [records]);

  useEffect(() => {
    if (!centerCategory && categories.length > 0) setCenterCategory(categories[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  useEffect(() => {
    const baseNodes = convertRecordsToNodes(records);
    const timelineEdges = generateTimelineEdges(records);
    const similarityEdges = showSimilarity ? generateSimilarityEdges(records, 2, 0.35) : [];
    const nextEdges = [...timelineEdges, ...similarityEdges];

    const layoutedNodes =
      layoutMode === 'polar'
        ? layoutPolar(baseNodes, { centerCategory: centerCategory ?? undefined })
        : layoutByCategory(baseNodes);

    setNodes(layoutedNodes);
    setEdges(nextEdges);
  }, [records, setNodes, setEdges, showSimilarity, layoutMode, centerCategory]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showSimilarity} onChange={(e) => setShowSimilarity(e.target.checked)} />
          類似度エッジを表示
        </label>

        <label className="inline-flex items-center gap-2 text-sm">
          レイアウト:
          <select
            className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800"
            value={layoutMode}
            onChange={(e) => setLayoutMode(e.target.value as 'grid' | 'polar')}
          >
            <option value="grid">カテゴリ × 時系列</option>
            <option value="polar">極座標</option>
          </select>
        </label>

        {layoutMode === 'polar' && (
          <label className="inline-flex items-center gap-2 text-sm">
            中心カテゴリ:
            <select
              className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800"
              value={centerCategory || ''}
              onChange={(e) => setCenterCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Legend */}
      <div className="mb-3">
        <CategoryLegend categories={categories} />
      </div>

      <div style={{ height: '70vh' }} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={{ learningRecord: LearningRecordNode }}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
