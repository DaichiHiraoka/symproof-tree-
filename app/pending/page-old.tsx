'use client';

import { useEffect, useState } from 'react';
import { PendingRecord } from '@/types';
import {
  getAllPendingRecords,
  getPendingRecordsCount,
  addToPending,
} from '@/lib/detection/pendingRecords';
import { loadMockBrowsingSessions } from '@/lib/detection/autoDetect';
import { submitLearningRecord, SubmitResult } from '@/lib/symbol/workflowSimple';
import { checkSSSAvailability, getSSSAccountInfo } from '@/lib/symbol/sssSimple';
import RecordList from '@/components/RecordList';

export default function PendingPage() {
  const [records, setRecords] = useState<PendingRecord[]>([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, submitting: 0, failed: 0 });
  const [sssAddress, setSSSAddress] = useState<string | null>(null);
  const [sssAvailable, setSSSAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ step: string; message: string } | null>(null);

  useEffect(() => {
    loadData();
    checkSSS();
  }, []);

  const loadData = () => {
    const allRecords = getAllPendingRecords();
    setRecords(allRecords);
    setCounts(getPendingRecordsCount());
    setIsLoading(false);
  };

  const checkSSS = () => {
    const availability = checkSSSAvailability();
    setSSSAvailable(availability.available);

    if (availability.available) {
      const accountInfo = getSSSAccountInfo();
      setSSSAddress(accountInfo?.address || null);
    }
  };

  const loadMockData = async () => {
    try {
      const sessions = await loadMockBrowsingSessions();
      const newRecords = sessions.map(session => addToPending(session)).filter(Boolean) as PendingRecord[];

      if (newRecords.length > 0) {
        alert(`${newRecords.length}件の保留中レコードを追加しました`);
        loadData();
      }
    } catch (error) {
      console.error('モックデータ読み込みエラー:', error);
      alert('モックデータの読み込みに失敗しました');
    }
  };

  const handleSubmit = async (record: PendingRecord) => {
    console.log('🔍 [DEBUG] handleSubmit 開始');
    console.log('🔍 [DEBUG] record:', record);
    console.log('🔍 [DEBUG] sssAvailable:', sssAvailable);

    if (!sssAvailable) {
      console.log('🔍 [DEBUG] SSS利用不可でアラート表示');
      alert('SSS Extensionがインストールされていないか、許可されていません');
      return;
    }

    console.log('🔍 [DEBUG] setSubmitting実行:', record.id);
    setSubmitting(record.id);
    console.log('🔍 [DEBUG] setProgress実行: init');
    setProgress({ step: 'init', message: '送信準備中...' });

    try {
      console.log('🔍 [DEBUG] submitLearningRecord実行前');
      const result = await submitLearningRecord(
        record.session,
        record.id,
        (step, message) => {
          console.log('🔍 [DEBUG] onProgress callback:', step, message);
          setProgress({ step, message });
        }
      );
      console.log('🔍 [DEBUG] submitLearningRecord実行後');
      console.log('🔍 [DEBUG] result:', result);

      if (result.success) {
        console.log('🔍 [DEBUG] 成功: アラート表示');
        alert(`トランザクション送信成功！\nHash: ${result.transactionHash}`);
        console.log('🔍 [DEBUG] loadData実行');
        loadData(); // リストを更新
      } else {
        console.log('🔍 [DEBUG] 失敗: アラート表示');
        alert(`送信失敗: ${result.error?.message || '不明なエラー'}`);
      }
    } catch (error) {
      console.error('🔍 [DEBUG] handleSubmit catch句に到達:', error);
      console.error('🔍 [DEBUG] error type:', typeof error);
      console.error('🔍 [DEBUG] error instanceof Error:', error instanceof Error);
      console.error('🔍 [DEBUG] error message:', error instanceof Error ? error.message : 'unknown');
      alert('送信中にエラーが発生しました');
    } finally {
      console.log('🔍 [DEBUG] finally句: 状態クリア');
      setSubmitting(null);
      setProgress(null);
      console.log('🔍 [DEBUG] handleSubmit 終了');
    }
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
        <h1 className="text-3xl font-bold mb-6">保留中レコード</h1>

        {/* SSS Extension ステータス */}
        <div className={`p-4 rounded-lg mb-6 ${sssAvailable ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
          <h2 className="font-semibold mb-2">SSS Extension ステータス</h2>
          {sssAvailable ? (
            <div>
              <p className="text-green-700 dark:text-green-300">✓ 接続済み</p>
              <p className="text-sm mt-1">アドレス: {sssAddress}</p>
            </div>
          ) : (
            <div>
              <p className="text-red-700 dark:text-red-300">✗ 未接続</p>
              <p className="text-sm mt-1">
                SSS Extensionをインストールし、接続を許可してください
              </p>
            </div>
          )}
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">合計</p>
            <p className="text-2xl font-bold">{counts.total}</p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">保留中</p>
            <p className="text-2xl font-bold">{counts.pending}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">送信中</p>
            <p className="text-2xl font-bold">{counts.submitting}</p>
          </div>
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">失敗</p>
            <p className="text-2xl font-bold">{counts.failed}</p>
          </div>
        </div>

        {/* 進捗表示 */}
        {progress && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">送信中...</h3>
            <p className="text-sm">
              ステップ: {progress.step}
            </p>
            <p className="text-sm mt-1">{progress.message}</p>
          </div>
        )}

        {/* レコード一覧 */}
        <RecordList
          records={records}
          type="pending"
          showActions={true}
          renderAction={(record) => {
            const pendingRecord = record as PendingRecord;
            const isSubmittingThis = submitting === pendingRecord.id;

            return (
              <button
                onClick={() => handleSubmit(pendingRecord)}
                disabled={!sssAvailable || isSubmittingThis || pendingRecord.status === 'submitting'}
                className={`px-4 py-2 rounded font-medium transition ${
                  !sssAvailable || isSubmittingThis || pendingRecord.status === 'submitting'
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSubmittingThis ? '送信中...' : 'ブロックチェーンに登録'}
              </button>
            );
          }}
          emptyMessage="保留中のレコードがありません。モックデータを読み込んでテストしてください。"
        />

        {/* 開発用ツール */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-3">開発者ツール</h3>
          <div className="flex gap-3">
            <button
              onClick={loadMockData}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              モックデータを読み込む
            </button>
            <button
              onClick={() => {
                loadData();
                checkSSS();
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              再読み込み
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
