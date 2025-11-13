/**
 * 学習ツリー用データ変換ロジック
 * Phase 5.1: 基本的なカテゴリ抽出とノード変換
 * Phase 5.2: オントロジーベースの用語正規化統合
 * Phase 5.3: 2段階の抽象度推定統合
 * Phase 5.4: マルチシグナル類似度スコアリング統合
 */

import { ConfirmedRecord } from '@/types';
import { Node, Edge } from 'reactflow';
import {
  extractAndNormalizeTerms,
  getTermCategory,
  DEFAULT_ONTOLOGY,
  VocabularyOntology,
} from './ontology';
import {
  estimateAbstractionStage1,
  AbstractionEstimation,
  getAbstractionLevelLabel,
  AbstractionLevel,
} from './abstractionEstimator';
import {
  calculateSimilarityMatrix,
  SimilarityScore,
} from './similarityScorer';

/**
 * カテゴリ定義
 */
export const CATEGORIES = {
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
  'JavaScript': {
    name: 'JavaScript',
    color: 'yellow',
    icon: '📜',
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
    color: 'orange',
    icon: '🔧',
  },
  'その他': {
    name: 'その他',
    color: 'gray',
    icon: '📚',
  },
} as const;

/**
 * URLとタイトルから簡易的にカテゴリを抽出
 * Phase 5.1の基本実装（後方互換性のため保持）
 */
export function extractSimpleCategory(url: string, title?: string): string {
  const text = `${url} ${title || ''}`.toLowerCase();

  // React/Next.js
  if (text.match(/react|next\.?js|リアクト/i)) {
    return 'React/Next.js';
  }

  // TypeScript
  if (text.match(/typescript|タイプスクリプト/i)) {
    return 'TypeScript';
  }

  // JavaScript
  if (text.match(/javascript|js(?!on)|ジャバスクリプト/i)) {
    return 'JavaScript';
  }

  // Blockchain
  if (text.match(/symbol|blockchain|web3|ブロックチェーン/i)) {
    return 'Blockchain';
  }

  // CSS/Design
  if (text.match(/css|tailwind|styling|design|デザイン/i)) {
    return 'CSS/Design';
  }

  // Backend
  if (text.match(/node|express|api|backend|server|バックエンド/i)) {
    return 'Backend';
  }

  return 'その他';
}

/**
 * オントロジーベースのカテゴリ抽出
 * Phase 5.2: 用語の正規化とエイリアス対応
 *
 * @param record - 確定済みレコード
 * @param ontology - オントロジー定義（デフォルトは DEFAULT_ONTOLOGY）
 * @returns カテゴリ名
 */
export function extractOntologyBasedCategory(
  record: ConfirmedRecord,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): string {
  const text = `${record.session.url} ${record.session.title}`;

  // テキストから用語を抽出・正規化
  const terms = extractAndNormalizeTerms(text, ontology);

  // 見つからない場合は簡易抽出にフォールバック
  if (terms.length === 0) {
    return extractSimpleCategory(record.session.url, record.session.title);
  }

  // 最初に見つかった用語のカテゴリを返す
  // TODO: Phase 5.3で複数用語の場合の優先順位決定を実装
  return getTermCategory(terms[0], ontology);
}

/**
 * レコードから用語を抽出
 * Phase 5.2追加: 正規化された用語リストを取得
 */
export function extractTermsFromRecord(
  record: ConfirmedRecord,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): string[] {
  const text = `${record.session.url} ${record.session.title}`;
  return extractAndNormalizeTerms(text, ontology);
}

/**
 * 学習時間を分単位で取得
 */
function getDurationInMinutes(record: ConfirmedRecord): number {
  return Math.round(record.session.duration / 60000);
}

/**
 * 理解度を計算（簡易版）
 * TODO: Phase 5.3で改善
 */
function calculateUnderstanding(record: ConfirmedRecord): number {
  // 学習時間ベースで簡易的に計算
  const minutes = getDurationInMinutes(record);

  if (minutes < 15) return 2;
  if (minutes < 30) return 3;
  if (minutes < 60) return 4;
  return 5;
}

/**
 * 確定済みレコードをReact Flowノードに変換
 * Phase 5.2: オントロジーベースのカテゴリ抽出を使用
 * Phase 5.3: 抽象度推定を追加
 */
export function convertRecordsToNodes(
  records: ConfirmedRecord[],
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): Node[] {
  return records.map((record, index) => {
    // Phase 5.3: 抽象度推定
    const abstractionEstimation = estimateAbstractionStage1(record, ontology);

    return {
      id: record.id,
      type: 'learningRecord',
      position: { x: index * 250, y: 0 }, // 仮配置（レイアウト計算で上書き）
      data: {
        title: record.session.title,
        url: record.session.url,
        category: extractOntologyBasedCategory(record, ontology),
        duration: getDurationInMinutes(record),
        understanding: calculateUnderstanding(record),
        date: record.session.startTime.toISOString().split('T')[0],
        transactionHash: record.transactionHash,
        blockHeight: record.blockHeight,
        verified: record.verified,
        terms: extractTermsFromRecord(record, ontology), // Phase 5.2: 正規化された用語リスト
        abstractionLevel: abstractionEstimation.level, // Phase 5.3: 抽象度レベル
        abstractionLabel: getAbstractionLevelLabel(abstractionEstimation.level), // Phase 5.3: 表示用ラベル
        abstractionConfidence: abstractionEstimation.confidence, // Phase 5.3: 信頼度
      },
    };
  });
}

