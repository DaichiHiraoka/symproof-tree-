/**
 * SSS Extension 簡略化インターフェース
 *
 * 設計方針:
 * - sss-moduleの機能を最大限活用
 * - Symbol SDK v3でトランザクション作成
 * - TransferTransactionの作成と送信に特化
 */

import {
  isAllowedSSS,
  getActiveAddress,
  getActivePublicKey,
  setTransactionByPayload,
  requestSign,
} from 'sss-module';
import { ERROR_CODES, ERROR_MESSAGES } from '@/constants';
import { AppError } from '@/types';
import { getValidatedConfig } from './config';

/**
 * SSS Extensionの利用可能性をチェック
 */
export function checkSSSAvailability(): {
  available: boolean;
  error?: AppError;
} {
  try {
    const allowed = isAllowedSSS();

    if (!allowed) {
      return {
        available: false,
        error: {
          code: ERROR_CODES.SSS_NOT_ALLOWED,
          message: ERROR_MESSAGES[ERROR_CODES.SSS_NOT_ALLOWED],
        },
      };
    }

    return { available: true };
  } catch (error) {
    return {
      available: false,
      error: {
        code: ERROR_CODES.SSS_NOT_INSTALLED,
        message: ERROR_MESSAGES[ERROR_CODES.SSS_NOT_INSTALLED],
        details: error instanceof Error ? error.message : '不明なエラー',
      },
    };
  }
}

/**
 * アクティブなアカウント情報を取得
 */
export function getSSSAccountInfo(): {
  address: string;
  publicKey: string;
} | null {
  try {
    const availability = checkSSSAvailability();
    if (!availability.available) {
      return null;
    }

    const address = getActiveAddress();
    const publicKey = getActivePublicKey();

    if (!address || !publicKey) {
      return null;
    }

    return { address, publicKey };
  } catch (error) {
    console.error('SSS アカウント情報取得エラー:', error);
    return null;
  }
}

/**
 * TransferTransactionを作成してSSS Extensionで署名
 *
 * @param recipientAddress - 受信者アドレス
 * @param message - メッセージ（学習記録JSON）
 * @param mosaics - モザイク配列（オプション、デフォルトは空配列 = 送金なし）
 * @returns 署名結果
 */
