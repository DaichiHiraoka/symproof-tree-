export interface VocabularyOntology {
  terms: {
    [canonical: string]: {
      aliases: string[];
      category: string;
      prerequisites?: string[];
      abstractionLevel?: number; // 1 (foundational) - 5 (specialized)
    };
  };
  categories: {
    [name: string]: {
      parent?: string;
      description: string;
      color: string; // tailwind color keyword
    };
  };
}

export const DEFAULT_ONTOLOGY: VocabularyOntology = {
  terms: {
    React: {
      aliases: ['react', 'reactjs', 'react.js', 'リアクト'],
      category: 'React/Next.js',
      prerequisites: ['JavaScript'],
      abstractionLevel: 2,
    },
    'React Hooks': {
      aliases: ['hooks', 'useState', 'useEffect', 'フック'],
      category: 'React/Next.js',
      prerequisites: ['React'],
      abstractionLevel: 3,
    },
    'Next.js': {
      aliases: ['next', 'nextjs'],
      category: 'React/Next.js',
      prerequisites: ['React', 'React Hooks'],
      abstractionLevel: 3,
    },
    TypeScript: {
      aliases: ['typescript', 'ts', 'タイプスクリプト'],
      category: 'TypeScript/JavaScript',
      prerequisites: ['JavaScript'],
      abstractionLevel: 2,
    },
    JavaScript: {
      aliases: ['javascript', 'js', 'ジャバスクリプト'],
      category: 'TypeScript/JavaScript',
      prerequisites: [],
      abstractionLevel: 1,
    },
    'Symbol Blockchain': {
      aliases: ['symbol', 'symbol sdk', 'symbol-blockchain', 'web3'],
      category: 'Blockchain',
      prerequisites: ['JavaScript'],
      abstractionLevel: 4,
    },
    'SSS Extension': {
      aliases: ['sss', 'sss extension', 'symbol signer'],
      category: 'Blockchain',
      prerequisites: ['Symbol Blockchain'],
      abstractionLevel: 3,
    },
    'App Router': {
      aliases: ['app router', 'next app router'],
      category: 'React/Next.js',
      prerequisites: ['Next.js'],
      abstractionLevel: 3,
    },
    'Tailwind CSS': {
      aliases: ['tailwind', 'tailwindcss'],
      category: 'CSS/Design',
      prerequisites: ['CSS'],
      abstractionLevel: 2,
    },
    CSS: {
      aliases: ['css'],
      category: 'CSS/Design',
      prerequisites: [],
      abstractionLevel: 1,
    },
    'React Flow': {
      aliases: ['reactflow', 'react flow'],
      category: 'React/Next.js',
      prerequisites: ['React'],
      abstractionLevel: 3,
    },
    Node: {
      aliases: ['node', 'node.js', 'nodejs'],
      category: 'Backend',
      prerequisites: ['JavaScript'],
      abstractionLevel: 2,
    },
    Express: {
      aliases: ['express', 'express.js', 'expressjs'],
      category: 'Backend',
      prerequisites: ['Node'],
      abstractionLevel: 3,
    },
    WebAssembly: {
      aliases: ['wasm', 'webassembly'],
      category: 'Backend',
      prerequisites: ['JavaScript'],
      abstractionLevel: 3,
    },
    'TypeScript Generics': {
      aliases: ['generics', 'ジェネリクス'],
      category: 'TypeScript/JavaScript',
      prerequisites: ['TypeScript'],
      abstractionLevel: 3,
    },
  },
  categories: {
    'React/Next.js': {
      description: 'ReactおよびNext.jsフレームワーク',
      color: 'blue',
    },
    'TypeScript/JavaScript': {
      description: 'TypeScript/JavaScript言語',
      color: 'indigo',
    },
    Blockchain: {
      description: 'ブロックチェーン技術（Symbolなど）',
      color: 'green',
    },
    'CSS/Design': {
      description: 'CSS/デザイン/スタイル',
      color: 'pink',
    },
    Backend: {
      description: 'Node.js/Express/サーバー基盤',
      color: 'teal',
    },
    その他: {
      description: 'その他のトピック',
      color: 'gray',
    },
  },
};

/**
 * カテゴリからTailwind色クラスを返す
 */
export function getCategoryColor(category: string): {
  bg: string;
  text: string;
  border: string;
} {
  const color =
    DEFAULT_ONTOLOGY.categories[category]?.color || DEFAULT_ONTOLOGY.categories['その他'].color;
  switch (color) {
    case 'blue':
      return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' };
    case 'indigo':
      return { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-300 dark:border-indigo-700' };
    case 'green':
      return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700' };
    case 'pink':
      return { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-300 dark:border-pink-700' };
    case 'teal':
      return { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-300 dark:border-teal-700' };
    default:
      return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-200', border: 'border-gray-300 dark:border-gray-600' };
  }
}
