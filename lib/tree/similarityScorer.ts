/**
 * 類似度スコアリングエンジン
 * Phase 5.4: マルチシグナル類似度スコアリング
 * Phase 5.5: セマンティック類似度統合
 *
 * Signal 1: ルールベース類似度（オントロジー前提関係）
 * Signal 2: 統計ベース類似度（TF-IDF）
 * Signal 3: セマンティック類似度（Embedding）
 */

import { ConfirmedRecord } from '@/types';
import {
  extractAndNormalizeTerms,
  getPrerequisites,
  VocabularyOntology,
  DEFAULT_ONTOLOGY,
} from './ontology';
import { AbstractionLevel } from './abstractionEstimator';
import { getEmbedding, cosineSimilarity as embeddingCosineSimilarity } from '@/lib/ai/geminiClient';

/**
 * 類似度スコア結果
 */
export interface SimilarityScore {
  recordA: string; // レコードID
  recordB: string; // レコードID
  overallScore: number; // 総合スコア (0.0 ~ 1.0)
  ruleBasedScore: number; // ルールベーススコア
  statisticalScore: number; // 統計ベーススコア
  semanticScore?: number; // セマンティックスコア（Phase 5.5）
  breakdown: {
    sharedTerms: string[]; // 共通用語
    prerequisiteRelation: boolean; // 前提関係あり
    categoryMatch: boolean; // カテゴリ一致
    abstractionDiff: number; // 抽象度差
  };
}

/**
 * Signal 1: ルールベース類似度
 * オントロジーの用語・前提関係・カテゴリから計算
 */
export function calculateRuleBasedSimilarity(
  recordA: ConfirmedRecord,
  recordB: ConfirmedRecord,
  abstractionA: AbstractionLevel,
  abstractionB: AbstractionLevel,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): {
  score: number;
  sharedTerms: string[];
  prerequisiteRelation: boolean;
  categoryMatch: boolean;
  abstractionDiff: number;
} {
  const textA = `${recordA.session.url} ${recordA.session.title}`;
  const textB = `${recordB.session.url} ${recordB.session.title}`;

  const termsA = extractAndNormalizeTerms(textA, ontology);
  const termsB = extractAndNormalizeTerms(textB, ontology);

  // 共通用語を検出
  const sharedTerms = termsA.filter(term => termsB.includes(term));

  // 前提関係をチェック（A→BまたはB→Aの前提関係）
  let prerequisiteRelation = false;
  for (const termA of termsA) {
    const prereqsA = getPrerequisites(termA, ontology);
    if (prereqsA.some(prereq => termsB.includes(prereq))) {
      prerequisiteRelation = true;
      break;
    }
  }
  if (!prerequisiteRelation) {
    for (const termB of termsB) {
      const prereqsB = getPrerequisites(termB, ontology);
      if (prereqsB.some(prereq => termsA.includes(prereq))) {
        prerequisiteRelation = true;
        break;
      }
    }
  }

  // カテゴリ一致（簡易版: URLドメイン比較）
  const categoryMatch = extractDomain(recordA.session.url) === extractDomain(recordB.session.url);

  // 抽象度の差（0～4）
  const abstractionDiff = Math.abs(abstractionA - abstractionB);

  // スコア計算
  let score = 0.0;

  // 1. 共通用語（最大0.4点）
  if (sharedTerms.length > 0) {
    score += Math.min(0.4, sharedTerms.length * 0.15);
  }

  // 2. 前提関係（0.3点）
  if (prerequisiteRelation) {
    score += 0.3;
  }

  // 3. カテゴリ一致（0.2点）
  if (categoryMatch) {
    score += 0.2;
  }

  // 4. 抽象度の近さ（最大0.1点）
  // 差が0なら0.1点、差が1なら0.075点、差が2なら0.05点...
  score += Math.max(0, 0.1 - abstractionDiff * 0.025);

  return {
    score: Math.min(1.0, score),
    sharedTerms,
    prerequisiteRelation,
    categoryMatch,
    abstractionDiff,
  };
}

/**
 * Signal 2: 統計ベース類似度（TF-IDF + コサイン類似度）
 * テキスト全体の単語頻度から計算
 */
