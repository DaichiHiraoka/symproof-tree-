/**
 * 抽象度推定エンジン
 * Phase 5.3: 2段階の抽象度推定
 *
 * Stage 1: ルールベース推定（オントロジー + ヒューリスティック）
 * Stage 2: LLMベース検証（オプション）
 */

import { ConfirmedRecord } from '@/types';
import {
  extractAndNormalizeTerms,
  getAbstractionLevel,
  getPrerequisites,
  VocabularyOntology,
  DEFAULT_ONTOLOGY,
} from './ontology';

/**
 * 抽象度レベル定義
 * 1: 入門・基礎（例: HTML/CSS, Git, JavaScript基礎）
 * 2: 初級（例: TypeScript, React, Node.js）
 * 3: 中級（例: React Hooks, Next.js, 非同期処理）
 * 4: 上級（例: Server Components, 高度な型、Symbol SDK）
 * 5: 専門・応用（例: 独自アーキテクチャ、最適化手法）
 */
export type AbstractionLevel = 1 | 2 | 3 | 4 | 5;

export interface AbstractionEstimation {
  level: AbstractionLevel;
  confidence: number; // 0.0 ~ 1.0
  method: 'ontology' | 'heuristic' | 'llm' | 'combined';
  reasoning: string;
  detectedTerms: string[];
}

/**
 * Stage 1: ルールベースの抽象度推定
 * オントロジーとヒューリスティックを組み合わせ
 */
export function estimateAbstractionStage1(
  record: ConfirmedRecord,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): AbstractionEstimation {
  const text = `${record.session.url} ${record.session.title}`;
  const terms = extractAndNormalizeTerms(text, ontology);

  // オントロジーから用語が見つかった場合
  if (terms.length > 0) {
    return estimateFromOntology(terms, ontology);
  }

  // オントロジーに無い場合はヒューリスティック推定
  return estimateFromHeuristics(record);
}

/**
 * オントロジーベースの推定
 * 複数用語がある場合は、最も高い抽象度を採用（専門的な内容ほど高度）
 */
function estimateFromOntology(
  terms: string[],
  ontology: VocabularyOntology
): AbstractionEstimation {
  // 各用語の抽象度を取得
  const levels = terms.map(term => ({
    term,
    level: getAbstractionLevel(term, ontology),
    prerequisites: getPrerequisites(term, ontology),
  }));

  // 最大抽象度を採用
  const maxLevel = Math.max(...levels.map(l => l.level)) as AbstractionLevel;
  const maxLevelTerms = levels.filter(l => l.level === maxLevel);

  // 前提用語の深さをカウント（前提が多いほど高度）
  const prerequisiteDepth = Math.max(
    ...maxLevelTerms.map(t => t.prerequisites.length),
    0
  );

  // 信頼度計算: 用語数が多く、前提関係が明確なほど高い
  const confidence = Math.min(
    0.7 + terms.length * 0.05 + prerequisiteDepth * 0.05,
    1.0
  );

  return {
    level: maxLevel,
    confidence,
    method: 'ontology',
    reasoning: `オントロジーから検出: ${maxLevelTerms.map(t => t.term).join(', ')} (前提: ${prerequisiteDepth}階層)`,
    detectedTerms: terms,
  };
}

/**
 * ヒューリスティックベースの推定
 * URLやタイトルのキーワードパターンから判断
 */
function estimateFromHeuristics(record: ConfirmedRecord): AbstractionEstimation {
  const text = `${record.session.url} ${record.session.title}`.toLowerCase();

  // 入門・基礎キーワード (Level 1)
  const beginnerPatterns = [
    /beginner|初心者|入門|はじめて|getting started|tutorial|基礎/i,
    /html|css(?!-in-js)/i,
    /git\s+basics|version control 入門/i,
  ];

  // 初級キーワード (Level 2)
  const basicPatterns = [
    /basic|basics|fundamentals|概要|とは/i,
    /introduction to|overview/i,
  ];

  // 中級キーワード (Level 3)
  const intermediatePatterns = [
    /intermediate|practical|実践|応用/i,
    /how to|guide|チュートリアル/i,
    /best practices|パターン/i,
  ];

  // 上級キーワード (Level 4)
  const advancedPatterns = [
    /advanced|expert|深掘り|詳解/i,
    /deep dive|internals|under the hood/i,
    /optimization|performance|最適化/i,
    /architecture|設計/i,
  ];

  // 専門・応用キーワード (Level 5)
  const expertPatterns = [
    /research|論文|specification|仕様書/i,
    /custom implementation|独自実装/i,
    /cutting-edge|最先端/i,
  ];

  // パターンマッチング
  if (expertPatterns.some(p => p.test(text))) {
    return {
      level: 5,
      confidence: 0.6,
      method: 'heuristic',
      reasoning: 'タイトル/URLに専門的キーワードを検出',
      detectedTerms: [],
    };
  }

  if (advancedPatterns.some(p => p.test(text))) {
    return {
      level: 4,
      confidence: 0.6,
      method: 'heuristic',
      reasoning: 'タイトル/URLに上級キーワードを検出',
      detectedTerms: [],
    };
  }

  if (intermediatePatterns.some(p => p.test(text))) {
    return {
      level: 3,
      confidence: 0.5,
      method: 'heuristic',
      reasoning: 'タイトル/URLに中級キーワードを検出',
      detectedTerms: [],
    };
  }

  if (basicPatterns.some(p => p.test(text))) {
    return {
      level: 2,
      confidence: 0.5,
      method: 'heuristic',
      reasoning: 'タイトル/URLに初級キーワードを検出',
      detectedTerms: [],
    };
  }

  if (beginnerPatterns.some(p => p.test(text))) {
    return {
      level: 1,
      confidence: 0.6,
      method: 'heuristic',
      reasoning: 'タイトル/URLに入門キーワードを検出',
      detectedTerms: [],
    };
  }

  // デフォルト: 中級と推定
  return {
    level: 3,
    confidence: 0.3,
    method: 'heuristic',
    reasoning: 'キーワード未検出、デフォルト値',
    detectedTerms: [],
  };
}

