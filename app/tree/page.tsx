"use client";

import { useEffect, useState } from 'react';
import type { ConfirmedRecord } from '@/types';
import { getConfirmedRecords } from '@/lib/storage/localStorage';
import LearningTreeView from '@/components/LearningTree/LearningTreeView';

export default function TreePage() {
  const [records, setRecords] = useState<ConfirmedRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getConfirmedRecords();
    setRecords(data);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-lg">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">学習ツリー</h1>

        {records.length === 0 ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <p className="text-lg">確定済みレコードがありません</p>
            <p className="mt-2 text-sm text-blue-900 dark:text-blue-300">
              まず「保留中」からレコードをブロックチェーンに登録し、その後ここで可視化できます。
            </p>
          </div>
        ) : (
          <LearningTreeView records={records} />
        )}
      </div>
    </div>
  );
}
