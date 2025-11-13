/**
 * 学習ツリーレイアウト計算
 * Phase 5.1: カテゴリ列×時系列行の基本レイアウト
 * Phase 5.2: オントロジーベースのカテゴリ抽出統合
 */

import { Node } from 'reactflow';
import { ConfirmedRecord } from '@/types';
import { extractOntologyBasedCategory } from './treeConverter';
import { VocabularyOntology, DEFAULT_ONTOLOGY } from './ontology';

/**
 * レイアウト設定
 */
const LAYOUT_CONFIG = {
  COLUMN_WIDTH: 300,      // カテゴリ間の横間隔
  ROW_HEIGHT: 180,        // ノード間の縦間隔
  NODE_WIDTH: 240,        // ノードの幅
  NODE_HEIGHT: 140,       // ノードの高さ
  PADDING_X: 50,          // 左パディング
  PADDING_Y: 50,          // 上パディング
};

/**
 * カテゴリごとに縦列、時系列で縦に配置
 * Phase 5.2: オントロジーベースのカテゴリグルーピング
 */
export function layoutNodesByCategory(
  nodes: Node[],
  records: ConfirmedRecord[],
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): Node[] {
  // カテゴリごとにグルーピング
  const categoryGroups: Record<string, Array<{ node: Node; record: ConfirmedRecord }>> = {};

  nodes.forEach((node, index) => {
    const record = records[index];
    const category = extractOntologyBasedCategory(record, ontology);

    if (!categoryGroups[category]) {
      categoryGroups[category] = [];
    }

    categoryGroups[category].push({ node, record });
  });

  const layoutedNodes: Node[] = [];
  const categoryNames = Object.keys(categoryGroups);

  categoryNames.forEach((categoryName, colIndex) => {
    const categoryData = categoryGroups[categoryName];

    // 時系列ソート（古い順）
    const sorted = [...categoryData].sort(
      (a, b) =>
        a.record.session.startTime.getTime() -
        b.record.session.startTime.getTime()
    );

    sorted.forEach((data, rowIndex) => {
      layoutedNodes.push({
        ...data.node,
        position: {
          x: LAYOUT_CONFIG.PADDING_X + colIndex * LAYOUT_CONFIG.COLUMN_WIDTH,
          y: LAYOUT_CONFIG.PADDING_Y + rowIndex * LAYOUT_CONFIG.ROW_HEIGHT,
        },
      });
    });
  });

  return layoutedNodes;
}

/**
 * ツリー全体のバウンディングボックスを計算
 */
export function calculateBoundingBox(nodes: Node[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach(node => {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + LAYOUT_CONFIG.NODE_WIDTH);
    maxY = Math.max(maxY, node.position.y + LAYOUT_CONFIG.NODE_HEIGHT);
  });

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * カテゴリ情報を取得
 * Phase 5.2: オントロジーベースのカテゴリ抽出
 */
export function getCategoryPositions(
  records: ConfirmedRecord[],
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): Array<{ category: string; x: number; y: number }> {
  const categoryMap = new Map<string, { x: number; y: number }>();
  const categoryIndices = new Map<string, number>();

  records.forEach(record => {
    const category = extractOntologyBasedCategory(record, ontology);

    if (!categoryIndices.has(category)) {
      const index = categoryIndices.size;
      categoryIndices.set(category, index);

      categoryMap.set(category, {
        x: LAYOUT_CONFIG.PADDING_X + index * LAYOUT_CONFIG.COLUMN_WIDTH,
        y: LAYOUT_CONFIG.PADDING_Y - 40, // カテゴリラベルは上に配置
      });
    }
  });

  return Array.from(categoryMap.entries()).map(([category, pos]) => ({
    category,
    ...pos,
  }));
}
