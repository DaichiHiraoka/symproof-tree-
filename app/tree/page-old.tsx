/**
 * 学習ツリーページ
 * Phase 5.1: 基本ツリー表示
 */

'use client';

import { useEffect, useState } from 'react';
import { ConfirmedRecord } from '@/types';
import { getConfirmedRecords } from '@/lib/storage/localStorage';
import LearningTreeView from '@/components/LearningTree/LearningTreeView';
import { generateBalancedMockRecords } from '@/lib/symbol/__mocks__/mockData';

export default function TreePage() {
  const [records, setRecords] = useState<ConfirmedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    loadData();
  }, [useMockData]);

  const loadData = () => {
    if (useMockData) {
      // モックデータを使用
      const mockRecords = generateBalancedMockRecords();
      setRecords(mockRecords);
    } else {
      // 実際のデータを使用
      const confirmedRecords = getConfirmedRecords();
      setRecords(confirmedRecords);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-lg">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">学習ツリー</h1>
              <p className="text-gray-600 dark:text-gray-400">
                ブロックチェーンに記録した学習の進捗を可視化します
              </p>
            </div>
            {/* モックデータトグル */}
            <button
              onClick={() => setUseMockData(!useMockData)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all
                ${
                  useMockData
                    ? 'bg-purple-500 text-white shadow-md hover:bg-purple-600'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              {useMockData ? '🧪 モックデータ使用中' : '📊 実データ使用中'}
            </button>
          </div>
        </div>

        {/* 統計情報カード */}
        {records.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">確定済みレコード</p>
              <p className="text-2xl font-bold">{records.length}件</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">総学習時間</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  records.reduce((sum, r) => sum + r.session.duration, 0) / 60000
                )}
                分
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">ブロックチェーン証明</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">100%</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">平均学習時間</p>
              <p className="text-2xl font-bold">
                {records.length > 0
                  ? Math.round(
                      records.reduce((sum, r) => sum + r.session.duration, 0) /
                        60000 /
                        records.length
                    )
                  : 0}
                分
              </p>
            </div>
          </div>
        )}

        {/* ツリー表示 */}
        <LearningTreeView records={records} />

        {/* ヘルプセクション */}
        {records.length === 0 && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-300">
              💡 学習ツリーについて
            </h3>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <p>
                学習ツリーは、ブロックチェーンに記録された学習記録を視覚的に表示する機能です。
              </p>
              <p className="font-semibold mt-4">表示方法:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>縦列</strong>: 学習分野（カテゴリ）ごとに列が分かれます
                </li>
                <li>
                  <strong>縦方向</strong>: 時系列順（古い順に上から下へ）
                </li>
                <li>
                  <strong>矢印</strong>: 同じカテゴリ内での学習の流れを示します
                </li>
              </ul>
              <p className="font-semibold mt-4">学習ツリーを作成するには:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>「保留中」ページに移動</li>
                <li>レコードの「ブロックチェーンに登録」ボタンをクリック</li>
                <li>SSS Extensionで署名</li>
                <li>
                  トランザクションが承認されると、こちらのページにツリーとして表示されます
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Phase 5.1完了の説明 */}
        {records.length > 0 && (
          <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-green-900 dark:text-green-300">
              ✅ Phase 5.1: 基本ツリー表示 完了
            </h3>
            <div className="space-y-2 text-sm text-green-800 dark:text-green-300">
              <p>現在の表示方法:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>カテゴリベース配置</strong>: URLとタイトルから自動的にカテゴリを判定
                </li>
                <li>
                  <strong>時系列順配置</strong>: 同じカテゴリ内で学習した順番に上から下へ配置
                </li>
                <li>
                  <strong>インタラクティブ操作</strong>: ズーム・パン・ミニマップで自由に閲覧
                </li>
              </ul>
              <p className="mt-3 text-xs">
                <strong>今後の改善予定:</strong> Phase 5.2以降で用語の正規化、抽象度推定、類似度スコアリング、埋め込みベクトルによる高精度配置を実装します。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
