'use client';

import { useState } from 'react';
import { verifyTransaction, VerificationResult } from '@/lib/symbol/verify';
import { getValidatedConfig } from '@/lib/symbol/config';

export default function VerifyPage() {
  const [txHash, setTxHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!txHash || txHash.trim().length === 0) {
      alert('トランザクションハッシュを入力してください');
      return;
    }

    console.log('🔍 [DEBUG] handleVerify 開始');
    console.log('🔍 [DEBUG] txHash:', txHash.trim());

    setVerifying(true);
    setResult(null);

    try {
      const verificationResult = await verifyTransaction(txHash.trim());
      console.log('🔍 [DEBUG] verificationResult:', verificationResult);
      setResult(verificationResult);
    } catch (error) {
      console.error('🔍 [DEBUG] 検証エラー:', error);
      alert('検証中にエラーが発生しました');
    } finally {
      setVerifying(false);
    }
  };

  const handleClear = () => {
    setTxHash('');
    setResult(null);
  };

  const getExplorerUrl = (hash: string) => {
    const config = getValidatedConfig();
    const network = config.networkType === 152 ? 'testnet' : 'mainnet';
    return `https://${network}.symbol.fyi/transactions/${hash}`;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">学習記録の検証</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          トランザクションハッシュを入力して、ブロックチェーン上の学習記録を検証します
        </p>

        {/* 入力フォーム */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium mb-2">
            トランザクションハッシュ
          </label>
          <input
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="例: 3532BA1180E2D12ABD2130488B6CA7EB165D38430202BAF0EC8449A4FF34588D"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     font-mono text-sm"
            disabled={verifying}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            64文字の16進数文字列（0-9, A-F）
          </p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleVerify}
              disabled={verifying || !txHash.trim()}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition ${
                verifying || !txHash.trim()
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {verifying ? '検証中...' : '検証する'}
            </button>
            <button
              onClick={handleClear}
              disabled={verifying}
              className="px-6 py-3 rounded-lg font-medium transition
                       bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                       hover:bg-gray-300 dark:hover:bg-gray-600
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              クリア
            </button>
          </div>
        </div>

        {/* 検証結果 */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">検証結果</h2>

            {/* ステータス表示 */}
            {result.success && result.valid ? (
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-green-600 dark:text-green-400 text-4xl">✓</div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                      検証成功
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      このトランザクションはブロックチェーン上で確認されました
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-red-600 dark:text-red-400 text-4xl">✗</div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                      検証失敗
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {result.error?.message || 'トランザクションの検証に失敗しました'}
                    </p>
                    {result.error?.details && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        詳細: {result.error.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 詳細情報 */}
            {result.success && result.valid && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* トランザクションハッシュ */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      トランザクションハッシュ
                    </p>
                    <p className="font-mono text-sm break-all text-gray-900 dark:text-gray-100">
                      {result.txHash}
                    </p>
                  </div>

                  {/* ブロック高 */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      ブロック高
                    </p>
                    <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      {result.blockHeight?.toLocaleString()}
                    </p>
                  </div>

                  {/* 署名者アドレス */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      署名者アドレス
                    </p>
                    <p className="font-mono text-sm break-all text-gray-900 dark:text-gray-100">
                      {result.signerAddress}
                    </p>
                  </div>

                  {/* タイムスタンプ */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      タイムスタンプ
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {result.timestamp?.toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* メッセージ内容 */}
                {result.message && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      メッセージ内容
                    </p>
                    <pre className="text-xs font-mono overflow-x-auto bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
                      {JSON.stringify(result.message, null, 2)}
                    </pre>
                  </div>
                )}

                {/* 検証詳細 */}
                {result.details && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      検証詳細
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={result.details.transactionFound ? 'text-green-600' : 'text-red-600'}>
                          {result.details.transactionFound ? '✓' : '✗'}
                        </span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          トランザクションが見つかりました
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={result.details.messageDecoded ? 'text-green-600' : 'text-red-600'}>
                          {result.details.messageDecoded ? '✓' : '✗'}
                        </span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          メッセージがデコードされました
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={result.details.blockConfirmed ? 'text-green-600' : 'text-red-600'}>
                          {result.details.blockConfirmed ? '✓' : '✗'}
                        </span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          ブロックで確認されました
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Symbol Explorerリンク */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={getExplorerUrl(result.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    <span>Symbol Explorerで確認</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 使い方ガイド */}
        {!result && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-300">
              💡 使い方
            </h3>
            <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li>1. 保留中レコードページでブロックチェーンに登録したトランザクションハッシュを取得</li>
              <li>2. 上記の入力欄にトランザクションハッシュを貼り付け</li>
              <li>3. 「検証する」ボタンをクリック</li>
              <li>4. 検証結果とトランザクション詳細が表示されます</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
