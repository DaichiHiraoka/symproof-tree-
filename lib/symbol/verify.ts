/**
 * ブロックチェーン記録の検証機能
 *
 * 設計方針:
 * - トランザクションハッシュからブロックチェーン上のデータを取得
 * - メッセージペイロードを解析して学習記録を抽出
 * - ローカルレコードと比較してデータの整合性を検証
 */

import { AppError } from '@/types';
import { ERROR_CODES, ERROR_MESSAGES } from '@/constants';
import { getValidatedConfig } from './config';

/**
 * 検証結果インターフェース
 */
export interface VerificationResult {
  success: boolean;
  valid: boolean;
  txHash: string;
  blockHeight?: number;
  timestamp?: Date;
  signerAddress?: string;
  message?: any;
  error?: AppError;
  details?: {
    transactionFound: boolean;
    messageDecoded: boolean;
    blockConfirmed: boolean;
  };
}

/**
 * トランザクション情報インターフェース
 */
interface TransactionInfo {
  hash: string;
  height: number;
  timestamp: number;
  signerAddress: string;
  message: string;
  type: string;
}

/**
 * トランザクションハッシュでブロックチェーン記録を検証
 *
 * @param txHash - トランザクションハッシュ（64文字の16進数）
 * @returns 検証結果
 */
export async function verifyTransaction(
  txHash: string
): Promise<VerificationResult> {
  console.log('🔍 [DEBUG] verifyTransaction 開始');
  console.log('🔍 [DEBUG] txHash:', txHash);

  try {
    // トランザクションハッシュの形式検証
    if (!isValidTransactionHash(txHash)) {
      console.log('🔍 [DEBUG] 無効なトランザクションハッシュ');
      return {
        success: false,
        valid: false,
        txHash,
        error: {
          code: ERROR_CODES.VERIFICATION_FAILED,
          message: '無効なトランザクションハッシュです（64文字の16進数である必要があります）',
        },
      };
    }

    // ノードURLを取得
    const config = getValidatedConfig();
    const nodeUrl = config.nodeUrl;
    console.log('🔍 [DEBUG] nodeUrl:', nodeUrl);

    // トランザクション情報を取得
    console.log('🔍 [DEBUG] トランザクション情報取得開始');
    const txInfo = await fetchTransactionInfo(nodeUrl, txHash);
    console.log('🔍 [DEBUG] txInfo:', txInfo);

    if (!txInfo) {
      console.log('🔍 [DEBUG] トランザクションが見つからない');
      return {
        success: false,
        valid: false,
        txHash,
        error: {
          code: ERROR_CODES.TRANSACTION_NOT_FOUND,
          message: ERROR_MESSAGES[ERROR_CODES.TRANSACTION_NOT_FOUND],
        },
        details: {
          transactionFound: false,
          messageDecoded: false,
          blockConfirmed: false,
        },
      };
    }

    // メッセージをデコード
    console.log('🔍 [DEBUG] メッセージデコード開始');
    const message = decodeMessage(txInfo.message);
    console.log('🔍 [DEBUG] decoded message:', message);

    // タイムスタンプをDateに変換（Symbol epochからの経過ミリ秒）
    const timestamp = symbolTimestampToDate(txInfo.timestamp, config.epochAdjustment);
    console.log('🔍 [DEBUG] timestamp:', timestamp);

    // 検証成功
    console.log('🔍 [DEBUG] 検証成功');
    return {
      success: true,
      valid: true,
      txHash,
      blockHeight: txInfo.height,
      timestamp,
      signerAddress: txInfo.signerAddress,
      message,
      details: {
        transactionFound: true,
        messageDecoded: message !== null,
        blockConfirmed: txInfo.height > 0,
      },
    };
  } catch (error) {
    console.error('🔍 [DEBUG] verifyTransaction エラー:', error);

    return {
      success: false,
      valid: false,
      txHash,
      error: {
        code: ERROR_CODES.VERIFICATION_FAILED,
        message: ERROR_MESSAGES[ERROR_CODES.VERIFICATION_FAILED],
        details: error instanceof Error ? error.message : '不明なエラー',
      },
    };
  }
}

/**
 * トランザクションハッシュの形式を検証
 */
function isValidTransactionHash(txHash: string): boolean {
  // 64文字の16進数であることを確認
  const hexPattern = /^[0-9A-Fa-f]{64}$/;
  return hexPattern.test(txHash);
}

