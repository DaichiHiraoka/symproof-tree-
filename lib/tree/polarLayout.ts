/**
 * 極座標レイアウト計算
 * Phase 5.6: 動的ツリー再構築とポーラーレイアウト
 *
 * 中心: 基礎的・抽象的な内容
 * 末端: 専門的・具体的な内容
 */

import { Node } from 'reactflow';
import { ConfirmedRecord } from '@/types';
import { extractOntologyBasedCategory } from './treeConverter';
import { AbstractionLevel } from './abstractionEstimator';
import { findMostSimilarRecords, SimilarityScore } from './similarityScorer';
import { VocabularyOntology, DEFAULT_ONTOLOGY } from './ontology';

/**
 * ポーラーレイアウト設定
 */
const POLAR_CONFIG = {
  CENTER_RADIUS: 150,       // 中心円の半径（拡大: 50 → 150）
  RADIUS_INCREMENT: 300,    // 各レイヤーの半径増分（拡大: 150 → 300）
  MIN_ANGLE_GAP: 0.1,       // 最小角度間隔（ラジアン）
  MAX_LAYER: 5,             // 最大レイヤー数
  NODE_SPACING: 200,        // ノード間の最小距離
};

/**
 * レイヤー情報
 */
interface LayerInfo {
  layer: number;            // レイヤー番号（0=中心）
  radius: number;           // レイヤーの半径
  records: ConfirmedRecord[]; // このレイヤーのレコード
}

/**
 * 極座標レイアウトでノードを配置
 *
 * @param records - 全確定済みレコード
 * @param centerCategory - 中心カテゴリ
 * @param abstractionLevels - 各レコードの抽象度レベル
 * @param ontology - オントロジー定義
 * @returns 配置済みノード配列
 */
export function calculatePolarLayout(
  records: ConfirmedRecord[],
  centerCategory: string,
  abstractionLevels: Map<string, AbstractionLevel>,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): Node[] {
  if (records.length === 0) return [];

  // 1. 中心カテゴリのレコードを抽出
  const centerRecords = records.filter(
    record => extractOntologyBasedCategory(record, ontology) === centerCategory
  );

  if (centerRecords.length === 0) {
    // 中心カテゴリが見つからない場合は最初のカテゴリを使用
    console.warn(`Category "${centerCategory}" not found, using first record's category`);
    const firstCategory = extractOntologyBasedCategory(records[0], ontology);
    return calculatePolarLayout(records, firstCategory, abstractionLevels, ontology);
  }

  // 2. 中心レコードを抽象度でソート（低い順 = 基礎から）
  const sortedCenterRecords = [...centerRecords].sort(
    (a, b) => {
      const levelA = abstractionLevels.get(a.id) || 3;
      const levelB = abstractionLevels.get(b.id) || 3;
      return levelA - levelB;
    }
  );

  // 3. レイヤー構造を構築
  const layers = buildLayerStructure(
    sortedCenterRecords,
    records,
    abstractionLevels,
    ontology
  );

  // 4. 各レイヤーにノードを配置
  const nodes: Node[] = [];
  layers.forEach((layer, layerIndex) => {
    const layerNodes = layoutLayer(layer, layerIndex, layers.length);
    nodes.push(...layerNodes);
  });

  return nodes;
}

/**
 * レイヤー構造を構築
 * 中心カテゴリから類似度に基づいて外側に広げる
 */
