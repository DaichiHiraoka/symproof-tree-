/**
 * Gemini API クライアント
 * Phase 5.5: Embedding & LLM機能
 */

/**
 * Gemini Embedding結果
 */
export interface EmbeddingResult {
  embedding: number[];
  text: string;
}

/**
 * LLM分類結果
 */
export interface ClassificationResult {
  category: string;
  abstractionLevel: number;
  confidence: number;
  reasoning: string;
}

/**
 * Gemini APIキーを取得
 */
function getGeminiApiKey(): string | null {
  // 環境変数から取得（Next.jsではNEXT_PUBLIC_プレフィックス）
  if (typeof window !== 'undefined') {
    // クライアントサイド: ビルド時に埋め込まれた環境変数
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
  } else {
    // サーバーサイド: 実行時の環境変数
    return process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
  }
}

/**
 * Gemini Embedding APIで埋め込みベクトルを取得
 *
 * @param text - 埋め込み対象のテキスト
 * @returns 埋め込みベクトル（768次元）
 */
export async function getEmbedding(text: string): Promise<number[] | null> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.warn('Gemini API key not found. Skipping embedding generation.');
    return null;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: {
            parts: [{ text }],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini Embedding API error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    return data.embedding?.values || null;
  } catch (error) {
    console.error('Failed to get embedding:', error);
    return null;
  }
}

/**
 * 複数テキストの埋め込みをバッチ取得
 *
 * @param texts - 埋め込み対象のテキスト配列
 * @returns 埋め込み結果配列
 */
export async function getEmbeddingBatch(
  texts: string[]
): Promise<EmbeddingResult[]> {
  const results: EmbeddingResult[] = [];

  // Gemini APIはバッチリクエストをサポートしていないため、順次実行
  // レート制限を考慮して100msの間隔を空ける
  for (const text of texts) {
    const embedding = await getEmbedding(text);
    if (embedding) {
      results.push({ embedding, text });
    }

    // レート制限回避のための待機
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * コサイン類似度を計算
 *
 * @param vectorA - ベクトルA
 * @param vectorB - ベクトルB
 * @returns コサイン類似度 (0.0 ~ 1.0)
 */
export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same dimension');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    normA += vectorA[i] * vectorA[i];
    normB += vectorB[i] * vectorB[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Gemini LLMでカテゴリと抽象度を分類
 *
 * @param title - 学習記録のタイトル
 * @param url - 学習記録のURL
 * @returns 分類結果
 */
export async function classifyWithLLM(
  title: string,
  url: string
): Promise<ClassificationResult | null> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.warn('Gemini API key not found. Skipping LLM classification.');
    return null;
  }

  const prompt = `以下の学習記録を分析し、カテゴリと抽象度レベルを判定してください。

タイトル: ${title}
URL: ${url}

カテゴリ候補:
- React/Next.js: React及びNext.jsフレームワーク関連
- TypeScript: TypeScript言語関連
- JavaScript: JavaScript言語関連
- Blockchain: ブロックチェーン技術関連
- CSS/Design: CSSとデザイン技術関連
- Backend: バックエンド開発関連
- その他: 上記以外

抽象度レベル:
1: 入門・基礎（例: HTML/CSS基礎、Git入門）
2: 初級（例: TypeScript基礎、React基礎）
3: 中級（例: React Hooks、Next.js実践）
4: 上級（例: Server Components、高度な型システム）
5: 専門・応用（例: パフォーマンス最適化、独自アーキテクチャ）

以下のJSON形式で回答してください：
{
  "category": "カテゴリ名",
  "abstractionLevel": 数値(1-5),
  "confidence": 数値(0.0-1.0),
  "reasoning": "判定理由（簡潔に）"
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.1, // 低温度で一貫性を重視
            maxOutputTokens: 200,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini LLM API error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('No text in LLM response');
      return null;
    }

    // JSONを抽出（マークダウンコードブロックを除去）
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in LLM response:', text);
      return null;
    }

    const result = JSON.parse(jsonMatch[0]);
    return {
      category: result.category || 'その他',
      abstractionLevel: Math.min(5, Math.max(1, result.abstractionLevel || 3)),
      confidence: Math.min(1.0, Math.max(0.0, result.confidence || 0.5)),
      reasoning: result.reasoning || '',
    };
  } catch (error) {
    console.error('Failed to classify with LLM:', error);
    return null;
  }
}

/**
 * APIキーが設定されているかチェック
 */
export function isGeminiApiAvailable(): boolean {
  return getGeminiApiKey() !== null;
}
