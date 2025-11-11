# SSS Extension統合ガイド（symproof-tree向け）

## 概要

このドキュメントは、symproof-treeプロジェクトにSSS Extensionを統合する具体的な手順を示します。

**重要**: このプロジェクトではDAO機能は実装しません。TransferTransaction（学習記録）の署名のみを行います。

---

## 目次

1. [統合方針](#統合方針)
2. [依存関係の追加](#依存関係の追加)
3. [実装手順](#実装手順)
4. [コンポーネント統合](#コンポーネント統合)
5. [エラーハンドリング](#エラーハンドリング)
6. [テスト方法](#テスト方法)

---

## 統合方針

### このプロジェクトで使用するSSS Extension機能

| 機能 | 使用 | 用途 |
|------|------|------|
| `isAllowedSSS()` | ✅ | SSS Extension接続確認 |
| `getActiveAddress()` | ✅ | ユーザーのSymbolアドレス取得 |
| `getActivePublicKey()` | ✅ | ユーザーの公開鍵取得 |
| `getActiveName()` | ✅ | ユーザーのアカウント名取得 |
| `setTransactionByPayload()` | ✅ | トランザクションをSSS Extensionにセット |
| `requestSignTransaction()` | ✅ | TransferTransactionの署名リクエスト |
| `requestSignCosignatureTransaction()` | ❌ | **使用しない**（DAO/マルチシグ用） |

### トランザクション構造

**使用するトランザクションタイプ**: `TransferTransaction`のみ

- 自己宛メッセージトランザクション
- モザイク転送なし
- メッセージに学習記録のメタデータを含める

**❌ 使用しないトランザクションタイプ**:
- `AggregateCompleteTransaction`（複数トランザクションの集約、DAO用）
- `MultisigAccountModificationTransaction`（マルチシグ設定）
- `MosaicDefinitionTransaction`（トークン発行）

---

## 依存関係の追加

### 1. パッケージインストール

```bash
npm install sss-module
npm install symbol-sdk@3
```

### 2. package.jsonの確認

```json
{
  "dependencies": {
    "sss-module": "^1.0.4",
    "symbol-sdk": "^3.2.2",
    "symbol-crypto-wasm-web": "^0.1.1"
  }
}
```

---

## 実装手順

### Step 1: Symbol Wallet統合モジュールの作成

**ファイル**: `src/lib/symbol/wallet.ts`

```typescript
import {
  isAllowedSSS,
  getActiveAddress,
  getActivePublicKey,
  getActiveName,
  setTransactionByPayload,
  requestSignTransaction
} from 'sss-module';

/**
 * SSS Extension接続確認
 */
export function checkWalletConnection(): boolean {
  return isAllowedSSS();
}

/**
 * ユーザーアドレス取得
 * @throws Error SSS Extension未接続の場合
 */
export function getUserAddress(): string {
  if (!isAllowedSSS()) {
    throw new Error('SSS Extension not connected. Please right-click and connect.');
  }
  return getActiveAddress();
}

/**
 * ユーザー公開鍵取得
 * @throws Error SSS Extension未接続の場合
 */
export function getUserPublicKey(): string {
  if (!isAllowedSSS()) {
    throw new Error('SSS Extension not connected. Please right-click and connect.');
  }
  return getActivePublicKey();
}

/**
 * ユーザー名取得（オプション）
 */
export function getUserName(): string {
  if (!isAllowedSSS()) {
    return 'Guest';
  }
  return getActiveName();
}

/**
 * TransferTransactionの署名リクエスト
 * @param payload - トランザクションのhexペイロード
 * @returns 署名済みトランザクション情報
 */
export async function signTransactionWithSSS(payload: string): Promise<{
  payload: string;
  hash: string;
  signerPublicKey: string;
}> {
  if (!isAllowedSSS()) {
    throw new Error('SSS Extension not connected');
  }

  // SSS Extensionにトランザクションをセット
  setTransactionByPayload(payload);

  // ユーザーに署名をリクエスト
  const signedTx = await requestSignTransaction();

  return signedTx;
}
```

---

### Step 2: トランザクション作成関数の実装

**ファイル**: `src/lib/symbol/transaction.ts`

```typescript
import { utils } from 'symbol-sdk';
import {
  models,
  Network,
  SymbolFacade,
  Address,
  PlainMessage
} from 'symbol-sdk/symbol';
import { signTransactionWithSSS } from './wallet';
import { Config } from '@/constants';
import type { LearningRecord, SymbolTransactionPayload } from '@/types';

/**
 * 学習記録用のTransferTransactionを作成
 * @param record - 学習記録
 * @param userAddress - ユーザーのSymbolアドレス
 * @returns TransferTransaction
 */
export function createLearningRecordTransaction(
  record: LearningRecord,
  userAddress: string
): models.TransferTransaction {
  const facade = new SymbolFacade(Network.TESTNET);

  // ペイロード作成
  const payload: SymbolTransactionPayload = {
    type: 'learning_record',
    version: '1.0',
    id: record.id,
    contentHash: record.contentHash,
    timestamp: record.createdAt,
    metadata: {
      title: record.title,
      duration: record.duration,
      understanding: record.understanding,
      tags: record.tags
    }
  };

  const payloadJson = JSON.stringify(payload);

  // TransferTransaction作成（自己宛）
  const recipientAddress = new Address(userAddress);

  const transferTx = facade.createTransferTransaction(
    recipientAddress,  // 自己宛
    [],                // モザイク転送なし
    payloadJson,       // メッセージ
    Config.FEE_MULTIPLIER,
    Config.DEADLINE_SECONDS
  );

  return transferTx;
}

/**
 * ブロックチェーンに学習記録を記録
 * @param record - 学習記録
 * @param userAddress - ユーザーのSymbolアドレス
 * @returns トランザクションハッシュ
 */
export async function recordToBlockchain(
  record: LearningRecord,
  userAddress: string
): Promise<string> {
  // 1. TransferTransaction作成
  const transferTx = createLearningRecordTransaction(record, userAddress);

  // 2. hexペイロードに変換
  const txPayload = utils.uint8ToHex(transferTx.serialize());

  // 3. SSS Extensionで署名
  const signedTx = await signTransactionWithSSS(txPayload);

  // 4. ブロードキャスト
  const jsonPayload = `{"payload":"${signedTx.payload}"}`;

  const response = await fetch(new URL('/transactions', Config.NODE_URL), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: jsonPayload
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Transaction broadcast failed: ${error.message || 'Unknown error'}`);
  }

  // 5. トランザクションハッシュを返す
  return signedTx.hash;
}
```

---

### Step 3: 定数の設定

**ファイル**: `src/constants/index.ts`

```typescript
export const Config = {
  // Symbol Blockchain
  NETWORK: process.env.NEXT_PUBLIC_SYMBOL_NETWORK_TYPE || 'testnet',
  NODE_URL: process.env.NEXT_PUBLIC_SYMBOL_NODE_URL || 'https://sym-test-03.opening-line.jp:3001',
  GENERATION_HASH: process.env.NEXT_PUBLIC_SYMBOL_GENERATION_HASH || '49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4',

  // Transaction Settings
  FEE_MULTIPLIER: 100,        // 手数料倍率
  DEADLINE_SECONDS: 7200,     // デッドライン（2時間）

  // Polling
  POLLING_INTERVAL: 3000,     // ポーリング間隔（3秒）
  POLLING_TIMEOUT: 60000,     // タイムアウト（60秒）

  // Google AI
  AI_API_ENDPOINT: '/api/summarize',
};
```

---

## コンポーネント統合

### ConfirmationModal.tsxへの統合

**ファイル**: `src/components/ConfirmationModal.tsx`

```typescript
import React, { useState } from 'react';
import { checkWalletConnection, getUserAddress } from '@/lib/symbol/wallet';
import { recordToBlockchain } from '@/lib/symbol/transaction';
import { calculateContentHash } from '@/lib/utils/hash';
import type { LearningRecord } from '@/types';

interface ConfirmationModalProps {
  record: LearningRecord;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (txHash: string) => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  record,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. SSS Extension接続確認
      if (!checkWalletConnection()) {
        throw new Error('SSS Extensionと連携してください。画面を右クリックして接続してください。');
      }

      // 2. ユーザーアドレス取得
      const userAddress = getUserAddress();

      // 3. コンテンツハッシュ計算（未計算の場合）
      if (!record.contentHash) {
        record.contentHash = await calculateContentHash(record);
      }

      // 4. ブロックチェーンに記録
      const txHash = await recordToBlockchain(record, userAddress);

      // 5. 成功コールバック
      onConfirm(txHash);

    } catch (err: any) {
      console.error('Transaction error:', err);

      // エラーメッセージを設定
      if (err.message.includes('User rejected')) {
        setError('トランザクションがキャンセルされました');
      } else if (err.message.includes('SSS Extension not connected')) {
        setError('SSS Extensionと連携してください');
      } else if (err.message.includes('Insufficient balance')) {
        setError('XYM残高が不足しています。Faucetから取得してください。');
      } else {
        setError(`トランザクションの送信に失敗しました: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>学習記録の確認</h2>

        {/* 記録詳細表示（読み取り専用） */}
        <div className="record-details">
          <div className="field">
            <label>タイトル:</label>
            <span>{record.title}</span>
          </div>
          <div className="field">
            <label>URL:</label>
            <span>{record.url}</span>
          </div>
          <div className="field">
            <label>学習時間:</label>
            <span>{record.duration}分</span>
          </div>
          <div className="field">
            <label>理解度:</label>
            <span>{record.understanding}/5</span>
          </div>
          <div className="field">
            <label>タグ:</label>
            <span>{record.tags.join(', ')}</span>
          </div>
          <div className="field">
            <label>メモ:</label>
            <span>{record.note}</span>
          </div>
          <div className="field">
            <label>コンテンツハッシュ:</label>
            <code>{record.contentHash}</code>
          </div>
        </div>

        {/* 警告メッセージ */}
        <div className="warning">
          ⚠️ 記録後は変更できません
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* アクションボタン */}
        <div className="modal-actions">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="btn-cancel"
          >
            キャンセル
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="btn-confirm"
          >
            {isSubmitting ? '処理中...' : 'ブロックチェーンに記録する'}
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

### Home.tsxでのSSS接続確認

**ファイル**: `src/app/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { checkWalletConnection, getUserAddress, getUserName } from '@/lib/symbol/wallet';
import { PendingRecords } from '@/components/PendingRecords';
import { ConfirmedRecords } from '@/components/ConfirmedRecords';

export default function HomePage() {
  const [isSSSConnected, setIsSSSConnected] = useState(false);
  const [userName, setUserName] = useState('Guest');
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    // SSS Extension接続確認
    const connected = checkWalletConnection();
    setIsSSSConnected(connected);

    if (connected) {
      setUserName(getUserName());
      setUserAddress(getUserAddress());
    }
  }, []);

  return (
    <div className="container">
      <h1>symproof-tree</h1>

      {/* SSS Extension接続状態 */}
      {isSSSConnected ? (
        <div className="user-info">
          <p>👤 {userName}</p>
          <p className="address">{userAddress}</p>
        </div>
      ) : (
        <div className="sss-warning">
          <h3>⚠️ SSS Extensionと連携してください</h3>
          <p>画面を右クリックして「SSS Extension」を選択し、連携してください。</p>
          <p>
            SSS Extensionをインストールしていない場合は
            <a
              href="https://chromewebstore.google.com/detail/sss-extension/llildiojemakefgnhhkmiiffonembcan"
              target="_blank"
              rel="noopener noreferrer"
            >
              こちらからインストール
            </a>
          </p>
        </div>
      )}

      {/* タブ */}
      <div className="tabs">
        <button className="tab active">Pending Records</button>
        <button className="tab">Confirmed Records</button>
      </div>

      {/* コンテンツ */}
      <div className="content">
        <PendingRecords />
        {/* <ConfirmedRecords /> */}
      </div>
    </div>
  );
}
```

---

## エラーハンドリング

### 主要なエラーケース

#### 1. SSS Extension未接続

```typescript
try {
  const address = getUserAddress();
} catch (error) {
  console.error(error);
  alert('SSS Extensionと連携してください。画面を右クリックして接続してください。');
}
```

#### 2. ユーザーが署名を拒否

```typescript
try {
  const signedTx = await signTransactionWithSSS(payload);
} catch (error) {
  if (error.message.includes('User rejected') || error.message.includes('cancelled')) {
    alert('トランザクションがキャンセルされました');
  }
}
```

#### 3. 残高不足

```typescript
try {
  await recordToBlockchain(record, userAddress);
} catch (error) {
  if (error.message.includes('Insufficient balance')) {
    alert('XYM残高が不足しています。Faucetから取得してください。');
  }
}
```

#### 4. ネットワークエラー

```typescript
try {
  await recordToBlockchain(record, userAddress);
} catch (error) {
  if (error.message.includes('network') || error.message.includes('fetch')) {
    alert('ネットワークエラーが発生しました。インターネット接続を確認してください。');
  }
}
```

---

## テスト方法

### 1. SSS Extension接続テスト

```typescript
// ブラウザコンソールで実行
import { checkWalletConnection, getUserAddress } from '@/lib/symbol/wallet';

console.log('Connected:', checkWalletConnection());
console.log('Address:', getUserAddress());
```

### 2. トランザクション作成テスト

```typescript
import { createLearningRecordTransaction } from '@/lib/symbol/transaction';

const mockRecord: LearningRecord = {
  id: 'test-001',
  userId: 'demo-user',
  url: 'https://nextjs.org/docs',
  title: 'Next.js Documentation',
  tags: ['Next.js'],
  duration: 45,
  understanding: 4,
  note: 'Test note',
  createdAt: new Date().toISOString(),
  contentHash: 'a'.repeat(64),
  proofStatus: 'pending',
  summaryStatus: 'none'
};

const userAddress = getUserAddress();
const tx = createLearningRecordTransaction(mockRecord, userAddress);

console.log('Transaction:', tx);
```

### 3. 署名テスト

```typescript
// 実際にSSS Extensionで署名をリクエスト
const txPayload = utils.uint8ToHex(tx.serialize());
const signedTx = await signTransactionWithSSS(txPayload);

console.log('Signed Transaction:', signedTx);
console.log('Hash:', signedTx.hash);
```

---

## トラブルシューティング

### Q1: SSS Extensionが検出されない

**A**: 以下を確認してください：
1. ブラウザ拡張がインストールされているか
2. 拡張が有効になっているか
3. ページをリロードしたか
4. 右クリックメニューから「Connect to SSS Extension」を実行したか

### Q2: 署名画面が表示されない

**A**: 以下を確認してください：
1. SSS Extensionがインストールされているか
2. ポップアップブロッカーが有効になっていないか
3. 別のタブでSSS Extensionウィンドウが開いていないか

### Q3: トランザクションが失敗する

**A**: 以下を確認してください：
1. XYM残高が十分か（最低10 XYM推奨）
2. ネットワーク接続が安定しているか
3. Symbol Testnetが稼働しているか（[Symbol Explorer](https://testnet.symbol.fyi/)で確認）

---

## まとめ

このガイドに従うことで、symproof-treeプロジェクトにSSS Extensionを正しく統合できます。

### 重要なポイント

1. **TransferTransactionのみ使用** - DAO関連の複雑なトランザクションは不要
2. **シンプルな署名フロー** - `requestSignTransaction()`のみで完結
3. **適切なエラーハンドリング** - ユーザー体験を損なわない
4. **SSS未接続時のガイダンス** - 明確な指示を表示

---

**参考リンク**:
- [SSS Extension ドキュメント](https://docs.sss-symbol.com/)
- [Symbol SDK v3 ドキュメント](https://docs.symbol.dev/)
- [Symbol Testnet Explorer](https://testnet.symbol.fyi/)