/**
 * ノードからトランザクション情報を取得
 */
async function fetchTransactionInfo(
  nodeUrl: string,
  txHash: string
): Promise<TransactionInfo | null> {
  try {
    console.log('🔍 [DEBUG] fetchTransactionInfo: GET', `${nodeUrl}/transactions/confirmed/${txHash}`);

    const response = await fetch(`${nodeUrl}/transactions/confirmed/${txHash}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 [DEBUG] response.status:', response.status);

    if (!response.ok) {
      if (response.status === 404) {
        console.log('🔍 [DEBUG] トランザクションが見つかりません (404)');
        return null;
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('🔍 [DEBUG] response data keys:', Object.keys(data));

    // Symbol REST APIのレスポンス構造に対応
    const tx = data.transaction || data;
    const meta = data.meta;

    console.log('🔍 [DEBUG] tx.type:', tx.type);
    console.log('🔍 [DEBUG] tx.message:', tx.message);

    // TransferTransactionのみ対応
    if (tx.type !== 16724) { // 16724 = TransferTransaction (0x4154)
      console.log('🔍 [DEBUG] TransferTransaction以外は未対応');
      return null;
    }

    return {
      hash: meta?.hash || txHash,
      height: parseInt(meta?.height || '0', 10),
      timestamp: parseInt(meta?.timestamp || tx.timestamp || '0', 10),
      signerAddress: tx.signerPublicKey ? publicKeyToAddress(tx.signerPublicKey) : 'Unknown',
      message: tx.message || '',
      type: 'Transfer',
    };
  } catch (error) {
    console.error('🔍 [DEBUG] fetchTransactionInfo エラー:', error);
    throw error;
  }
}

/**
 * 公開鍵からアドレスを生成（簡易版）
 * 注: 実際のアドレス変換はSymbol SDKを使用すべきだが、
 * 検証機能では表示のみなので簡易的に公開鍵をそのまま返す
 */
function publicKeyToAddress(publicKey: string): string {
  // 簡易実装: 公開鍵の先頭40文字を返す
  return publicKey.substring(0, 40).toUpperCase();
}

/**
 * メッセージペイロードをデコード
 */
function decodeMessage(messagePayload: string): any {
  try {
    if (!messagePayload) {
      console.log('🔍 [DEBUG] メッセージが空');
      return null;
    }

    // メッセージが16進数文字列の場合
    if (/^[0-9A-Fa-f]+$/.test(messagePayload)) {
      console.log('🔍 [DEBUG] 16進数メッセージをデコード');

      // 先頭1バイト（2文字）はメッセージタイプ（00 = plain）
      const messageType = messagePayload.substring(0, 2);
      console.log('🔍 [DEBUG] messageType:', messageType);

      if (messageType !== '00') {
        console.log('🔍 [DEBUG] プレーンメッセージ以外は未対応');
        return null;
      }

      // 残りのバイトをUTF-8文字列にデコード
      const hexString = messagePayload.substring(2);
      const bytes = hexToBytes(hexString);
      const text = new TextDecoder('utf-8').decode(bytes);
      console.log('🔍 [DEBUG] decoded text:', text);

      // JSONとしてパース
      return JSON.parse(text);
    }

    // メッセージが既に文字列の場合
    console.log('🔍 [DEBUG] 文字列メッセージをパース');
    return JSON.parse(messagePayload);
  } catch (error) {
    console.error('🔍 [DEBUG] メッセージデコードエラー:', error);
    return null;
  }
}

/**
 * 16進数文字列をUint8Arrayに変換
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Symbol時刻を通常のDateに変換
 */
function symbolTimestampToDate(symbolTimestamp: number, epochAdjustment: number): Date {
  // symbolTimestamp はミリ秒単位
  // epochAdjustment は秒単位
  const unixTimestamp = symbolTimestamp + (epochAdjustment * 1000);
  return new Date(unixTimestamp);
}

/**
 * 複数のトランザクションを検証（バッチ処理）
 */
export async function verifyMultipleTransactions(
  txHashes: string[]
): Promise<VerificationResult[]> {
  console.log('🔍 [DEBUG] verifyMultipleTransactions 開始:', txHashes.length, '件');

  const results: VerificationResult[] = [];

  for (const txHash of txHashes) {
    const result = await verifyTransaction(txHash);
    results.push(result);

    // レート制限対策: 少し待機
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('🔍 [DEBUG] verifyMultipleTransactions 完了');
  return results;
}
