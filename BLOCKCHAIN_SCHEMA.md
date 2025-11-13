# ブロックチェーン記録スキーマ

このドキュメントでは、学習記録がSymbol Blockchainにどのように記録されるか、そして記録されたデータをどのように確認するかを説明します。

## 記録スキーマ

### トランザクション形式
- **トランザクションタイプ**: `TransferTransaction` (0x4154 / 16724)
- **送信先**: 自分自身のアドレス（self-transfer）
- **モザイク（送金）**: なし（金額0）
- **メッセージ**: プレーンメッセージ（JSON形式の学習記録）

### メッセージペイロード構造

学習記録はJSON形式でトランザクションのメッセージフィールドに記録されます。

```json
{
  "type": "learning_record",
  "url": "https://example.com/learning-page",
  "title": "学習記事のタイトル",
  "startTime": "2025-11-12T08:00:00.000Z",
  "endTime": "2025-11-12T08:30:00.000Z",
  "duration": 1800000,
  "contentHash": "a1b2c3d4e5f6..."
}
```

#### フィールド説明

| フィールド | 型 | 説明 |
|----------|-----|------|
| `type` | string | レコードタイプ（常に `"learning_record"`） |
| `url` | string | 学習したWebページのURL |
| `title` | string | Webページのタイトル |
| `startTime` | string (ISO 8601) | 学習開始時刻（UTC） |
| `endTime` | string (ISO 8601) | 学習終了時刻（UTC） |
| `duration` | number | 学習時間（ミリ秒） |
| `contentHash` | string | コンテンツのハッシュ値（一意性保証用） |

### メッセージエンコーディング

1. JSONオブジェクトを文字列化
2. UTF-8でバイト列に変換
3. 先頭に1バイトのメッセージタイプを追加（`0x00` = プレーンメッセージ）
4. Uint8Array形式でトランザクションに格納

```typescript
// コード例: lib/detection/autoDetect.ts:99-111
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
```

## 記録データの確認方法

### 方法1: アプリケーション内で確認

#### 1. 「確認済み」ページで確認
`/verified` ページにアクセスすると、ローカルに保存された確定済みレコードを確認できます。

- トランザクションハッシュ
- ブロック高
- 署名者アドレス
- 学習記録の詳細（URL、タイトル、時間）

#### 2. 検証機能を使用
`/verify` ページでトランザクションハッシュを入力すると、ブロックチェーンから直接データを取得して検証できます。

**手順**:
1. `/verified` ページで確認したいレコードのトランザクションハッシュをコピー
2. `/verify` ページにアクセス
3. トランザクションハッシュを入力して「検証」ボタンをクリック
4. ブロックチェーン上の生データとローカルデータの整合性を確認

### 方法2: Symbol Explorer（ブロックエクスプローラー）

#### テストネット用Explorer
https://testnet.symbol.fyi/

**確認手順**:
1. トランザクションハッシュをコピー
2. Explorerの検索バーにハッシュを貼り付け
3. トランザクション詳細ページで以下を確認:
   - **Transaction Type**: Transfer
   - **Message**: 学習記録のJSON（16進数→デコード）
   - **Block Height**: 確定されたブロック高
   - **Timestamp**: ブロックチェーン上のタイムスタンプ
   - **Signer**: 署名者の公開鍵/アドレス

#### メッセージのデコード方法
Explorerでは、メッセージが16進数文字列として表示されます。

**例**:
```
007b2274797065223a226c6561726e696e675f7265636f7264222c2275726c223a2268...
```

先頭の `00` がメッセージタイプ（プレーンメッセージ）、その後が実際のJSON文字列です。

**デコード手順**:
1. 先頭の `00` を除去
2. 残りの16進数文字列をUTF-8テキストに変換
3. JSONとしてパース

オンラインツール: https://gchq.github.io/CyberChef/

### 方法3: Symbol REST APIで直接取得

#### エンドポイント
```
GET https://sym-test-01.opening-line.jp:3001/transactions/confirmed/{transactionHash}
```

#### レスポンス例
```json
{
  "meta": {
    "hash": "ABC123...",
    "height": "1234567",
    "timestamp": "123456789000"
  },
  "transaction": {
    "type": 16724,
    "signerPublicKey": "DEF456...",
    "recipientAddress": "TBBBBBBBBB...",
    "message": "007b2274797065223a226c6561726e696e675f7265636f7264222c...",
    "mosaics": []
  }
}
```

