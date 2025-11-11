/**
 * 学習記録の型定義
 */

/**
 * ブラウジングセッション（自動検出された学習活動）
 */
export interface BrowsingSession {
  id: string;
  url: string;
  title: string;
  startTime: Date;
  endTime: Date;
  duration: number; // ミリ秒
  contentHash: string; // SHA-256ハッシュ
  metadata?: {
    description?: string;
    keywords?: string[];
    [key: string]: any;
  };
}

/**
 * 学習記録（ブロックチェーン登録前）
 */
export interface PendingRecord {
  id: string;
  session: BrowsingSession;
  createdAt: Date;
  status: 'pending' | 'submitting' | 'failed';
  error?: string;
}

/**
 * 確定済み学習記録（ブロックチェーン登録済み）
 */
export interface ConfirmedRecord {
  id: string;
  session: BrowsingSession;
  transactionHash: string;
  blockHeight: number;
  timestamp: Date;
  signerAddress: string;
  verified: boolean;
}

/**
 * ブロックチェーントランザクション情報
 */
export interface TransactionInfo {
  hash: string;
  signerAddress: string;
  recipientAddress?: string;
  message: string;
  blockHeight: number;
  timestamp: Date;
}

/**
 * 検証結果
 */
export interface VerificationResult {
  recordId: string;
  contentHash: string;
  transactionHash: string;
  isValid: boolean;
  blockHeight: number;
  timestamp: Date;
  signerAddress: string;
  details?: {
    hashMatch: boolean;
    transactionExists: boolean;
    [key: string]: any;
  };
}

/**
 * 学習ツリーノード
 */
export interface LearningTreeNode {
  id: string;
  recordId: string;
  title: string;
  url: string;
  date: Date;
  summary?: string;
  position?: {
    x: number;
    y: number;
  };
}

/**
 * 学習ツリーエッジ（ノード間の関連）
 */
export interface LearningTreeEdge {
  id: string;
  source: string; // ノードID
  target: string; // ノードID
  label?: string;
}

/**
 * AI要約結果
 */
export interface AISummary {
  recordId: string;
  summary: string;
  keywords: string[];
  generatedAt: Date;
  model: string;
}

/**
 * SSS Extension関連の型
 */
export interface SSSAccount {
  address: string;
  publicKey: string;
}

/**
 * LocalStorage保存用のデータ構造
 */
export interface StoredData {
  pendingRecords: PendingRecord[];
  confirmedRecords: ConfirmedRecord[];
  lastSyncTimestamp: number;
}

/**
 * エラー型
 */
export interface AppError {
  code: string;
  message: string;
  details?: any;
}
