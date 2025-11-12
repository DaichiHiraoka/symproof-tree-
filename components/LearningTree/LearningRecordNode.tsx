'use client';

import React from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import type { LearningRecordNodeData } from '@/lib/tree/treeConverter';
import { getCategoryColor } from '@/lib/tree/ontology';

export default function LearningRecordNode({ data }: NodeProps<LearningRecordNodeData>) {
  const colors = getCategoryColor(data.category);
  const bgClass = data.isAnchor ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-white dark:bg-gray-800';
  return (
    <div className={`relative rounded-lg border ${colors.border} ${bgClass} shadow p-3 w-[280px]`}>
      {/* Edges require handles on custom nodes */}
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-gray-500 dark:bg-gray-300" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-gray-500 dark:bg-gray-300" />
      <div className="flex items-start justify-between">
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
          title="カテゴリ"
        >
          {data.category}
        </span>
        <span title={data.verified ? '検証済み' : '未検証'}>
          {data.verified ? (
            <span className="text-green-600">✓</span>
          ) : (
            <span className="text-yellow-600">○</span>
          )}
        </span>
      </div>

      <a
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-2 font-semibold text-sm text-blue-700 dark:text-blue-300 hover:underline break-words"
      >
        {data.title}
      </a>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
        <div>
          <div className="text-[10px] uppercase opacity-70">Date</div>
          <div className="font-mono break-all">{data.dateISO}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase opacity-70">Duration</div>
          <div>{data.durationMinutes} 分</div>
        </div>
      </div>

      <div className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 font-mono break-all">
        {data.transactionHash.slice(0, 10)}...{data.transactionHash.slice(-6)}
      </div>
    </div>
  );
}
