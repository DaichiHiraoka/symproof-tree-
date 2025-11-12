import type { ConfirmedRecord } from '@/types';
import { TFIDFSimilarity } from './tfidf';
import { calculateRuleSimilarity } from './rules';
import type { Edge } from 'reactflow';

export interface SimilaritySignals {
  rule: number;
  statistical: number;
  semantic?: number;
}

export interface SimilarityWeights {
  rule: number;
  statistical: number;
  semantic: number;
}

export const DEFAULT_WEIGHTS: SimilarityWeights = {
  rule: 0.3,
  statistical: 0.7,
  semantic: 0.0,
};

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

  const totalWeight = weights.rule + weights.statistical + (weights.semantic || 0);
  const score =
    (signals.rule * weights.rule + signals.statistical * weights.statistical) /
    (totalWeight || 1);

  return { score, signals };
}

export function buildSimilarityMatrix(
  records: ConfirmedRecord[]
): Map<string, Array<{ recordId: string; score: number; signals: SimilaritySignals }>> {
  const tfidf = new TFIDFSimilarity(records);
  const matrix = new Map<string, Array<{ recordId: string; score: number; signals: SimilaritySignals }>>();

  records.forEach((r1, i) => {
    const sims: Array<{ recordId: string; score: number; signals: SimilaritySignals }> = [];
    records.forEach((r2, j) => {
      if (i === j) return;
      const { score, signals } = calculateMultiSignalSimilarity(r1, r2, tfidf);
      sims.push({ recordId: r2.id, score, signals });
    });
    sims.sort((a, b) => b.score - a.score);
    matrix.set(r1.id, sims);
  });

  return matrix;
}

export function generateSimilarityEdges(
  records: ConfirmedRecord[],
  topK: number = 2,
  minScore: number = 0.35
): Edge[] {
  const matrix = buildSimilarityMatrix(records);
  const edges: Edge[] = [];

  records.forEach((r) => {
    const sims = (matrix.get(r.id) || []).filter((s) => s.score >= minScore).slice(0, topK);
    sims.forEach((s, idx) => {
      edges.push({
        id: `sim-${r.id}->${s.recordId}-${idx}`,
        source: r.id,
        target: s.recordId,
        animated: false,
        style: { stroke: '#94a3b8', strokeDasharray: '4 2' },
        label: s.score.toFixed(2),
      });
    });
  });

  return edges;
}