function buildLayerStructure(
  centerRecords: ConfirmedRecord[],
  allRecords: ConfirmedRecord[],
  abstractionLevels: Map<string, AbstractionLevel>,
  ontology: VocabularyOntology
): LayerInfo[] {
  const layers: LayerInfo[] = [];
  const visitedRecords = new Set<string>();

  // Layer 0: 中心（最も基礎的なレコード1～3個）
  const layer0Records = centerRecords.slice(0, 3);
  layers.push({
    layer: 0,
    radius: POLAR_CONFIG.CENTER_RADIUS,
    records: layer0Records,
  });
  layer0Records.forEach(r => visitedRecords.add(r.id));

  // Layer 1+: 類似レコードを段階的に追加
  let currentLayerRecords = layer0Records;
  let layerNumber = 1;

  while (layerNumber < POLAR_CONFIG.MAX_LAYER) {
    const nextLayerRecords: ConfirmedRecord[] = [];

    // 現在のレイヤーの各レコードから類似レコードを探す
    currentLayerRecords.forEach(record => {
      const abstraction = abstractionLevels.get(record.id) || 3;
      const similarRecords = findMostSimilarRecords(
        record,
        abstraction,
        allRecords,
        abstractionLevels,
        5, // topK
        ontology
      );

      // 未訪問の類似レコードを追加
      similarRecords.forEach(sim => {
        if (!visitedRecords.has(sim.recordB) && sim.overallScore >= 0.3) {
          const similarRecord = allRecords.find(r => r.id === sim.recordB);
          if (similarRecord && !nextLayerRecords.some(r => r.id === similarRecord.id)) {
            nextLayerRecords.push(similarRecord);
            visitedRecords.add(similarRecord.id);
          }
        }
      });
    });

    // 次のレイヤーにレコードがなければ終了
    if (nextLayerRecords.length === 0) break;

    // 抽象度でソート（高い順 = より専門的）
    const sortedNextLayer = nextLayerRecords.sort(
      (a, b) => {
        const levelA = abstractionLevels.get(a.id) || 3;
        const levelB = abstractionLevels.get(b.id) || 3;
        return levelB - levelA; // 降順
      }
    );

    layers.push({
      layer: layerNumber,
      radius: POLAR_CONFIG.CENTER_RADIUS + layerNumber * POLAR_CONFIG.RADIUS_INCREMENT,
      records: sortedNextLayer.slice(0, 12), // 1レイヤー最大12個
    });

    currentLayerRecords = sortedNextLayer.slice(0, 12);
    layerNumber++;
  }

  return layers;
}

/**
 * 1つのレイヤーにノードを配置
 */
function layoutLayer(
  layer: LayerInfo,
  layerIndex: number,
  totalLayers: number
): Node[] {
  const nodes: Node[] = [];
  const { radius, records } = layer;

  if (records.length === 0) return nodes;

  // 等間隔に角度を割り当て
  const angleStep = (2 * Math.PI) / records.length;

  records.forEach((record, index) => {
    const angle = index * angleStep;

    // 極座標をデカルト座標に変換
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    nodes.push({
      id: record.id,
      type: 'learningRecord',
      position: { x, y },
      data: {
        title: record.session.title,
        url: record.session.url,
        category: extractOntologyBasedCategory(record, DEFAULT_ONTOLOGY),
        duration: Math.round(record.session.duration / 60000),
        date: record.session.startTime.toISOString().split('T')[0],
        transactionHash: record.transactionHash,
        blockHeight: record.blockHeight,
        verified: record.verified,
        // Phase 5.6: レイヤー情報を追加
        layer: layerIndex,
        totalLayers,
      },
    });
  });

  return nodes;
}

/**
 * ポーラーレイアウト用のエッジを生成
 * 類似度の高いレコード間を接続
 */
export function generatePolarEdges(
  records: ConfirmedRecord[],
  abstractionLevels: Map<string, AbstractionLevel>,
  nodes: Node[],
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
) {
  const edges: any[] = [];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // 各ノードについて、類似度の高いノードへのエッジを作成
  records.forEach(record => {
    const abstraction = abstractionLevels.get(record.id) || 3;
    const similarRecords = findMostSimilarRecords(
      record,
      abstraction,
      records,
      abstractionLevels,
      3, // 上位3件のみ
      ontology
    );

    similarRecords.forEach((sim, index) => {
      if (sim.overallScore < 0.4) return; // 閾値以下は除外

      const sourceNode = nodeMap.get(record.id);
      const targetNode = nodeMap.get(sim.recordB);

      if (!sourceNode || !targetNode) return;

      // レイヤー差を計算
      const sourceLayer = (sourceNode.data as any).layer || 0;
      const targetLayer = (targetNode.data as any).layer || 0;
      const layerDiff = Math.abs(sourceLayer - targetLayer);

      // レイヤー差が大きすぎる場合は接続しない
      if (layerDiff > 2) return;

      // スコアに応じた視覚化
      const strokeWidth = 1 + sim.overallScore * 2;
      const opacity = 0.2 + sim.overallScore * 0.5;

      edges.push({
        id: `polar-${record.id}-${sim.recordB}`,
        source: record.id,
        target: sim.recordB,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: layerDiff === 0 ? '#6366f1' : '#a855f7', // 同じレイヤーは青、違うレイヤーは紫
          strokeWidth,
          opacity,
        },
      });
    });
  });

  return edges;
}

/**
 * カテゴリ一覧を取得（レコード数順）
 */
export function getAvailableCategories(
  records: ConfirmedRecord[],
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): Array<{ category: string; count: number }> {
  const categoryCount = new Map<string, number>();

  records.forEach(record => {
    const category = extractOntologyBasedCategory(record, ontology);
    categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
  });

  return Array.from(categoryCount.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count); // レコード数の多い順
}