/**
 * 時系列ベースのエッジ生成
 * 同じカテゴリ内で時系列順に接続
 * Phase 5.2: オントロジーベースのカテゴリグルーピング
 */
export function generateTimelineEdges(
  records: ConfirmedRecord[],
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): Edge[] {
  const edges: Edge[] = [];

  // カテゴリごとにグルーピング
  const categoryGroups: Record<string, ConfirmedRecord[]> = {};

  records.forEach(record => {
    const category = extractOntologyBasedCategory(record, ontology);

    if (!categoryGroups[category]) {
      categoryGroups[category] = [];
    }
    categoryGroups[category].push(record);
  });

  // 各カテゴリ内で時系列順にソート＆接続
  Object.values(categoryGroups).forEach(categoryRecords => {
    const sorted = [...categoryRecords].sort(
      (a, b) => a.session.startTime.getTime() - b.session.startTime.getTime()
    );

    for (let i = 0; i < sorted.length - 1; i++) {
      const source = sorted[i];
      const target = sorted[i + 1];

      // 日数差を計算
      const daysDiff = Math.round(
        (target.session.startTime.getTime() - source.session.startTime.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      edges.push({
        id: `edge-${source.id}-${target.id}`,
        source: source.id,
        target: target.id,
        type: 'smoothstep',
        animated: false,
        label: daysDiff > 0 ? `${daysDiff}日後` : undefined,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
        labelStyle: { fontSize: 10, fill: '#64748b' },
      });
    }
  });

  return edges;
}

/**
 * 類似度ベースのエッジ生成
 * Phase 5.4: マルチシグナル類似度に基づく関連性エッジ
 *
 * @param records - 確定済みレコード
 * @param abstractionLevels - 各レコードの抽象度レベル
 * @param threshold - 類似度閾値（デフォルト0.5）
 * @param ontology - オントロジー定義
 * @returns 類似度エッジ配列
 */
export function generateSimilarityEdges(
  records: ConfirmedRecord[],
  abstractionLevels: Map<string, AbstractionLevel>,
  threshold: number = 0.5,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): Edge[] {
  const edges: Edge[] = [];

  // 類似度行列を計算
  const similarities = calculateSimilarityMatrix(
    records,
    abstractionLevels,
    threshold,
    ontology
  );

  // 類似度スコアに基づいてエッジを生成
  similarities.forEach(similarity => {
    // スコアに応じた線の太さと色
    const strokeWidth = 1 + similarity.overallScore * 2; // 1～3
    const opacity = 0.3 + similarity.overallScore * 0.4; // 0.3～0.7

    // 前提関係がある場合は矢印付き、それ以外は破線
    const edgeType = similarity.breakdown.prerequisiteRelation
      ? 'smoothstep'
      : 'default';
    const strokeDasharray = similarity.breakdown.prerequisiteRelation
      ? undefined
      : '5,5';

    edges.push({
      id: `similarity-${similarity.recordA}-${similarity.recordB}`,
      source: similarity.recordA,
      target: similarity.recordB,
      type: edgeType,
      animated: false,
      label: similarity.breakdown.sharedTerms.length > 0
        ? `${similarity.breakdown.sharedTerms.slice(0, 2).join(', ')}`
        : undefined,
      style: {
        stroke: similarity.breakdown.prerequisiteRelation ? '#6366f1' : '#a855f7',
        strokeWidth,
        opacity,
        strokeDasharray,
      },
      labelStyle: { fontSize: 9, fill: '#6b7280', fontWeight: 'bold' },
      labelBgStyle: { fill: '#ffffff', fillOpacity: 0.7 },
    });
  });

  return edges;
}

/**
 * カテゴリ別に統計情報を取得
 * Phase 5.2: オントロジーベースのカテゴリ分類
 */
export function getCategoryStats(
  records: ConfirmedRecord[],
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): Array<{
  category: string;
  count: number;
  totalDuration: number;
  color: string;
}> {
  const stats: Record<string, { count: number; totalDuration: number }> = {};

  records.forEach(record => {
    const category = extractOntologyBasedCategory(record, ontology);

    if (!stats[category]) {
      stats[category] = { count: 0, totalDuration: 0 };
    }

    stats[category].count++;
    stats[category].totalDuration += getDurationInMinutes(record);
  });

  return Object.entries(stats).map(([category, data]) => ({
    category,
    count: data.count,
    totalDuration: data.totalDuration,
    color: CATEGORIES[category as keyof typeof CATEGORIES]?.color || 'gray',
  }));
}
