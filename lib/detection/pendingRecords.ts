/**
 * 保留中レコード管理関数
 * 検出された学習セッションを保留中レコードとして管理
 */

import { BrowsingSession, PendingRecord } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import {
  getPendingRecords,
  addPendingRecord,
  removePendingRecord,
  updatePendingRecord,
} from '@/lib/storage/localStorage';

/**
 * ブラウジングセッションから保留中レコードを作成
 */
export function createPendingRecord(session: BrowsingSession): PendingRecord {
  return {
    id: uuidv4(),
    session,
    createdAt: new Date(),
    status: 'pending',
  };
}

/**
 * 保留中レコードを追加
 */
export function addToPending(session: BrowsingSession): PendingRecord | null {
  const record = createPendingRecord(session);
  const success = addPendingRecord(record);
  return success ? record : null;
}

/**
 * 複数のセッションを保留中レコードとして追加
 */
export function addMultipleToPending(sessions: BrowsingSession[]): PendingRecord[] {
  const addedRecords: PendingRecord[] = [];

  sessions.forEach(session => {
    const record = addToPending(session);
    if (record) {
      addedRecords.push(record);
    }
  });

  return addedRecords;
}

/**
 * 保留中レコードを取得
 */
export function getAllPendingRecords(): PendingRecord[] {
  return getPendingRecords();
}

/**
 * 特定の保留中レコードを取得
 */
export function getPendingRecordById(recordId: string): PendingRecord | null {
  const records = getPendingRecords();
  return records.find(r => r.id === recordId) || null;
}

/**
 * 保留中レコードを削除
 */
export function removePendingRecordById(recordId: string): boolean {
  return removePendingRecord(recordId);
}

/**
 * 保留中レコードのステータスを更新
 */
export function updatePendingRecordStatus(
  recordId: string,
  status: 'pending' | 'submitting' | 'failed',
  error?: string
): boolean {
  return updatePendingRecord(recordId, { status, error });
}

/**
 * 送信中ステータスに更新
 */
export function markAsSubmitting(recordId: string): boolean {
  return updatePendingRecordStatus(recordId, 'submitting');
}

/**
 * 失敗ステータスに更新
 */
export function markAsFailed(recordId: string, error: string): boolean {
  return updatePendingRecordStatus(recordId, 'failed', error);
}

/**
 * 保留中レコードをステータスでフィルタ
 */
export function filterPendingRecordsByStatus(
  status: 'pending' | 'submitting' | 'failed'
): PendingRecord[] {
  const records = getPendingRecords();
  return records.filter(r => r.status === status);
}

/**
 * 送信可能な保留中レコードを取得
 * ステータスがpendingまたはfailedのレコード
 */
export function getSubmittableRecords(): PendingRecord[] {
  const records = getPendingRecords();
  return records.filter(r => r.status === 'pending' || r.status === 'failed');
}

/**
 * 保留中レコードの件数を取得
 */
export function getPendingRecordsCount(): {
  total: number;
  pending: number;
  submitting: number;
  failed: number;
} {
  const records = getPendingRecords();

  return {
    total: records.length,
    pending: records.filter(r => r.status === 'pending').length,
    submitting: records.filter(r => r.status === 'submitting').length,
    failed: records.filter(r => r.status === 'failed').length,
  };
}

/**
 * 保留中レコードを日付でソート
 */
export function sortPendingRecordsByDate(
  records: PendingRecord[],
  order: 'asc' | 'desc' = 'desc'
): PendingRecord[] {
  return [...records].sort((a, b) => {
    const timeA = a.createdAt.getTime();
    const timeB = b.createdAt.getTime();
    return order === 'asc' ? timeA - timeB : timeB - timeA;
  });
}

/**
 * 古い失敗レコードをクリーンアップ
 * 指定日数以上前の失敗レコードを削除
 */
export function cleanupOldFailedRecords(daysOld: number = 7): number {
  const records = getPendingRecords();
  const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
  let removedCount = 0;

  records.forEach(record => {
    if (
      record.status === 'failed' &&
      record.createdAt.getTime() < cutoffTime
    ) {
      if (removePendingRecord(record.id)) {
        removedCount++;
      }
    }
  });

  return removedCount;
}
