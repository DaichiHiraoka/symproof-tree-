/**
 * LocalStorageユーティリティ
 * ブラウザのLocalStorageを使用したデータ永続化
 */

import { STORAGE_KEYS } from '@/constants';
import { PendingRecord, ConfirmedRecord, StoredData } from '@/types';

/**
 * LocalStorageが利用可能かチェック
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 保留中レコードを取得
 */
export function getPendingRecords(): PendingRecord[] {
  if (!isLocalStorageAvailable()) {
    console.warn('LocalStorage is not available');
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEYS.PENDING_RECORDS);
    if (!data) return [];

    const records = JSON.parse(data) as PendingRecord[];

    // Date文字列をDateオブジェクトに変換
    return records.map(record => ({
      ...record,
      createdAt: new Date(record.createdAt),
      session: {
        ...record.session,
        startTime: new Date(record.session.startTime),
        endTime: new Date(record.session.endTime),
      },
    }));
  } catch (error) {
    console.error('Failed to get pending records:', error);
    return [];
  }
}

/**
 * 保留中レコードを保存
 */
export function savePendingRecords(records: PendingRecord[]): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('LocalStorage is not available');
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.PENDING_RECORDS, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('Failed to save pending records:', error);
    return false;
  }
}

/**
 * 保留中レコードを追加
 */
export function addPendingRecord(record: PendingRecord): boolean {
  const records = getPendingRecords();
  records.push(record);
  return savePendingRecords(records);
}

/**
 * 保留中レコードを削除
 */
export function removePendingRecord(recordId: string): boolean {
  const records = getPendingRecords();
  const filtered = records.filter(r => r.id !== recordId);
  return savePendingRecords(filtered);
}

/**
 * 保留中レコードを更新
 */
export function updatePendingRecord(recordId: string, updates: Partial<PendingRecord>): boolean {
  const records = getPendingRecords();
  const index = records.findIndex(r => r.id === recordId);

  if (index === -1) return false;

  records[index] = { ...records[index], ...updates };
  return savePendingRecords(records);
}

/**
 * 確定済みレコードを取得
 */
export function getConfirmedRecords(): ConfirmedRecord[] {
  if (!isLocalStorageAvailable()) {
    console.warn('LocalStorage is not available');
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIRMED_RECORDS);
    if (!data) return [];

    const records = JSON.parse(data) as ConfirmedRecord[];

    // Date文字列をDateオブジェクトに変換
    return records.map(record => ({
      ...record,
      timestamp: new Date(record.timestamp),
      session: {
        ...record.session,
        startTime: new Date(record.session.startTime),
        endTime: new Date(record.session.endTime),
      },
    }));
  } catch (error) {
    console.error('Failed to get confirmed records:', error);
    return [];
  }
}

/**
 * 確定済みレコードを保存
 */
export function saveConfirmedRecords(records: ConfirmedRecord[]): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('LocalStorage is not available');
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.CONFIRMED_RECORDS, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('Failed to save confirmed records:', error);
    return false;
  }
}

/**
 * 確定済みレコードを追加
 */
export function addConfirmedRecord(record: ConfirmedRecord): boolean {
  const records = getConfirmedRecords();
  records.push(record);
  return saveConfirmedRecords(records);
}

/**
 * 確定済みレコードを削除
 * 注意: ブロックチェーン上の記録は削除されません。UI上の表示のみ削除されます。
 */
export function removeConfirmedRecord(recordId: string): boolean {
  const records = getConfirmedRecords();
  const filtered = records.filter(r => r.id !== recordId);
  return saveConfirmedRecords(filtered);
}

/**
 * 確定済みレコードを更新
 */
export function updateConfirmedRecord(recordId: string, updates: Partial<ConfirmedRecord>): boolean {
  const records = getConfirmedRecords();
  const index = records.findIndex(r => r.id === recordId);

  if (index === -1) return false;

  records[index] = { ...records[index], ...updates };
  return saveConfirmedRecords(records);
}

/**
 * 最終同期時刻を取得
 */
export function getLastSyncTimestamp(): number {
  if (!isLocalStorageAvailable()) return 0;

  try {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return data ? parseInt(data, 10) : 0;
  } catch (error) {
    console.error('Failed to get last sync timestamp:', error);
    return 0;
  }
}

/**
 * 最終同期時刻を更新
 */
export function updateLastSyncTimestamp(): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
    return true;
  } catch (error) {
    console.error('Failed to update last sync timestamp:', error);
    return false;
  }
}

/**
 * ユーザーアドレスを取得
 */
export function getUserAddress(): string | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    return localStorage.getItem(STORAGE_KEYS.USER_ADDRESS);
  } catch (error) {
    console.error('Failed to get user address:', error);
    return null;
  }
}

/**
 * ユーザーアドレスを保存
 */
export function saveUserAddress(address: string): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    localStorage.setItem(STORAGE_KEYS.USER_ADDRESS, address);
    return true;
  } catch (error) {
    console.error('Failed to save user address:', error);
    return false;
  }
}

/**
 * 全てのストレージをクリア
 */
export function clearAllStorage(): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Failed to clear storage:', error);
    return false;
  }
}
