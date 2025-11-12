/**
 * ドメイン語彙オントロジー
 * Phase 5.2: 用語の正規化と前提関係の定義
 */

/**
 * オントロジーデータ構造
 */
export interface VocabularyOntology {
  terms: {
    [canonical: string]: {
      aliases: string[];           // 別名・表記ゆれ
      category: string;             // 所属カテゴリ
      prerequisites?: string[];     // 前提用語（正規化後の用語名）
      abstractionLevel?: number;    // 抽象度（1～5）
      description?: string;         // 説明
    };
  };
  categories: {
    [name: string]: {
      parent?: string;
      description: string;
      color: string;
      icon: string;
    };
  };
}

/**
 * デフォルトオントロジー
 * 主要な学習トピックとその前提関係を定義
 */
export const DEFAULT_ONTOLOGY: VocabularyOntology = {
  terms: {
    // ===== JavaScript関連 =====
    'JavaScript': {
      aliases: ['javascript', 'js', 'JS', 'ジャバスクリプト', 'JavaScript基礎'],
      category: 'JavaScript',
      prerequisites: [],
      abstractionLevel: 1,
      description: 'プログラミング言語JavaScript',
    },
    'JavaScript ES6': {
      aliases: ['es6', 'es2015', 'ECMAScript 6', 'モダンJavaScript'],
      category: 'JavaScript',
      prerequisites: ['JavaScript'],
      abstractionLevel: 2,
      description: 'ES6以降のモダンJavaScript機能',
    },
    'JavaScript非同期': {
      aliases: ['async', 'await', 'promise', 'promises', '非同期処理'],
      category: 'JavaScript',
      prerequisites: ['JavaScript', 'JavaScript ES6'],
      abstractionLevel: 3,
      description: '非同期プログラミング',
    },

    // ===== TypeScript関連 =====
    'TypeScript': {
      aliases: ['typescript', 'ts', 'TS', 'タイプスクリプト', 'TypeScript基礎'],
      category: 'TypeScript',
      prerequisites: ['JavaScript'],
      abstractionLevel: 2,
      description: 'JavaScriptのスーパーセット',
    },
    'TypeScript型システム': {
      aliases: ['型推論', 'generics', 'ジェネリクス', '型定義', 'type inference'],
      category: 'TypeScript',
      prerequisites: ['TypeScript'],
      abstractionLevel: 3,
      description: 'TypeScriptの型システム',
    },
    'TypeScript高度な型': {
      aliases: ['conditional types', 'mapped types', 'utility types', '高度な型'],
      category: 'TypeScript',
      prerequisites: ['TypeScript型システム'],
      abstractionLevel: 4,
      description: '条件型・マップ型などの高度な型',
    },

    // ===== React関連 =====
    'HTML/CSS': {
      aliases: ['html', 'css', 'HTML', 'CSS', 'styling', 'マークアップ'],
      category: 'CSS/Design',
      prerequisites: [],
      abstractionLevel: 1,
      description: 'Web基礎技術',
    },
    'React': {
      aliases: ['react', 'React.js', 'ReactJS', 'リアクト', 'React基礎'],
      category: 'React/Next.js',
      prerequisites: ['JavaScript', 'HTML/CSS'],
      abstractionLevel: 2,
      description: 'UIライブラリReact',
    },
    'React Hooks': {
      aliases: [
        'hooks',
        'useState',
        'useEffect',
        'useContext',
        'フック',
        'Reactフック',
      ],
      category: 'React/Next.js',
      prerequisites: ['React'],
      abstractionLevel: 3,
      description: 'React Hooks API',
    },
    'React Context': {
      aliases: ['context api', 'useContext', 'コンテキスト'],
      category: 'React/Next.js',
      prerequisites: ['React', 'React Hooks'],
      abstractionLevel: 3,
      description: 'React Context API',
    },
    'React高度なパターン': {
      aliases: [
        'render props',
        'higher-order components',
        'HOC',
        'compound components',
      ],
      category: 'React/Next.js',
      prerequisites: ['React', 'React Hooks'],
      abstractionLevel: 4,
      description: 'React高度なデザインパターン',
    },

    // ===== Next.js関連 =====
    'Next.js': {
      aliases: ['nextjs', 'next', 'Next', 'Next.js基礎'],
      category: 'React/Next.js',
      prerequisites: ['React', 'React Hooks'],
      abstractionLevel: 3,
      description: 'Reactフレームワーク',
    },
    'Next.js App Router': {
      aliases: ['app router', 'app directory', 'アプリルーター'],
      category: 'React/Next.js',
      prerequisites: ['Next.js', 'React Hooks'],
      abstractionLevel: 3,
      description: 'Next.js 13+のApp Router',
    },
    'Next.js Server Components': {
      aliases: ['server components', 'RSC', 'サーバーコンポーネント'],
      category: 'React/Next.js',
      prerequisites: ['Next.js App Router'],
      abstractionLevel: 4,
      description: 'React Server Components',
    },

    // ===== Tailwind CSS関連 =====
    'Tailwind CSS': {
      aliases: ['tailwind', 'tailwindcss', 'テイルウィンド'],
      category: 'CSS/Design',
      prerequisites: ['HTML/CSS'],
      abstractionLevel: 2,
      description: 'ユーティリティファーストCSSフレームワーク',
    },

    // ===== Blockchain関連 =====
    'Web3基礎': {
      aliases: ['web3', 'blockchain basics', 'ブロックチェーン基礎'],
      category: 'Blockchain',
      prerequisites: [],
      abstractionLevel: 1,
      description: 'Web3とブロックチェーンの基礎',
    },
    'Symbol Blockchain': {
      aliases: [
        'symbol',
        'Symbol SDK',
        'symbolブロックチェーン',
        'NEM',
        'シンボル',
      ],
      category: 'Blockchain',
      prerequisites: ['JavaScript', 'Web3基礎'],
      abstractionLevel: 4,
      description: 'Symbol ブロックチェーンプラットフォーム',
    },
    'スマートコントラクト': {
      aliases: ['smart contract', 'solidity', 'contract', 'スマコン'],
      category: 'Blockchain',
      prerequisites: ['Web3基礎', 'JavaScript'],
      abstractionLevel: 3,
      description: 'スマートコントラクト開発',
    },

    // ===== Backend関連 =====
    'Node.js': {
      aliases: ['node', 'nodejs', 'ノード'],
      category: 'Backend',
      prerequisites: ['JavaScript'],
      abstractionLevel: 2,
      description: 'JavaScriptランタイム',
    },
    'Express': {
      aliases: ['express.js', 'expressjs'],
      category: 'Backend',
      prerequisites: ['Node.js'],
      abstractionLevel: 2,
      description: 'Node.js Webフレームワーク',
    },
    'REST API': {
      aliases: ['rest', 'restful', 'api design', 'API設計'],
      category: 'Backend',
      prerequisites: ['JavaScript'],
      abstractionLevel: 2,
      description: 'RESTful API設計',
    },
    'データベース': {
      aliases: ['database', 'db', 'sql', 'mongodb', 'DB'],
      category: 'Backend',
      prerequisites: [],
      abstractionLevel: 2,
      description: 'データベース技術',
    },

    // ===== その他の汎用技術 =====
    'Git': {
      aliases: ['git', 'github', 'version control', 'バージョン管理'],
      category: 'その他',
      prerequisites: [],
      abstractionLevel: 1,
      description: 'バージョン管理システム',
    },
    'アルゴリズム': {
      aliases: ['algorithm', 'data structures', 'データ構造', 'アルゴリズムとデータ構造'],
      category: 'その他',
      prerequisites: [],
      abstractionLevel: 2,
      description: 'アルゴリズムとデータ構造',
    },
  },

  categories: {
    'JavaScript': {
      description: 'JavaScript言語とその機能',
      color: 'yellow',
      icon: '📜',
    },
    'TypeScript': {
      description: 'TypeScript言語',
      color: 'indigo',
      icon: '📘',
    },
    'React/Next.js': {
      description: 'React及びNext.jsフレームワーク',
      color: 'blue',
      icon: '⚛️',
    },
    'CSS/Design': {
      description: 'CSSとデザイン技術',
      color: 'purple',
      icon: '🎨',
    },
    'Blockchain': {
      description: 'ブロックチェーン技術',
      color: 'green',
      icon: '⛓️',
    },
    'Backend': {
      description: 'バックエンド開発',
      color: 'orange',
      icon: '🔧',
    },
    'その他': {
      description: 'その他の技術',
      color: 'gray',
      icon: '📚',
    },
  },
};

