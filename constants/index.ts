/**
 * アプリケーション定数
 */

/**
 * Symbol ブロックチェーン設定
 */
export const SYMBOL_CONFIG = {
  // テストネットのノードURL（環境変数から取得）
  NODE_URL: process.env.NEXT_PUBLIC_SYMBOL_NODE_URL || 'https://sym-test-01.opening-line.jp:3001',

  // テストネットのネットワークタイプ
  NETWORK_TYPE: 152, // TESTNET

  // エポックアジャストメント（テストネット）
  EPOCH_ADJUSTMENT: 1667250467,

  // ネットワーク通貨
  CURRENCY_MOSAIC_ID: '0x72C0212E67A08BCE',

  // トランザクション設定
  TRANSACTION: {
    // デッドライン（2時間）
    DEADLINE_HOURS: 2,

    // 最大手数料（100 XYM）
    MAX_FEE: 100_000000,
  },
} as const;

/**
 * LocalStorage キー
 */
export const STORAGE_KEYS = {
  PENDING_RECORDS: 'symproof_pending_records',
  CONFIRMED_RECORDS: 'symproof_confirmed_records',
  LAST_SYNC: 'symproof_last_sync',
  USER_ADDRESS: 'symproof_user_address',
} as const;

/**
 * 自動検出設定
 */
export const DETECTION_CONFIG = {
  // 学習活動とみなす最小滞在時間（ミリ秒）
  MIN_DURATION: 30 * 1000, // 30秒

  // セッション終了とみなす非アクティブ時間（ミリ秒）
  INACTIVITY_THRESHOLD: 5 * 60 * 1000, // 5分

  // 検出対象URLパターン（学習サイトの例）
  TARGET_PATTERNS: [
    /^https?:\/\/(www\.)?youtube\.com\/watch/,
    /^https?:\/\/(www\.)?coursera\.org\//,
    /^https?:\/\/(www\.)?udemy\.com\//,
    /^https?:\/\/(www\.)?edx\.org\//,
    /^https?:\/\/(www\.)?github\.com\//,
    /^https?:\/\/(www\.)?stackoverflow\.com\//,
    /^https?:\/\/(www\.)?medium\.com\//,
    /^https?:\/\/(www\.)?dev\.to\//,
  ],
} as const;

/**
 * AI要約設定
 */
export const AI_CONFIG = {
  // Gemini APIモデル
  MODEL: 'gemini-1.5-flash',

  // 要約の最大文字数
  MAX_SUMMARY_LENGTH: 500,

  // プロンプトテンプレート
  SUMMARY_PROMPT: `以下の学習記録を日本語で要約してください。
タイトル: {title}
URL: {url}
学習時間: {duration}分

要約は500文字以内で、主なトピックとキーワードを含めてください。`,
} as const;

/**
 * UI設定
 */
export const UI_CONFIG = {
  // 1ページあたりの表示件数
  RECORDS_PER_PAGE: 20,

  // 学習ツリーの初期ズームレベル
  TREE_INITIAL_ZOOM: 1,

  // 学習ツリーのノード幅
  TREE_NODE_WIDTH: 250,

  // 学習ツリーのノード高さ
  TREE_NODE_HEIGHT: 100,

  // 日付フォーマット
  DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
} as const;

/**
 * エラーコード
 */
export const ERROR_CODES = {
  // SSS Extension関連
  SSS_NOT_INSTALLED: 'SSS_NOT_INSTALLED',
  SSS_NOT_ALLOWED: 'SSS_NOT_ALLOWED',
  SSS_NO_ACTIVE_ACCOUNT: 'SSS_NO_ACTIVE_ACCOUNT',
  SSS_SIGN_REJECTED: 'SSS_SIGN_REJECTED',

  // ブロックチェーン関連
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  TRANSACTION_NOT_FOUND: 'TRANSACTION_NOT_FOUND',
  NODE_CONNECTION_FAILED: 'NODE_CONNECTION_FAILED',

  // 検証関連
  VERIFICATION_FAILED: 'VERIFICATION_FAILED',
  HASH_MISMATCH: 'HASH_MISMATCH',

  // AI関連
  AI_SUMMARY_FAILED: 'AI_SUMMARY_FAILED',
  AI_API_KEY_MISSING: 'AI_API_KEY_MISSING',

  // ストレージ関連
  STORAGE_ERROR: 'STORAGE_ERROR',
  DATA_PARSE_ERROR: 'DATA_PARSE_ERROR',
} as const;

/**
 * エラーメッセージ
 */
export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.SSS_NOT_INSTALLED]: 'SSS Extensionがインストールされていません',
  [ERROR_CODES.SSS_NOT_ALLOWED]: 'SSS Extensionの接続が許可されていません',
  [ERROR_CODES.SSS_NO_ACTIVE_ACCOUNT]: 'アクティブなアカウントが見つかりません',
  [ERROR_CODES.SSS_SIGN_REJECTED]: '署名がキャンセルされました',
  [ERROR_CODES.TRANSACTION_FAILED]: 'トランザクションの送信に失敗しました',
  [ERROR_CODES.TRANSACTION_NOT_FOUND]: 'トランザクションが見つかりません',
  [ERROR_CODES.NODE_CONNECTION_FAILED]: 'ノードへの接続に失敗しました',
  [ERROR_CODES.VERIFICATION_FAILED]: '検証に失敗しました',
  [ERROR_CODES.HASH_MISMATCH]: 'コンテンツハッシュが一致しません',
  [ERROR_CODES.AI_SUMMARY_FAILED]: 'AI要約の生成に失敗しました',
  [ERROR_CODES.AI_API_KEY_MISSING]: 'Google AI APIキーが設定されていません',
  [ERROR_CODES.STORAGE_ERROR]: 'データの保存に失敗しました',
  [ERROR_CODES.DATA_PARSE_ERROR]: 'データの読み込みに失敗しました',
} as const;

/**
 * モックデータファイルパス（開発用）
 */
export const MOCK_DATA_PATHS = {
  BROWSING_SESSIONS: '/mock/mock-browsing-sessions.json',
  CONFIRMED_RECORDS: '/mock/mock-confirmed-records.json',
} as const;
