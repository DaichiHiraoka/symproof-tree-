/**
 * 学習活動の自動検出ロジック
 *
 * 注意: このファイルはブラウザ拡張機能やバックグラウンドスクリプトでの使用を想定していますが、
 * 現在の実装ではモックデータを使用したシミュレーションとなります。
 * 実際のブラウザ監視は別途ブラウザ拡張機能として実装する必要があります。
 */

import { BrowsingSession } from '@/types';
import { DETECTION_CONFIG } from '@/constants';
import { generateSessionHash } from '@/lib/utils/hash';
import { v4 as uuidv4 } from 'uuid';

/**
 * URLが学習サイトかどうかを判定
 */
export function isLearningUrl(url: string): boolean {
  return DETECTION_CONFIG.TARGET_PATTERNS.some(pattern => pattern.test(url));
}

/**
 * セッションが有効な学習活動かを判定
 * 最小滞在時間を満たしているかチェック
 */
export function isValidLearningSession(duration: number): boolean {
  return duration >= DETECTION_CONFIG.MIN_DURATION;
}

/**
 * ブラウジングセッションを作成
 */
export async function createBrowsingSession(
  url: string,
  title: string,
  startTime: Date,
  endTime: Date,
  metadata?: Record<string, any>
): Promise<BrowsingSession> {
  const duration = endTime.getTime() - startTime.getTime();
  const contentHash = await generateSessionHash(url, title, startTime, endTime);

  return {
    id: uuidv4(),
    url,
    title,
    startTime,
    endTime,
    duration,
    contentHash,
    metadata,
  };
}

/**
 * モックデータから学習セッションを読み込み
 * 実際の実装ではブラウザ拡張機能からリアルタイムで取得
 */
export async function loadMockBrowsingSessions(): Promise<BrowsingSession[]> {
  try {
    const response = await fetch('/mock/mock-browsing-sessions.json');
    if (!response.ok) {
      throw new Error('Failed to load mock data');
    }

    const data = await response.json();

    // Date文字列をDateオブジェクトに変換
    return data.map((session: any) => ({
      ...session,
      startTime: new Date(session.startTime),
      endTime: new Date(session.endTime),
    }));
  } catch (error) {
    console.error('Failed to load mock browsing sessions:', error);
    return [];
  }
}

/**
 * 新しい学習セッションを検出（モック実装）
 * 実際の実装では、最後のチェック時刻以降の新しいセッションのみを返す
 */
export async function detectNewSessions(
  lastCheckTime: number
): Promise<BrowsingSession[]> {
  const allSessions = await loadMockBrowsingSessions();

  // 最後のチェック時刻以降のセッションのみをフィルタ
  return allSessions.filter(session => {
    const sessionTime = session.endTime.getTime();
    return sessionTime > lastCheckTime;
  });
}

/**
 * セッションから学習記録用のメッセージを生成
 * ブロックチェーンに記録するメッセージフォーマット
 */
export function generateRecordMessage(session: BrowsingSession): string {
  const record = {
    type: 'learning_record',
    url: session.url,
    title: session.title,
    startTime: session.startTime.toISOString(),
    endTime: session.endTime.toISOString(),
    duration: session.duration,
    contentHash: session.contentHash,
  };

  return JSON.stringify(record);
}

/**
 * セッションの概要を取得（UI表示用）
 */
export function getSessionSummary(session: BrowsingSession): string {
  const durationMinutes = Math.floor(session.duration / 60000);
  const durationSeconds = Math.floor((session.duration % 60000) / 1000);

  let durationText = '';
  if (durationMinutes > 0) {
    durationText = `${durationMinutes}分`;
    if (durationSeconds > 0) {
      durationText += `${durationSeconds}秒`;
    }
  } else {
    durationText = `${durationSeconds}秒`;
  }

  return `${session.title} - ${durationText}の学習`;
}

/**
 * セッションをフィルタリング（検索・絞り込み用）
 */
export function filterSessions(
  sessions: BrowsingSession[],
  filters: {
    keyword?: string;
    startDate?: Date;
    endDate?: Date;
    minDuration?: number;
  }
): BrowsingSession[] {
  return sessions.filter(session => {
    // キーワード検索
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const matchTitle = session.title.toLowerCase().includes(keyword);
      const matchUrl = session.url.toLowerCase().includes(keyword);
      if (!matchTitle && !matchUrl) return false;
    }

    // 日付範囲
    if (filters.startDate && session.startTime < filters.startDate) {
      return false;
    }
    if (filters.endDate && session.endTime > filters.endDate) {
      return false;
    }

    // 最小学習時間
    if (filters.minDuration && session.duration < filters.minDuration) {
      return false;
    }

    return true;
  });
}

/**
 * セッションを日付でソート
 */
export function sortSessionsByDate(
  sessions: BrowsingSession[],
  order: 'asc' | 'desc' = 'desc'
): BrowsingSession[] {
  return [...sessions].sort((a, b) => {
    const timeA = a.startTime.getTime();
    const timeB = b.startTime.getTime();
    return order === 'asc' ? timeA - timeB : timeB - timeA;
  });
}
