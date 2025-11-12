import { DEFAULT_ONTOLOGY } from '@/lib/tree/ontology';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * ルールベース抽象度推定 (1=基礎, 5=専門)
 * 入力: タイトル/URLのテキストから推定。オントロジーの定義を優先。
 */
export function estimateAbstractionLevel(title: string = '', url: string = ''): number {
  const text = `${title} ${url}`.toLowerCase();

  // 1) オントロジーに抽象度が定義されていれば最優先
  let ontologyLevels: number[] = [];
  for (const [canonical, def] of Object.entries(DEFAULT_ONTOLOGY.terms)) {
    const aliases = def.aliases.map((a) => a.toLowerCase());
    if (aliases.some((a) => text.includes(a)) || text.includes(canonical.toLowerCase())) {
      if (typeof def.abstractionLevel === 'number') ontologyLevels.push(def.abstractionLevel);
    }
  }
  if (ontologyLevels.length > 0) {
    // より中心に近い（基礎）方を優先
    return clamp(Math.min(...ontologyLevels), 1, 5);
  }

  // 2) キーワード/パスルール
  const lowKeywords = [
    'getting-started', 'get-started', 'tutorial', 'intro', 'introduction', 'basics', 'beginner',
    '入門', '基礎', '初級', 'はじめて', 'overview', 'guide'
  ];
  const highKeywords = [
    'advanced', 'deep dive', 'internals', 'optimization', 'performance', 'reference', 'api', 'specification',
    '上級', '応用', '設計', '最適化'
  ];

  const hasLow = lowKeywords.some((k) => text.includes(k));
  const hasHigh = highKeywords.some((k) => text.includes(k));

  // パスヒント
  const isLearn = /\/learn\//.test(url) || /learn/.test(url);
  const isReference = /\/reference\//.test(url) || /reference/.test(url) || /\/api\//.test(url);

  let level = 3; // デフォルト中級
  if (hasLow || isLearn) level = 2;
  if (hasHigh || isReference) level = 4;
  if ((hasLow && hasHigh) || (isLearn && isReference)) level = 3; // 相殺

  return clamp(level, 1, 5);
}

