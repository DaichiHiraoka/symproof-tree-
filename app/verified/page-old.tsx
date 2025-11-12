'use client';

import { useEffect, useState } from 'react';
import { ConfirmedRecord } from '@/types';
import { getConfirmedRecords } from '@/lib/storage/localStorage';
import RecordList from '@/components/RecordList';
import { getValidatedConfig } from '@/lib/symbol/config';

export default function VerifiedPage() {
  const [records, setRecords] = useState<ConfirmedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    console.log('🔍 [DEBUG] loadData 開始');
    const confirmedRecords = getConfirmedRecords();
    console.log('🔍 [DEBUG] confirmedRecords:', confirmedRecords);

    setRecords(confirmedRecords);

    // 統計情報を計算
    const total = confirmedRecords.length;
    const verified = confirmedRecords.filter(r => r.verified).length;
    const unverified = total - verified;

    setStats({ total, verified, unverified });
    setIsLoading(false);
  };

  const getExplorerUrl = (txHash: string) => {
    const config = getValidatedConfig();
    const network = config.networkType === 152 ? 'testnet' : 'mainnet';
    return `https://${network}.symbol.fyi/transactions/${txHash}`;
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">確定済みレコード</h1>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">合計</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">検証済み</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.verified}</p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">未検証</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.unverified}</p>
          </div>
        </div>

        {/* レコード一覧 */}
        <RecordList
          records={records}
          type="confirmed"
          showActions={true}
          renderAction={(record) => {
            const confirmedRecord = record as ConfirmedRecord;
            return (
              <div className="space-y-2">
                {/* トランザクションハッシュ */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    トランザクションハッシュ
                  </p>
                  <p className="font-mono text-xs break-all text-gray-900 dark:text-gray-100">
                    {confirmedRecord.transactionHash}
                  </p>
                </div>

                {/* ブロック高 */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    ブロック高
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {confirmedRecord.blockHeight.toLocaleString()}
                  </p>
                </div>

                {/* 検証ステータス */}
                <div className={`rounded p-2 ${
                  confirmedRecord.verified
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-500'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={confirmedRecord.verified ? 'text-green-600' : 'text-yellow-600'}>
                      {confirmedRecord.verified ? '✓' : '○'}
                    </span>
                    <span className="text-sm font-medium">
                      {confirmedRecord.verified ? '検証済み' : '未検証'}
                    </span>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex gap-2">
                  <a
                    href={`/verify?hash=${confirmedRecord.transactionHash}`}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition text-center"
                  >
                    検証ページで確認
                  </a>
                  <a
                    href={getExplorerUrl(confirmedRecord.transactionHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition flex items-center gap-1"
                  >
                    <span>Explorer</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          }}
          emptyMessage="確定済みレコードがありません。保留中レコードをブロックチェーンに登録してください。"
        />

        {/* ヘルプセクション */}
        {records.length === 0 && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-300">
              💡 確定済みレコードについて
            </h3>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <p>確定済みレコードは、Symbolブロックチェーンに記録された学習記録です。</p>
              <p className="font-semibold mt-4">確定済みレコードを作成するには:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>「保留中」ページに移動</li>
                <li>レコードの「ブロックチェーンに登録」ボタンをクリック</li>
                <li>SSS Extensionで署名</li>
                <li>トランザクションが承認されると、こちらのページに表示されます</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