/**
 * 用語を正規化（エイリアスから正規名を取得）
 */
export function normalizeTermAlias(
  alias: string,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): string | null {
  const lowerAlias = alias.toLowerCase().trim();

  for (const [canonical, term] of Object.entries(ontology.terms)) {
    // 正規名自体をチェック
    if (canonical.toLowerCase() === lowerAlias) {
      return canonical;
    }

    // エイリアスをチェック
    if (term.aliases.some((a) => a.toLowerCase() === lowerAlias)) {
      return canonical;
    }
  }

  return null;
}

/**
 * テキストから用語を抽出し、正規化
 */
export function extractAndNormalizeTerms(
  text: string,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): string[] {
  const lowerText = text.toLowerCase();
  const found = new Set<string>();

  // 各用語とそのエイリアスを検索
  Object.entries(ontology.terms).forEach(([canonical, term]) => {
    // 正規名をチェック
    if (lowerText.includes(canonical.toLowerCase())) {
      found.add(canonical);
    }

    // エイリアスをチェック
    term.aliases.forEach((alias) => {
      if (lowerText.includes(alias.toLowerCase())) {
        found.add(canonical);
      }
    });
  });

  return Array.from(found);
}

/**
 * 用語の前提関係を取得
 */
export function getPrerequisites(
  term: string,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): string[] {
  return ontology.terms[term]?.prerequisites || [];
}

/**
 * 用語の抽象度を取得
 */
export function getAbstractionLevel(
  term: string,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): number {
  return ontology.terms[term]?.abstractionLevel || 3; // デフォルト: 中級
}

/**
 * 用語のカテゴリを取得
 */
export function getTermCategory(
  term: string,
  ontology: VocabularyOntology = DEFAULT_ONTOLOGY
): string {
  return ontology.terms[term]?.category || 'その他';
}
