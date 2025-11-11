/**
 * Symbol ブロックチェーン設定
 *
 * 設計方針:
 * - 環境変数から設定を読み込み
 * - テスト環境での差し替えを容易にする
 * - 設定の妥当性検証を行う
 */

import { SYMBOL_CONFIG } from '@/constants';

/**
 * Symbol ネットワーク設定インターフェース
 */
export interface SymbolNetworkConfig {
  nodeUrl: string;
  networkType: number;
  epochAdjustment: number;
  currencyMosaicId: string;
  maxFee: number;
  deadlineHours: number;
}

/**
 * デフォルト設定を取得
 * 環境変数が設定されていない場合は定数から取得
 */
export function getDefaultConfig(): SymbolNetworkConfig {
  return {
    nodeUrl: SYMBOL_CONFIG.NODE_URL,
    networkType: SYMBOL_CONFIG.NETWORK_TYPE,
    epochAdjustment: SYMBOL_CONFIG.EPOCH_ADJUSTMENT,
    currencyMosaicId: SYMBOL_CONFIG.CURRENCY_MOSAIC_ID,
    maxFee: SYMBOL_CONFIG.TRANSACTION.MAX_FEE,
    deadlineHours: SYMBOL_CONFIG.TRANSACTION.DEADLINE_HOURS,
  };
}

/**
 * カスタム設定を検証
 */
export function validateConfig(config: SymbolNetworkConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // ノードURLの検証
  if (!config.nodeUrl || !config.nodeUrl.startsWith('http')) {
    errors.push('無効なノードURL');
  }

  // ネットワークタイプの検証（104=MAINNET, 152=TESTNET）
  if (![104, 152].includes(config.networkType)) {
    errors.push('無効なネットワークタイプ（104 or 152のみ）');
  }

  // エポックアジャストメントの検証
  if (config.epochAdjustment <= 0) {
    errors.push('無効なエポックアジャストメント');
  }

  // 最大手数料の検証
  if (config.maxFee <= 0) {
    errors.push('無効な最大手数料');
  }

  // デッドライン時間の検証
  if (config.deadlineHours <= 0 || config.deadlineHours > 48) {
    errors.push('デッドラインは1-48時間の範囲で指定してください');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 現在の設定を取得（検証済み）
 */
export function getValidatedConfig(): SymbolNetworkConfig {
  const config = getDefaultConfig();
  const validation = validateConfig(config);

  if (!validation.isValid) {
    console.error('設定エラー:', validation.errors);
    throw new Error(`設定が無効です: ${validation.errors.join(', ')}`);
  }

  return config;
}

/**
 * ネットワーク名を取得
 */
export function getNetworkName(networkType: number): string {
  switch (networkType) {
    case 104:
      return 'メインネット';
    case 152:
      return 'テストネット';
    default:
      return '不明なネットワーク';
  }
}

/**
 * 設定情報をログ出力（デバッグ用）
 */
export function logConfig(config: SymbolNetworkConfig): void {
  console.log('=== Symbol Network Configuration ===');
  console.log(`ノードURL: ${config.nodeUrl}`);
  console.log(`ネットワーク: ${getNetworkName(config.networkType)} (${config.networkType})`);
  console.log(`エポック調整: ${config.epochAdjustment}`);
  console.log(`最大手数料: ${config.maxFee} μXYM`);
  console.log(`デッドライン: ${config.deadlineHours}時間`);
  console.log('===================================');
}