/**
 * Stage 2: LLMベースの検証（オプション）
 * Gemini APIを使って抽象度を検証・補正
 * Phase 5.5: LLM分類統合
 */
export async function estimateAbstractionStage2(
  record: ConfirmedRecord,
  stage1Result: AbstractionEstimation
): Promise<AbstractionEstimation> {
  // LLM分類を試みる
  const { classifyWithLLM, isGeminiApiAvailable } = await import('@/lib/ai/geminiClient');

  if (!isGeminiApiAvailable()) {
    // APIキーが設定されていない場合はStage 1の結果をそのまま返す
    return stage1Result;
  }

  try {
    const llmResult = await classifyWithLLM(
      record.session.title,
      record.session.url
    );

    if (!llmResult) {
      // LLM分類が失敗した場合はStage 1の結果を返す
      return stage1Result;
    }

    // Stage 1とLLM結果を統合
    // 信頼度が高い方を採用、同程度ならLLMを優先
    if (llmResult.confidence > stage1Result.confidence + 0.1) {
      // LLMの方が明らかに信頼度が高い
      return {
        level: llmResult.abstractionLevel as AbstractionLevel,
        confidence: llmResult.confidence,
        method: 'llm',
        reasoning: llmResult.reasoning,
        detectedTerms: stage1Result.detectedTerms,
      };
    } else if (stage1Result.confidence > llmResult.confidence + 0.1) {
      // Stage 1の方が明らかに信頼度が高い
      return stage1Result;
    } else {
      // 信頼度が同程度なら平均を取る
      const avgLevel = Math.round(
        (stage1Result.level + llmResult.abstractionLevel) / 2
      ) as AbstractionLevel;
      const avgConfidence = (stage1Result.confidence + llmResult.confidence) / 2;

      return {
        level: avgLevel,
        confidence: avgConfidence,
        method: 'combined',
        reasoning: `Stage1: ${stage1Result.reasoning} | LLM: ${llmResult.reasoning}`,
        detectedTerms: stage1Result.detectedTerms,
      };
    }
  } catch (error) {
    console.error('LLM classification failed:', error);
    return stage1Result;
  }
}

/**
 * 抽象度レベルを人間可読な文字列に変換
 */
export function getAbstractionLevelLabel(level: AbstractionLevel): string {
  const labels: Record<AbstractionLevel, string> = {
    1: '入門・基礎',
    2: '初級',
    3: '中級',
    4: '上級',
    5: '専門・応用',
  };
  return labels[level];
}

/**
 * 抽象度レベルに応じた色を取得（UI表示用）
 */
export function getAbstractionLevelColor(level: AbstractionLevel): string {
  const colors: Record<AbstractionLevel, string> = {
    1: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    2: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    4: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    5: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[level];
}

/**
 * 信頼度に応じたアイコンを取得
 */
export function getConfidenceIcon(confidence: number): string {
  if (confidence >= 0.8) return '✓✓✓'; // 高信頼
  if (confidence >= 0.6) return '✓✓';  // 中信頼
  if (confidence >= 0.4) return '✓';   // 低信頼
  return '?';                          // 不明
}

/**
 * 複数レコードの抽象度を一括推定
 */
export function estimateAbstractionBatch(
  records: ConfirmedRecord[],
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): Map<string, AbstractionEstimation> {
  const results = new Map<string, AbstractionEstimation>();

  records.forEach(record => {
    const estimation = estimateAbstractionStage1(record, ontology);
    results.set(record.id, estimation);
  });

  return results;
}
