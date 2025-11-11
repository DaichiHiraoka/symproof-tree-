/**
 * テスト用モックワークフロー
 *
 * SSS Extensionがインストールされていない環境でも
 * 送信フローをテストできるようにするためのモック実装
 *
 * 使用方法:
 * 環境変数 NEXT_PUBLIC_USE_MOCK_SSS=true を設定すると
 * 実際のSSS Extension呼び出しの代わりにこのモックが使用されます
 */

import { BrowsingSession, ConfirmedRecord } from '@/types';
import { SubmitResult } from '../workflow';
import { v4 as uuidv4 } from 'uuid';

/**
 * モック署名トランザクション
 */
function createMockSignedTransaction() {
  return {
    payload: 'MOCK_PAYLOAD_' + uuidv4(),
    hash: 'MOCK_HASH_' + uuidv4().replace(/-/g, '').toUpperCase(),
    signerPublicKey: 'MOCK_PUBLIC_KEY_' + uuidv4().replace(/-/g, '').toUpperCase(),
  };
}

/**
 * モック学習記録送信
 *
 * @param session - 学習セッション
 * @param pendingRecordId - 保留中レコードID
 * @param onProgress - 進捗コールバック
 * @returns 送信結果
 */
export async function mockSubmitLearningRecord(
  session: BrowsingSession,
  pendingRecordId: string,
  onProgress?: (step: SubmitResult['step'], message: string) => void
): Promise<SubmitResult> {
  // ステップ1: 初期化
  onProgress?.('init', 'モック: SSSアドレスを取得中...');
  await mockDelay(500);

  const mockAddress = 'TBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';

  // ステップ2: トランザクション作成
  onProgress?.('create_tx', 'モック: トランザクションを作成中...');
  await mockDelay(500);

  // ステップ3: 署名
  onProgress?.('sign_tx', 'モック: SSS Extensionで署名中...');
  await mockDelay(1000);

  const signedTx = createMockSignedTransaction();

  // ステップ4: アナウンス
  onProgress?.('announce_tx', 'モック: トランザクションを送信中...');
  await mockDelay(800);

  // ステップ5: 確認
  onProgress?.('confirm_tx', 'モック: トランザクションの確認を待機中...');
  await mockDelay(2000);

  const confirmedRecord: ConfirmedRecord = {
    id: pendingRecordId,
    session,
    transactionHash: signedTx.hash,
    blockHeight: Math.floor(Math.random() * 1000000) + 1000000,
    timestamp: new Date(),
    signerAddress: mockAddress,
    verified: true,
  };

  // ステップ6: 保存
  onProgress?.('save_record', 'モック: 確定済みレコードを保存中...');
  await mockDelay(300);

  // ステップ7: 完了
  onProgress?.('completed', 'モック: 送信完了');

  return {
    success: true,
    step: 'completed',
    transactionHash: signedTx.hash,
    confirmedRecord,
  };
}

/**
 * ランダム遅延（実際の処理をシミュレート）
 */
function mockDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * モックエラーをシミュレート（デバッグ用）
 */
export async function mockSubmitWithError(
  errorStep: SubmitResult['step']
): Promise<SubmitResult> {
  return {
    success: false,
    step: errorStep,
    error: {
      code: 'MOCK_ERROR',
      message: `モック: ${errorStep}ステップでエラーが発生しました`,
    },
  };
}
