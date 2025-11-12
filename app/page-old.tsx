'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PendingRecord, ConfirmedRecord } from '@/types';
import { getAllPendingRecords, getPendingRecordsCount } from '@/lib/detection/pendingRecords';
import { getConfirmedRecords } from '@/lib/storage/localStorage';
import { loadMockBrowsingSessions } from '@/lib/detection/autoDetect';

export default function Home() {
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [recentPending, setRecentPending] = useState<PendingRecord[]>([]);
  const [recentConfirmed, setRecentConfirmed] = useState<ConfirmedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);

    // 保留中レコードを取得
    const pending = getAllPendingRecords();
    const counts = getPendingRecordsCount();
    setPendingCount(counts.total);
    setRecentPending(pending.slice(0, 5));

    // 確定済みレコードを取得
    const confirmed = getConfirmedRecords();
    setConfirmedCount(confirmed.length);
    setRecentConfirmed(confirmed.slice(0, 5));

    setIsLoading(false);
  };

  const loadMockData = async () => {
    try {
      const sessions = await loadMockBrowsingSessions();
      alert(`${sessions.length}件のモックデータを読み込みました`);
      loadData();
    } catch (error) {
      console.error('Failed to load mock data:', error);
      alert('モックデータの読み込みに失敗しました');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">学習証明システム - SymProof Tree</h1>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">保留中レコード</h2>
            <p className="text-3xl font-bold">{pendingCount}件</p>
            <Link href="/pending" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
              詳細を見る →
            </Link>
          </div>

          <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">確定済みレコード</h2>
            <p className="text-3xl font-bold">{confirmedCount}件</p>
            <Link href="/verified" className="text-green-600 dark:text-green-400 hover:underline mt-2 inline-block">
              詳細を見る →
            </Link>
          </div>
        </div>

        {/* クイックアクション */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">クイックアクション</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/pending"
              className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition text-center"
            >
              学習記録を登録
            </Link>
            <Link
              href="/verify"
              className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition text-center"
            >
              記録を検証
            </Link>
            <Link
              href="/tree"
              className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition text-center"
            >
              学習ツリーを見る
            </Link>
          </div>
        </div>

        {/* 最近の保留中レコード */}
        {recentPending.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">最近の保留中レコード</h2>
            <div className="space-y-3">
              {recentPending.map(record => (
                <div
                  key={record.id}
                  className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg"
                >
                  <h3 className="font-semibold">{record.session.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {record.session.url}
                  </p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>学習時間: {formatDuration(record.session.duration)}</span>
                    <span>登録日: {formatDate(record.createdAt)}</span>
                    <span
                      className={`font-semibold ${
                        record.status === 'pending'
                          ? 'text-yellow-600'
                          : record.status === 'submitting'
                          ? 'text-blue-600'
                          : 'text-red-600'
                      }`}
                    >
                      {record.status === 'pending'
                        ? '保留中'
                        : record.status === 'submitting'
                        ? '送信中'
                        : '失敗'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/pending"
              className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block"
            >
              すべて見る →
            </Link>
          </div>
        )}

        {/* 最近の確定済みレコード */}
        {recentConfirmed.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">最近の確定済みレコード</h2>
            <div className="space-y-3">
              {recentConfirmed.map(record => (
                <div
                  key={record.id}
                  className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg"
                >
                  <h3 className="font-semibold">{record.session.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {record.session.url}
                  </p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>学習時間: {formatDuration(record.session.duration)}</span>
                    <span>確定日: {formatDate(record.timestamp)}</span>
                    <span className="text-green-600 font-semibold">✓ 検証済み</span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/verified"
              className="text-green-600 dark:text-green-400 hover:underline mt-4 inline-block"
            >
              すべて見る →
            </Link>
          </div>
        )}

        {/* 開発用：モックデータ読み込みボタン */}
        <div className="mt-12 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">開発者ツール</h3>
          <button
            onClick={loadMockData}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            モックデータを読み込む
          </button>
        </div>
      </main>
    </div>
  );
}
