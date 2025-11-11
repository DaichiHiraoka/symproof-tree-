/**
 * Symbol SDK v3 Facade 初期化
 *
 * 設計方針:
 * - Symbol SDK v3の基本的な初期化のみ
 * - クライアントサイドではSSS Extensionを優先使用
 * - トランザクション作成とハッシュ計算に使用
 */

import { SymbolFacade } from 'symbol-sdk/symbol';
import { getValidatedConfig } from './config';

let facade: SymbolFacade | null = null;

/**
 * SymbolFacadeを初期化
 */
export function initializeFacade(): SymbolFacade {
  if (facade) {
    return facade;
  }

  const config = getValidatedConfig();

  // ネットワークタイプに基づいて初期化
  // 152 = testnet, 104 = mainnet
  const network = config.networkType === 152 ? 'testnet' : 'mainnet';

  facade = new SymbolFacade(network);
  return facade;
}

/**
 * 初期化済みのFacadeを取得
 */
export function getFacade(): SymbolFacade {
  if (!facade) {
    return initializeFacade();
  }
  return facade;
}

/**
 * Facadeをリセット（テスト用）
 */
export function resetFacade(): void {
  facade = null;
}