export async function createAndSignTransferTransaction(
  recipientAddress: string,
  message: string,
  mosaics: Array<{ mosaicId: string; amount: string }> = []
): Promise<{
  success: boolean;
  signedTransaction?: any;
  transactionHash?: string;
  error?: AppError;
}> {
  console.log('🔍 [DEBUG] createAndSignTransferTransaction 開始');
  console.log('🔍 [DEBUG] recipientAddress:', recipientAddress);
  console.log('🔍 [DEBUG] message length:', message.length);
  console.log('🔍 [DEBUG] mosaics:', mosaics);

  try {
    console.log('🔍 [DEBUG] checkSSSAvailability 実行前');
    const availability = checkSSSAvailability();
    console.log('🔍 [DEBUG] availability:', availability);

    if (!availability.available) {
      console.log('🔍 [DEBUG] SSS利用不可で早期リターン');
      return { success: false, error: availability.error };
    }

    console.log('🔍 [DEBUG] Symbol SDK動的インポート開始');
    // Symbol SDK v3を動的インポート（クライアントサイドのみ）
    const { SymbolFacade } = await import('symbol-sdk/symbol');
    console.log('🔍 [DEBUG] Symbol SDK動的インポート完了');

    console.log('🔍 [DEBUG] Symbol Facade初期化開始');
    // Symbol Facadeを初期化
    const config = getValidatedConfig();
    console.log('🔍 [DEBUG] config:', config);
    const network = config.networkType === 152 ? 'testnet' : 'mainnet';
    console.log('🔍 [DEBUG] network:', network);
    const facade = new SymbolFacade(network);
    console.log('🔍 [DEBUG] Symbol Facade初期化完了');

    // デッドライン計算（Symbol時刻 = Unixタイムスタンプ - epochAdjustment）
    // 現在のUnixタイムスタンプ（ミリ秒）
    const now = Date.now();
    console.log('🔍 [DEBUG] now (Unix timestamp ms):', now);

    // Symbol epochからの経過時間（ミリ秒）
    const symbolTime = now - (config.epochAdjustment * 1000);
    console.log('🔍 [DEBUG] symbolTime (ms from Symbol epoch):', symbolTime);

    // Deadline（Symbol時刻 + 2時間）
    const deadline = BigInt(symbolTime + config.deadlineHours * 60 * 60 * 1000);
    console.log('🔍 [DEBUG] deadline:', deadline);

    // メッセージをUint8Arrayに変換（プレーンメッセージ）
    console.log('🔍 [DEBUG] メッセージ変換開始');
    const messageBytes = new TextEncoder().encode(message);
    const messageArray = new Uint8Array(messageBytes.length + 1);
    messageArray[0] = 0x00; // プレーンメッセージタイプ
    messageArray.set(messageBytes, 1);
    console.log('🔍 [DEBUG] メッセージ変換完了 length:', messageArray.length);

    // TransferTransactionを作成
    console.log('🔍 [DEBUG] TransferTransaction作成開始');
    const transaction = facade.transactionFactory.create({
      type: 'transfer_transaction_v1',
      signerPublicKey: '0'.repeat(64), // ダミー公開鍵（SSS Extensionが置き換える）
      fee: BigInt(config.maxFee),
      deadline,
      recipientAddress,
      mosaics: [], // 送金なし
      message: messageArray, // プレーンメッセージ
    });
    console.log('🔍 [DEBUG] TransferTransaction作成完了');
    console.log('🔍 [DEBUG] transaction type:', typeof transaction);
    console.log('🔍 [DEBUG] transaction:', transaction);

    // トランザクションをシリアライズ
    console.log('🔍 [DEBUG] トランザクションシリアライズ開始');
    const serialized = transaction.serialize();
    console.log('🔍 [DEBUG] serialized type:', typeof serialized);
    console.log('🔍 [DEBUG] serialized length:', serialized.length);

    // Uint8ArrayをHex文字列に変換
    const hexPayload = Array.from(serialized)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
    console.log('🔍 [DEBUG] hexPayload length:', hexPayload.length);
    console.log('🔍 [DEBUG] hexPayload:', hexPayload.substring(0, 100) + '...');

    // SSS Extensionにトランザクションペイロードを設定
    console.log('🔍 [DEBUG] setTransactionByPayload実行前');
    setTransactionByPayload(hexPayload);
    console.log('🔍 [DEBUG] setTransactionByPayload実行完了');

    // 署名を要求
    console.log('🔍 [DEBUG] requestSign実行前');
    const signedTx = await requestSign();
    console.log('🔍 [DEBUG] requestSign実行完了');
    console.log('🔍 [DEBUG] signedTx:', signedTx);
    console.log('🔍 [DEBUG] signedTx type:', typeof signedTx);
    console.log('🔍 [DEBUG] signedTx keys:', signedTx ? Object.keys(signedTx) : 'null');

    if (!signedTx) {
      console.log('🔍 [DEBUG] signedTxがnullまたはundefined');
      return {
        success: false,
        error: {
          code: ERROR_CODES.SSS_SIGN_REJECTED,
          message: ERROR_MESSAGES[ERROR_CODES.SSS_SIGN_REJECTED],
        },
      };
    }

    console.log('🔍 [DEBUG] signedTx.hash:', signedTx.hash);
    console.log('🔍 [DEBUG] signedTx.payload:', signedTx.payload ? 'exists' : 'missing');
    console.log('🔍 [DEBUG] 署名成功で正常リターン');

    return {
      success: true,
      signedTransaction: signedTx,
      transactionHash: signedTx.hash,
    };
  } catch (error) {
    console.error('🔍 [DEBUG] catch句に到達:', error);
    console.error('🔍 [DEBUG] error type:', typeof error);
    console.error('🔍 [DEBUG] error instanceof Error:', error instanceof Error);
    console.error('🔍 [DEBUG] error message:', error instanceof Error ? error.message : 'unknown');
    console.error('🔍 [DEBUG] error stack:', error instanceof Error ? error.stack : 'unknown');

    if (error instanceof Error && error.message.includes('cancel')) {
      console.log('🔍 [DEBUG] ユーザーキャンセルエラー');
      return {
        success: false,
        error: {
          code: ERROR_CODES.SSS_SIGN_REJECTED,
          message: ERROR_MESSAGES[ERROR_CODES.SSS_SIGN_REJECTED],
        },
      };
    }

    console.log('🔍 [DEBUG] その他のエラーで失敗リターン');
    return {
      success: false,
      error: {
        code: ERROR_CODES.SSS_SIGN_REJECTED,
        message: '署名処理に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
    };
  }
}

/**
 * 署名済みトランザクションをアナウンス
 *
 * @param signedTransaction - 署名済みトランザクション
 * @returns アナウンス結果
 */
export async function announceSignedTransaction(
  signedTransaction: any
): Promise<{
  success: boolean;
  transactionHash?: string;
  error?: AppError;
}> {
  try {
    // SSS Extensionで署名されたトランザクションには
    // 既にpayloadとhashが含まれています

    // ノードURLを取得
    const config = getValidatedConfig();
    const nodeUrl = config.nodeUrl;

    // HTTPリクエストでトランザクションをアナウンス
    const response = await fetch(`${nodeUrl}/transactions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: signedTransaction.payload,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`アナウンス失敗: ${response.status} ${errorText}`);
    }

    return {
      success: true,
      transactionHash: signedTransaction.hash,
    };
  } catch (error) {
    console.error('トランザクションアナウンスエラー:', error);

    return {
      success: false,
      error: {
        code: ERROR_CODES.TRANSACTION_FAILED,
        message: ERROR_MESSAGES[ERROR_CODES.TRANSACTION_FAILED],
        details: error instanceof Error ? error.message : '不明なエラー',
      },
    };
  }
}