export function calculateStatisticalSimilarity(
  recordA: ConfirmedRecord,
  recordB: ConfirmedRecord,
  allRecords: ConfirmedRecord[]
): number {
  const textA = tokenize(`${recordA.session.url} ${recordA.session.title}`);
  const textB = tokenize(`${recordB.session.url} ${recordB.session.title}`);

  // 全レコードから単語の出現回数を計算（IDF計算用）
  const documentFrequency = new Map<string, number>();
  allRecords.forEach(record => {
    const tokens = new Set(
      tokenize(`${record.session.url} ${record.session.title}`)
    );
    tokens.forEach(token => {
      documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
    });
  });

  // TF-IDFベクトルを計算
  const vectorA = calculateTFIDF(textA, allRecords.length, documentFrequency);
  const vectorB = calculateTFIDF(textB, allRecords.length, documentFrequency);

  // コサイン類似度
  return cosineSimilarity(vectorA, vectorB);
}

/**
 * Signal 3: セマンティック類似度（Embedding）
 * Phase 5.5: Gemini Embedding APIを使用
 *
 * @param recordA - レコードA
 * @param recordB - レコードB
 * @param embeddingCache - 埋め込みキャッシュ（オプション）
 * @returns セマンティック類似度 (0.0 ~ 1.0) またはnull（API未使用時）
 */
export async function calculateSemanticSimilarity(
  recordA: ConfirmedRecord,
  recordB: ConfirmedRecord,
  embeddingCache?: Map<string, number[]>
): Promise<number | null> {
  const textA = `${recordA.session.title} ${recordA.session.url}`;
  const textB = `${recordB.session.title} ${recordB.session.url}`;

  // キャッシュから取得を試みる
  let embeddingA = embeddingCache?.get(recordA.id);
  let embeddingB = embeddingCache?.get(recordB.id);

  // キャッシュにない場合はAPIから取得
  if (!embeddingA) {
    const result = await getEmbedding(textA);
    embeddingA = result || undefined;
    if (embeddingA && embeddingCache) {
      embeddingCache.set(recordA.id, embeddingA);
    }
  }

  if (!embeddingB) {
    const result = await getEmbedding(textB);
    embeddingB = result || undefined;
    if (embeddingB && embeddingCache) {
      embeddingCache.set(recordB.id, embeddingB);
    }
  }

  // どちらかが取得できなかった場合
  if (!embeddingA || !embeddingB) {
    return null;
  }

  // コサイン類似度を計算
  return embeddingCosineSimilarity(embeddingA, embeddingB);
}

/**
 * テキストをトークン化（簡易版）
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\sぁ-んァ-ヶー一-龠]/g, ' ') // 記号を除去
    .split(/\s+/)
    .filter(token => token.length >= 2); // 2文字以上
}

/**
 * TF-IDFベクトルを計算
 */
function calculateTFIDF(
  tokens: string[],
  totalDocuments: number,
  documentFrequency: Map<string, number>
): Map<string, number> {
  const vector = new Map<string, number>();
  const termFrequency = new Map<string, number>();

  // TF計算
  tokens.forEach(token => {
    termFrequency.set(token, (termFrequency.get(token) || 0) + 1);
  });

  // TF-IDF計算
  termFrequency.forEach((tf, term) => {
    const df = documentFrequency.get(term) || 1;
    const idf = Math.log(totalDocuments / df);
    vector.set(term, tf * idf);
  });

  return vector;
}

/**
 * コサイン類似度計算
 */
function cosineSimilarity(
  vectorA: Map<string, number>,
  vectorB: Map<string, number>
): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  // 全ての次元を収集
  const allDimensions = new Set([
    ...Array.from(vectorA.keys()),
    ...Array.from(vectorB.keys())
  ]);

  allDimensions.forEach(dim => {
    const a = vectorA.get(dim) || 0;
    const b = vectorB.get(dim) || 0;

    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  });

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * URLからドメインを抽出
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * マルチシグナル統合（同期版）
 * Phase 5.4: ルールベース + 統計ベース
 * Phase 5.5: セマンティックスコアはオプション（非同期版を使用）
 *
 * 重み付け（セマンティックなし）:
 * - ルールベース: 0.57 (0.4/0.7)
 * - 統計ベース: 0.43 (0.3/0.7)
 */
export function calculateMultiSignalSimilarity(
  recordA: ConfirmedRecord,
  recordB: ConfirmedRecord,
  abstractionA: AbstractionLevel,
  abstractionB: AbstractionLevel,
  allRecords: ConfirmedRecord[],
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): SimilarityScore {
  // Signal 1: ルールベース
  const ruleBased = calculateRuleBasedSimilarity(
    recordA,
    recordB,
    abstractionA,
    abstractionB,
    ontology
  );

  // Signal 2: 統計ベース
  const statistical = calculateStatisticalSimilarity(recordA, recordB, allRecords);

  // 総合スコア（セマンティックなしの場合、2シグナルで正規化）
  const overallScore = ruleBased.score * 0.57 + statistical * 0.43;

  return {
    recordA: recordA.id,
    recordB: recordB.id,
    overallScore,
    ruleBasedScore: ruleBased.score,
    statisticalScore: statistical,
    breakdown: {
      sharedTerms: ruleBased.sharedTerms,
      prerequisiteRelation: ruleBased.prerequisiteRelation,
      categoryMatch: ruleBased.categoryMatch,
      abstractionDiff: ruleBased.abstractionDiff,
    },
  };
}

