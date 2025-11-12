/**
 * 学習ツリー用カスタムノードコンポーネント
 * Phase 5.3: 抽象度表示追加
 */

'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CATEGORIES } from '@/lib/tree/treeConverter';
import {
  AbstractionLevel,
  getAbstractionLevelColor,
  getConfidenceIcon,
} from '@/lib/tree/abstractionEstimator';

interface LearningRecordNodeData {
  title: string;
  url: string;
  category: string;
  duration: number;
  understanding: number;
  date: string;
  transactionHash: string;
  blockHeight: number;
  verified: boolean;
  abstractionLevel?: AbstractionLevel;
  abstractionLabel?: string;
  abstractionConfidence?: number;
  layer?: number;
  totalLayers?: number;
}

function LearningRecordNode({ data }: NodeProps<LearningRecordNodeData>) {
  /**
   * カテゴリに応じた色を取得
   */
  const getCategoryColor = (category: string) => {
    const categoryData = CATEGORIES[category as keyof typeof CATEGORIES];
    if (!categoryData) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };

    return colorMap[categoryData.color] || colorMap.gray;
  };

  /**
   * 理解度を星で表示
   */
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
      >
        ★
      </span>
    ));
  };

  /**
   * カテゴリアイコンを取得
   */
  const getCategoryIcon = (category: string) => {
    return CATEGORIES[category as keyof typeof CATEGORIES]?.icon || '📚';
  };

  return (
    <>
      {/* 入力ハンドル（上部） */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#3b82f6', width: 8, height: 8 }}
      />

      <div
        className={`
          ${data.layer === 0 ? 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/40 dark:to-yellow-900/40' : 'bg-white dark:bg-gray-800'}
          rounded-lg shadow-lg
          border-2
          ${data.layer === 0 ? 'border-amber-500 dark:border-amber-400' : data.verified ? 'border-green-500' : 'border-blue-500'}
          dark:border-opacity-60
          p-4
          min-w-[220px] max-w-[240px]
          hover:shadow-xl transition-shadow duration-200
          ${data.layer === 0 ? 'ring-2 ring-amber-300 dark:ring-amber-600' : ''}
        `}
      >
        {/* ヘッダー: カテゴリと検証アイコン */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${getCategoryColor(
              data.category
            )}`}
          >
            <span>{getCategoryIcon(data.category)}</span>
            <span className="font-medium">{data.category}</span>
          </span>
          <div className="flex items-center gap-1">
            {data.layer === 0 && (
              <span
                className="text-amber-600 dark:text-amber-400 text-lg"
                title="中心ノード（最も基礎的）"
              >
                ⭐
              </span>
            )}
            {data.verified && (
              <span
                className="text-green-600 dark:text-green-400 text-lg"
                title="ブロックチェーン確認済み"
              >
                ✓
              </span>
            )}
          </div>
        </div>

        {/* Phase 5.3: 抽象度バッジ */}
        {data.abstractionLevel && data.abstractionLabel && (
          <div className="mb-2">
            <span
              className={`text-xs px-2 py-0.5 rounded ${getAbstractionLevelColor(
                data.abstractionLevel
              )}`}
              title={`信頼度: ${Math.round((data.abstractionConfidence || 0) * 100)}%`}
            >
              {data.abstractionLabel} {getConfidenceIcon(data.abstractionConfidence || 0)}
            </span>
          </div>
        )}

        {/* タイトル */}
        <h3 className="font-bold text-sm mb-2 line-clamp-2 text-gray-900 dark:text-gray-100 leading-snug">
          {data.title}
        </h3>

        {/* 詳細情報 */}
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          {/* 学習時間と理解度 */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-500">⏱</span>
              <span className="font-medium">{data.duration}分</span>
            </span>
            <span className="text-base leading-none">{renderStars(data.understanding)}</span>
          </div>

          {/* 日付 */}
          <div className="flex items-center gap-1">
            <span className="text-gray-500 dark:text-gray-500">📅</span>
            <span>{data.date}</span>
          </div>

          {/* ブロック高 */}
          {data.blockHeight > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-500">🔗</span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                Block #{data.blockHeight.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 出力ハンドル（下部） */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#3b82f6', width: 8, height: 8 }}
      />
    </>
  );
}

export default memo(LearningRecordNode);
