/**
 * カテゴリ選択コンポーネント
 * Phase 5.6: ポーラーレイアウトの中心カテゴリを選択
 */

'use client';

import { CATEGORIES } from '@/lib/tree/treeConverter';

interface CategoryOption {
  category: string;
  count: number;
}

interface CategorySelectorProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategorySelector({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  /**
   * カテゴリアイコンを取得
   */
  const getCategoryIcon = (category: string): string => {
    return CATEGORIES[category as keyof typeof CATEGORIES]?.icon || '📚';
  };

  /**
   * カテゴリ色を取得
   */
  const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      'React/Next.js': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700',
      'TypeScript': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700',
      'JavaScript': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
      'Blockchain': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700',
      'CSS/Design': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-300 dark:border-purple-700',
      'Backend': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-300 dark:border-orange-700',
      'その他': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
    };
    return colorMap[category] || colorMap['その他'];
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        🎯 中心カテゴリを選択
      </label>
      <div className="flex flex-wrap gap-2">
        {categories.map(({ category, count }) => {
          const isSelected = category === selectedCategory;
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium
                border-2 transition-all duration-200
                ${getCategoryColor(category)}
                ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-900 scale-105'
                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{getCategoryIcon(category)}</span>
                <span>{category}</span>
                <span className="text-xs opacity-75">({count})</span>
              </div>
            </button>
          );
        })}
      </div>
      {selectedCategory && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          💡 選択カテゴリを中心に、基礎的な内容から専門的な内容へ放射状に配置します
        </p>
      )}
    </div>
  );
}