/**
 * マルチシグナル統合（非同期版・セマンティック含む）
 * Phase 5.5: セマンティック類似度を統合
 *
 * 重み付け:
 * - ルールベース: 0.2（オントロジー前提関係）
 * - 統計ベース: 0.3（TF-IDF）
 * - セマンティック: 0.5（Embedding - 最も重要）
 */
export async function calculateMultiSignalSimilarityWithSemantic(
  recordA: ConfirmedRecord,
  recordB: ConfirmedRecord,
  abstractionA: AbstractionLevel,
  abstractionB: AbstractionLevel,
  allRecords: ConfirmedRecord[],
  embeddingCache?: Map<string, number[]>,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): Promise<SimilarityScore> {
  // Signal 1: ルールベース
  const ruleBased = calculateRuleBasedSimilarity(
    recordA,
    recordB,
    abstractionA,
    abstractionB,
    ontology
  );

  // Signal 2: 統計ベース
  const statistical = calculateStatisticalSimilarity(recordA, recordB, allRecords);

  // Signal 3: セマンティック
  const semantic = await calculateSemanticSimilarity(recordA, recordB, embeddingCache);

  // 総合スコア
  let overallScore: number;
  if (semantic !== null) {
    // セマンティックあり
    overallScore = ruleBased.score * 0.2 + statistical * 0.3 + semantic * 0.5;
  } else {
    // セマンティックなし（フォールバック）
    overallScore = ruleBased.score * 0.57 + statistical * 0.43;
  }

  return {
    recordA: recordA.id,
    recordB: recordB.id,
    overallScore,
    ruleBasedScore: ruleBased.score,
    statisticalScore: statistical,
    semanticScore: semantic || undefined,
    breakdown: {
      sharedTerms: ruleBased.sharedTerms,
      prerequisiteRelation: ruleBased.prerequisiteRelation,
      categoryMatch: ruleBased.categoryMatch,
      abstractionDiff: ruleBased.abstractionDiff,
    },
  };
}

/**
 * レコード間の類似度行列を計算
 * 全ペアの類似度を計算し、閾値以上のペアのみ返す
 */
export function calculateSimilarityMatrix(
  records: ConfirmedRecord[],
  abstractionLevels: Map<string, AbstractionLevel>,
  threshold: number = 0.3,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): SimilarityScore[] {
  const scores: SimilarityScore[] = [];

  for (let i = 0; i < records.length; i++) {
    for (let j = i + 1; j < records.length; j++) {
      const recordA = records[i];
      const recordB = records[j];

      const abstractionA = abstractionLevels.get(recordA.id) || 3;
      const abstractionB = abstractionLevels.get(recordB.id) || 3;

      const similarity = calculateMultiSignalSimilarity(
        recordA,
        recordB,
        abstractionA,
        abstractionB,
        records,
        ontology
      );

      // 閾値以上のみ追加
      if (similarity.overallScore >= threshold) {
        scores.push(similarity);
      }
    }
  }

  // スコアの高い順にソート
  return scores.sort((a, b) => b.overallScore - a.overallScore);
}

/**
 * 特定レコードに最も類似するレコードを取得
 */
export function findMostSimilarRecords(
  targetRecord: ConfirmedRecord,
  targetAbstraction: AbstractionLevel,
  allRecords: ConfirmedRecord[],
  abstractionLevels: Map<string, AbstractionLevel>,
  topK: number = 5,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): SimilarityScore[] {
  const scores: SimilarityScore[] = [];

  allRecords.forEach(record => {
    if (record.id === targetRecord.id) return; // 自分自身は除外

    const abstraction = abstractionLevels.get(record.id) || 3;

    const similarity = calculateMultiSignalSimilarity(
      targetRecord,
      record,
      targetAbstraction,
      abstraction,
      allRecords,
      ontology
    );

    scores.push(similarity);
  });

  // スコアの高い順にソートしてtopKを返す
  return scores.sort((a, b) => b.overallScore - a.overallScore).slice(0, topK);
}
