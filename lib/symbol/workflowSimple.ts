/**
 * 学習記録送信ワークフロー（簡略版）
 *
 * 設計方針:
 * - sss-moduleの機能を最大限活用
 * - Symbol SDK v3の複雑な部分は使用しない
 * - シンプルで保守しやすいコード
 */

import { BrowsingSession, ConfirmedRecord, AppError } from '@/types';
import {
  checkSSSAvailability,
  getSSSAccountInfo,
  createAndSignTransferTransaction,
  announceSignedTransaction,
} from './sssSimple';
import { generateRecordMessage } from '@/lib/detection/autoDetect';
import { addConfirmedRecord } from '@/lib/storage/localStorage';
import { removePendingRecordById } from '@/lib/detection/pendingRecords';

/**
 * 送信結果
 */
export interface SubmitResult {
  success: boolean;
  step:
    | 'init'
    | 'create_tx'
    | 'sign_tx'
    | 'announce_tx'
    | 'confirm_tx'
    | 'save_record'
    | 'completed';
  transactionHash?: string;
  confirmedRecord?: ConfirmedRecord;
  error?: AppError;
}

/**
 * 学習記録をブロックチェーンに送信
 *
 * @param session - 学習セッション
 * @param pendingRecordId - 保留中レコードID
 * @param onProgress - 進捗コールバック
 * @returns 送信結果
 */