#### curlコマンド例
```bash
curl -X GET "https://sym-test-01.opening-line.jp:3001/transactions/confirmed/YOUR_TX_HASH" \
  -H "Content-Type: application/json"
```

### 方法4: アプリケーション内の検証機能（プログラマティック）

コード内で検証する場合は、`lib/symbol/verify.ts` の関数を使用します。

```typescript
import { verifyTransaction } from '@/lib/symbol/verify';

const result = await verifyTransaction(transactionHash);

if (result.success && result.valid) {
  console.log('検証成功');
  console.log('ブロック高:', result.blockHeight);
  console.log('タイムスタンプ:', result.timestamp);
  console.log('メッセージ:', result.message);
  // result.message には以下が含まれる:
  // {
  //   type: 'learning_record',
  //   url: '...',
  //   title: '...',
  //   startTime: '...',
  //   endTime: '...',
  //   duration: 1800000,
  //   contentHash: '...'
  // }
}
```

## トランザクションの詳細情報

### ガス手数料（Fee）
- **設定値**: `config.maxFee` (デフォルト: 100000 microXYM = 0.1 XYM)
- 実際の手数料は、ノードの動的手数料乗数とトランザクションサイズに基づいて自動計算されます

### デッドライン（Deadline）
- **設定値**: トランザクション作成時刻 + 2時間
- トランザクションが有効な期限（この時間内にブロックに含まれる必要がある）

### ブロック確定時間
- Symbol Blockchainのブロック生成時間: 約30秒
- 通常、1〜2ブロック（30〜60秒）で確定
- Finalityは37ブロック後（約18.5分）で不可逆

## データの整合性検証

アプリケーションの `/verify` ページでは、以下の検証を実行します:

1. **トランザクション存在確認**: 指定されたハッシュのトランザクションがブロックチェーン上に存在するか
2. **メッセージデコード**: トランザクションのメッセージをJSON形式でデコードできるか
3. **ブロック確定確認**: トランザクションがブロックに含まれているか（`blockHeight > 0`）
4. **データ整合性**: ブロックチェーン上のデータとローカルに保存されたデータが一致するか

検証結果は以下の形式で返されます:

```typescript
interface VerificationResult {
  success: boolean;        // API呼び出しが成功したか
  valid: boolean;          // データが有効か
  txHash: string;          // トランザクションハッシュ
  blockHeight?: number;    // ブロック高
  timestamp?: Date;        // タイムスタンプ
  signerAddress?: string;  // 署名者アドレス
  message?: any;           // デコードされたメッセージ
  details?: {
    transactionFound: boolean;    // トランザクションが見つかったか
    messageDecoded: boolean;      // メッセージをデコードできたか
    blockConfirmed: boolean;      // ブロックに含まれているか
  };
}
```

## 実装ファイル

### スキーマ定義・生成
- `lib/detection/autoDetect.ts:99-111` - メッセージ生成ロジック
- `types/index.ts` - BrowsingSession型定義

### トランザクション作成
- `lib/symbol/sssSimple.ts:89-239` - TransferTransaction作成と署名
- `lib/symbol/workflowSimple.ts:47-203` - 送信ワークフロー全体

### 検証・取得
- `lib/symbol/verify.ts` - ブロックチェーンからのデータ取得と検証
- `lib/symbol/verify.ts:220-257` - メッセージデコードロジック

## ノード設定

現在の設定（`.env.local`）:
```bash
NEXT_PUBLIC_SYMBOL_NODE_URL=https://sym-test-01.opening-line.jp:3001
```

- **ネットワーク**: Symbol Testnet
- **Network Type**: 152 (TESTNET)
- **Epoch Adjustment**: 1667250467 秒（Symbol Testnetの開始時刻）

## セキュリティとプライバシー

### 公開されるデータ
ブロックチェーンは公開台帳のため、以下のデータは誰でも閲覧可能です:
- 学習したWebページのURL
- ページタイトル
- 学習開始・終了時刻
- 学習時間
- トランザクション署名者のアドレス

### 非公開のデータ
- ユーザーの個人情報（名前、メールアドレスなど）
- Webページの閲覧内容（URLとタイトルのみ記録）
- ローカルで管理されているレコードID

### 推奨事項
- 公開したくない学習記録は、ブロックチェーンへの登録前に削除してください
- `/pending` ページで確認後、登録するレコードを選択できます