export async function submitLearningRecord(
  session: BrowsingSession,
  pendingRecordId: string,
  onProgress?: (step: SubmitResult['step'], message: string) => void
): Promise<SubmitResult> {
  console.log('🔍 [DEBUG] submitLearningRecord 開始');
  console.log('🔍 [DEBUG] pendingRecordId:', pendingRecordId);
  console.log('🔍 [DEBUG] session:', session);

  let currentStep: SubmitResult['step'] = 'init';

  try {
    // ステップ1: SSS Extension確認
    console.log('🔍 [DEBUG] ステップ1: SSS Extension確認');
    onProgress?.('init', 'SSS Extensionを確認中...');
    const availability = checkSSSAvailability();
    console.log('🔍 [DEBUG] availability:', availability);

    if (!availability.available) {
      console.log('🔍 [DEBUG] SSS利用不可で早期リターン');
      return {
        success: false,
        step: 'init',
        error: availability.error,
      };
    }

    console.log('🔍 [DEBUG] getSSSAccountInfo実行');
    const accountInfo = getSSSAccountInfo();
    console.log('🔍 [DEBUG] accountInfo:', accountInfo);

    if (!accountInfo) {
      console.log('🔍 [DEBUG] アカウント情報なしで早期リターン');
      return {
        success: false,
        step: 'init',
        error: {
          code: 'SSS_NO_ACTIVE_ACCOUNT',
          message: 'アクティブなアカウントが見つかりません',
        },
      };
    }

    const signerAddress = accountInfo.address;
    console.log('🔍 [DEBUG] signerAddress:', signerAddress);

    // ステップ2+3: トランザクション作成と署名（SSS Extensionが両方実行）
    currentStep = 'sign_tx';
    console.log('🔍 [DEBUG] ステップ2+3: トランザクション作成と署名');
    onProgress?.(currentStep, 'SSS Extensionで署名を要求中...');

    console.log('🔍 [DEBUG] generateRecordMessage実行');
    const message = generateRecordMessage(session);
    console.log('🔍 [DEBUG] message length:', message.length);

    console.log('🔍 [DEBUG] createAndSignTransferTransaction実行前');
    const signResult = await createAndSignTransferTransaction(
      signerAddress, // 自分宛に送信
      message,
      [] // モザイクなし（送金なし）
    );
    console.log('🔍 [DEBUG] createAndSignTransferTransaction実行後');
    console.log('🔍 [DEBUG] signResult:', signResult);

    if (!signResult.success || !signResult.signedTransaction) {
      console.log('🔍 [DEBUG] 署名失敗で早期リターン');
      return {
        success: false,
        step: currentStep,
        error: signResult.error,
      };
    }

    const signedTransaction = signResult.signedTransaction;
    const transactionHash = signResult.transactionHash!;
    console.log('🔍 [DEBUG] transactionHash:', transactionHash);

    // ステップ4: トランザクションをアナウンス
    currentStep = 'announce_tx';
    console.log('🔍 [DEBUG] ステップ4: トランザクションアナウンス');
    onProgress?.(currentStep, 'トランザクションを送信中...');

    console.log('🔍 [DEBUG] announceSignedTransaction実行前');
    const announceResult = await announceSignedTransaction(signedTransaction);
    console.log('🔍 [DEBUG] announceSignedTransaction実行後');
    console.log('🔍 [DEBUG] announceResult:', announceResult);

    if (!announceResult.success) {
      console.log('🔍 [DEBUG] アナウンス失敗で早期リターン');
      return {
        success: false,
        step: currentStep,
        transactionHash,
        error: announceResult.error,
      };
    }

    // ステップ5: 確定済みレコードを保存
    // 注意: トランザクション確認を待たずに保存
    // （実際の確認はPhase 4で実装）
    currentStep = 'save_record';
    console.log('🔍 [DEBUG] ステップ5: 確定済みレコード保存');
    onProgress?.(currentStep, '確定済みレコードを保存中...');

    const confirmedRecord: ConfirmedRecord = {
      id: pendingRecordId,
      session,
      transactionHash,
      blockHeight: 0, // 確認前なので0
      timestamp: new Date(),
      signerAddress,
      verified: false, // 確認前なのでfalse
    };

    console.log('🔍 [DEBUG] addConfirmedRecord実行');
    const saveSuccess = addConfirmedRecord(confirmedRecord);
    console.log('🔍 [DEBUG] saveSuccess:', saveSuccess);

    if (!saveSuccess) {
      console.warn('確定済みレコードの保存に失敗しましたが、処理は継続します');
    }

    // 保留中レコードを削除
    console.log('🔍 [DEBUG] removePendingRecordById実行');
    removePendingRecordById(pendingRecordId);

    // ステップ6: 完了
    currentStep = 'completed';
    console.log('🔍 [DEBUG] ステップ6: 完了');
    onProgress?.(currentStep, '送信完了');

    console.log('🔍 [DEBUG] submitLearningRecord 正常終了');
    return {
      success: true,
      step: currentStep,
      transactionHash,
      confirmedRecord,
    };
  } catch (error) {
    console.error('🔍 [DEBUG] submitLearningRecord catch句に到達:', error);
    console.error('🔍 [DEBUG] currentStep:', currentStep);
    console.error('🔍 [DEBUG] error type:', typeof error);
    console.error('🔍 [DEBUG] error instanceof Error:', error instanceof Error);
    console.error('🔍 [DEBUG] error message:', error instanceof Error ? error.message : 'unknown');
    console.error('🔍 [DEBUG] error stack:', error instanceof Error ? error.stack : 'unknown');

    return {
      success: false,
      step: currentStep,
      error: {
        code: 'SUBMIT_FAILED',
        message: '学習記録の送信に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
    };
  }
}

/**
 * リトライ付き送信
 */
export async function submitLearningRecordWithRetry(
  session: BrowsingSession,
  pendingRecordId: string,
  maxRetries: number = 3,
  onProgress?: (step: SubmitResult['step'], message: string) => void
): Promise<SubmitResult> {
  let lastResult: SubmitResult | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    if (attempt > 1) {
      onProgress?.('init', `リトライ中... (${attempt}/${maxRetries}回目)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    lastResult = await submitLearningRecord(session, pendingRecordId, onProgress);

    if (lastResult.success) {
      return lastResult;
    }

    // ユーザーキャンセルやSSS未インストールの場合はリトライしない
    if (
      lastResult.error?.code === 'SSS_SIGN_REJECTED' ||
      lastResult.error?.code === 'SSS_NOT_INSTALLED' ||
      lastResult.error?.code === 'SSS_NOT_ALLOWED'
    ) {
      return lastResult;
    }
  }

  return (
    lastResult || {
      success: false,
      step: 'init',
      error: {
        code: 'MAX_RETRIES_EXCEEDED',
        message: '最大リトライ回数に達しました',
      },
    }
  );
}
