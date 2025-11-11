# SSS Extension 実装ガイド

## 概要

このドキュメントは、`sssAndDaoExample`ディレクトリの実装例を基に、SSS Extension（sss-module）を使用したSymbolブロックチェーンアプリケーション開発における正しい使い方とベストプラクティスをまとめたものです。

## 目次

1. [プロジェクト構成](#プロジェクト構成)
2. [SSS Extension とは](#sss-extension-とは)
3. [基本的な実装パターン](#基本的な実装パターン)
4. [主要な使用例](#主要な使用例)
5. [サーバーサイドの実装](#サーバーサイドの実装)
6. [ベストプラクティス](#ベストプラクティス)

---

## プロジェクト構成

```
sssAndDaoExample/
├── client/              # フロントエンド（React + TypeScript + Vite）
│   ├── src/
│   │   ├── pages/      # ページコンポーネント
│   │   ├── components/ # 共通コンポーネント
│   │   └── utils/      # ユーティリティ関数
│   └── package.json    # sss-module: ^1.0.4
└── server/              # バックエンド（Hono + TypeScript）
    ├── src/
    │   ├── routes/     # APIルート
    │   ├── functions/  # トランザクション生成関数
    │   └── info/       # ブロックチェーン情報取得
    └── package.json    # symbol-sdk: ^3.2.2
```

---

## SSS Extension とは

**SSS Extension**は、Symbolブロックチェーン向けのブラウザ拡張機能であり、ユーザーがブラウザから安全にトランザクションに署名できるようにするウォレット機能を提供します。

### 主な特徴

- ユーザーの秘密鍵をブラウザ拡張内で安全に管理
- Webアプリケーションからトランザクション署名をリクエスト可能
- アカウント情報（アドレス、公開鍵、アカウント名）の取得
- Chrome Web Storeからインストール可能

### 依存パッケージ

**クライアント側（package.json）:**
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

## 基本的な実装パターン

### 1. SSS Extension の連携確認

ユーザーがSSS Extensionと連携しているかを確認する基本パターンです。

**実装例: `client/src/pages/DAO/Home.tsx`**

```typescript
import { getActiveAddress, getActiveName, isAllowedSSS } from "sss-module"

const [isSSSLinked, setIsSSSLinked] = useState<boolean>(false)
const [username, setUsername] = useState<string>("")

useEffect(() => {
  const isSSSLinked = isAllowedSSS()
  const address = isSSSLinked ? getActiveAddress() : ""
  const name = isSSSLinked ? getActiveName() : "ゲスト"

  setIsSSSLinked(isSSSLinked)
  setUsername(name)
}, [])
```

**主要な関数:**
- `isAllowedSSS()`: SSS Extensionとの連携状態を確認
- `getActiveAddress()`: 連携中のアカウントのアドレスを取得
- `getActiveName()`: 連携中のアカウントの名前を取得
- `getActivePublicKey()`: 連携中のアカウントの公開鍵を取得

---

### 2. トランザクション署名の基本フロー

SSS Extensionを使用したトランザクション署名の典型的なパターンです。

**実装例: `client/src/pages/DAO/Create.tsx`**

```typescript
import {
  setTransactionByPayload,
  requestSignCosignatureTransaction,
  getActivePublicKey,
} from "sss-module"
import { utils } from "symbol-sdk"
import { models, Network, SymbolFacade } from "symbol-sdk/symbol"

const sign = async () => {
  // 1. ユーザーの公開鍵を取得
  const ownerPublicKey = getActivePublicKey()

  // 2. サーバーからトランザクションペイロードを取得
  const { payload, daoId } = await fetch(`${Config.API_HOST}/admin/new`, {
    method: "POST",
    body: JSON.stringify({
      daoName: name,
      ownerPublicKey,
    }),
  }).then((response) => response.json())

  // 3. ペイロードをデシリアライズ
  const tx = models.AggregateCompleteTransactionV2.deserialize(
    utils.hexToUint8(payload),
  )

  // 4. SSS Extensionにトランザクションをセット
  setTransactionByPayload(payload)

  // 5. ユーザーに署名をリクエスト
  const cosignedTx = await requestSignCosignatureTransaction()

  // 6. 連署名（Cosignature）を追加
  const cosignature = new models.Cosignature()
  cosignature.signature.bytes = utils.hexToUint8(cosignedTx.signature)
  cosignature.signerPublicKey.bytes = utils.hexToUint8(
    cosignedTx.signerPublicKey,
  )
  tx.cosignatures.push(cosignature)

  // 7. トランザクションをシリアライズして送信
  const jsonPayload = `{"payload":"${utils.uint8ToHex(tx.serialize())}"}`

  const sendRes = await fetch(new URL("/transactions", Config.NODE_URL), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: jsonPayload,
  }).then((res) => res.json())
}
```

**フローの詳細:**

1. **公開鍵の取得**: `getActivePublicKey()`でユーザーの公開鍵を取得
2. **ペイロード取得**: サーバーサイドで生成された署名済みトランザクションペイロードを取得
3. **デシリアライズ**: hexペイロードをトランザクションオブジェクトに変換
4. **トランザクションセット**: `setTransactionByPayload()`でSSS Extensionにトランザクションを渡す
5. **署名リクエスト**: `requestSignCosignatureTransaction()`でユーザーに署名を求める
6. **連署名追加**: 返却された署名情報をトランザクションのcosignaturesに追加
7. **ブロードキャスト**: 完成したトランザクションをSymbolノードに送信

---

## 主要な使用例

### 使用例1: DAO作成（アグリゲートコンプリートトランザクション）

**参照: `client/src/pages/DAO/Create.tsx`**

**ユースケース:**
- 複数のインナートランザクションを含むアグリゲートトランザクション
- サーバー側で事前署名、クライアント側でユーザーが連署名

**特徴:**
- マルチシグアカウント作成
- モザイク（トークン）生成
- メタデータ登録
- これらすべてを1つのアグリゲートトランザクションで実行

---

### 使用例2: ガバナンス投票

**参照: `client/src/pages/GovernanceVoting/index.tsx`**

**ユースケース:**
- ユーザーが保有するガバナンストークンを使用して投票
- 投票先アカウントにトークンを送信することで投票を記録

**特徴:**
```typescript
const vote = async (i: number) => {
  const v = metadatas[i]
  const mosaicId = BigInt(votes[index].token).toString(16).toUpperCase()
  const mosaic = voteMosaics.find((m) => m.id === mosaicId)

  // サーバーから投票用トランザクションを取得
  const { payload } = await fetch(`${Config.API_HOST}/governance/vote`, {
    method: "POST",
    body: JSON.stringify({
      daoId: id,
      token: votes[index].token,
      publicKey: v.value,
      userKey: getActivePublicKey(),
      amount: mosaic.amount,
    }),
  }).then((res) => res.json())

  // SSS Extensionで署名
  const tx = models.AggregateCompleteTransactionV2.deserialize(
    utils.hexToUint8(payload),
  )
  setTransactionByPayload(payload)
  const cosignedTx = await requestSignCosignatureTransaction()

  // ... 連署名追加とブロードキャスト
}
```

---

### 使用例3: 特別会員向けテーマ設定

**参照: `client/src/pages/Limited/index.tsx`**

**ユースケース:**
- NFTホルダー限定機能
- メタデータを使用したテーマ設定の保存

**特徴:**
```typescript
const handleSaveTheme = async () => {
  // サーバーからメタデータ更新トランザクションを取得
  const { payload } = await fetch(`${Config.API_HOST}/limited/theme/update`, {
    method: "PUT",
    body: JSON.stringify({
      publicKey: getActivePublicKey(),
      themeName: selectedTheme,
    }),
  }).then((res) => res.json())

  // 署名と送信
  const tx = models.AggregateCompleteTransactionV2.deserialize(
    utils.hexToUint8(payload),
  )
  setTransactionByPayload(payload)
  const cosignedTx = await requestSignCosignatureTransaction()

  // ... 連署名追加とブロードキャスト
}
```

---

## サーバーサイドの実装

### 1. トランザクション生成の責務分離

サーバー側では、トランザクションの生成と事前署名を行い、クライアントにペイロードを返します。

**実装例: `server/src/routes/admin/createDao.ts`**

```typescript
import { PrivateKey, PublicKey, utils } from "symbol-sdk"
import {
  descriptors,
  models,
  SymbolFacade,
} from "symbol-sdk/symbol"

export const createDao = async (c: Context) => {
  const ENV = env<{ PRIVATE_KEY: string }>(c)
  const { daoName, ownerPublicKey } = await c.req.json()

  const facade = new SymbolFacade(Config.NETWORK)
  const masterAccount = facade.createAccount(new PrivateKey(ENV.PRIVATE_KEY))
  const ownerAccount = facade.createPublicAccount(new PublicKey(ownerPublicKey))

  // DAOアカウント生成
  const daoAccount = generateAccount()

  // トランザクション作成
  const txs = [
    { transaction: transferDes, signer: masterAccount.publicKey },
    { transaction: createGovTokenDes.mosaicDefinitionDescriptor, signer: daoAccount.publicKey },
    { transaction: createGovTokenDes.mosaicSupplyChangeDescriptor, signer: daoAccount.publicKey },
    { transaction: daoAccountMultisigDes, signer: daoAccount.publicKey },
    // ... メタデータトランザクション
  ]

  // アグリゲートトランザクション作成
  const innerTxs = txs.map((tx) =>
    facade.createEmbeddedTransactionFromTypedDescriptor(
      tx.transaction,
      tx.signer,
    ),
  )
  const txHash = SymbolFacade.hashEmbeddedTransactions(innerTxs)
  const aggregateDes = new descriptors.AggregateCompleteTransactionV2Descriptor(
    txHash,
    innerTxs
  )

  const aggregateTx = models.AggregateCompleteTransactionV2.deserialize(
    facade.createTransactionFromTypedDescriptor(
      aggregateDes,
      masterAccount.publicKey,
      Config.FEE_MULTIPLIER,
      Config.DEADLINE_SECONDS,
    ).serialize(),
  )

  // マスターアカウントで署名
  signTransaction(masterAccount, aggregateTx)

  // DAOアカウントで連署名
  const cosign = facade.cosignTransaction(daoAccount.keyPair, aggregateTx)
  aggregateTx.cosignatures.push(cosign)

  // クライアントにペイロードを返す
  return c.json({
    payload: utils.uint8ToHex(aggregateTx.serialize()),
    daoId: daoAccount.publicKey.toString(),
  })
}
```

**ポイント:**
- サーバー側で複雑なトランザクションロジックを処理
- 必要な署名（マスター、DAO）を事前に追加
- クライアントはユーザー署名のみを担当
- ペイロードとして返却することでクライアント実装をシンプルに保つ

---

### 2. トランザクション署名ユーティリティ

**実装例: `server/src/functions/signTransaction.ts`**

```typescript
import { SymbolFacade, type models, type SymbolAccount } from "symbol-sdk/symbol"

export const signTransaction = (
  account: SymbolAccount,
  transaction: models.Transaction,
) => {
  const facade = new SymbolFacade(Config.NETWORK)
  const signature = account.signTransaction(transaction)
  const jsonPayload = facade.transactionFactory.static.attachSignature(
    transaction,
    signature,
  )
  const hash = facade.hashTransaction(transaction)

  return { hash, jsonPayload }
}
```

---

## ベストプラクティス

### 1. セキュリティ

#### ✅ DO: 秘密鍵はサーバーサイドでのみ管理

```typescript
// サーバー側 (.env)
PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE

// サーバー側コード
const masterAccount = facade.createAccount(new PrivateKey(ENV.PRIVATE_KEY))
```

#### ❌ DON'T: クライアント側に秘密鍵を含めない

```typescript
// ❌ 絶対にこれをしない
const privateKey = "1234567890ABCDEF..." // クライアントコードに秘密鍵を含める
```

---

### 2. トランザクションフロー

#### ✅ DO: サーバー側でトランザクションを生成し、クライアントで署名

```typescript
// サーバー側: トランザクション生成と事前署名
const payload = createAndSignTransaction(...)
return { payload }

// クライアント側: ユーザー署名のみ
setTransactionByPayload(payload)
const signed = await requestSignCosignatureTransaction()
```

#### ✅ DO: エラーハンドリングを実装

```typescript
try {
  const cosignedTx = await requestSignCosignatureTransaction()
  // ... トランザクション送信
} catch (error) {
  console.error("署名がキャンセルされました:", error)
  alert("トランザクションがキャンセルされました")
}
```

---

### 3. ユーザー体験

#### ✅ DO: SSS Extension未連携時のガイダンスを表示

```typescript
{!isSSSLinked ? (
  <div>
    <p>画面を右クリックしてSSS Extensionと連携してください。</p>
    <p>
      SSS Extensionをインストールしていない場合は
      <a href="https://chromewebstore.google.com/detail/sss-extension/...">
        こちら
      </a>
    </p>
  </div>
) : (
  // 通常のコンテンツ
)}
```

#### ✅ DO: トランザクション送信中はローディング状態を表示

```typescript
const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

const handleSubmit = async () => {
  setIsSubmitting(true)
  try {
    // ... トランザクション処理
  } finally {
    setIsSubmitting(false)
  }
}
```

---

### 4. アーキテクチャ

#### ✅ DO: 責務を明確に分離

**クライアント側の責務:**
- ユーザーインターフェース
- SSS Extensionとの連携
- ユーザー署名の取得
- トランザクションのブロードキャスト

**サーバー側の責務:**
- トランザクションロジック
- 複雑なトランザクションの組み立て
- マスターアカウントでの署名
- ビジネスロジックの実装

---

### 5. コード再利用

#### ✅ DO: 共通のトランザクション処理をユーティリティ化

```typescript
// utils/transaction.ts
export const signAndBroadcastTransaction = async (
  payload: string,
  nodeUrl: string
) => {
  const tx = models.AggregateCompleteTransactionV2.deserialize(
    utils.hexToUint8(payload)
  )

  setTransactionByPayload(payload)
  const cosignedTx = await requestSignCosignatureTransaction()

  const cosignature = new models.Cosignature()
  cosignature.signature.bytes = utils.hexToUint8(cosignedTx.signature)
  cosignature.signerPublicKey.bytes = utils.hexToUint8(cosignedTx.signerPublicKey)
  tx.cosignatures.push(cosignature)

  const jsonPayload = `{"payload":"${utils.uint8ToHex(tx.serialize())}"}`

  return await fetch(new URL("/transactions", nodeUrl), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: jsonPayload,
  })
}
```

---

## まとめ

SSS Extensionを使用することで、ユーザーの秘密鍵を安全に管理しながら、ブロックチェーンアプリケーションを構築できます。

**重要なポイント:**

1. **セキュリティ第一**: 秘密鍵はサーバーサイドまたはSSS Extension内でのみ管理
2. **責務の分離**: サーバー側でトランザクション生成、クライアント側でユーザー署名
3. **ユーザー体験**: SSS Extension未連携時の適切なガイダンスとエラーハンドリング
4. **コードの再利用性**: 共通処理をユーティリティ関数として抽出

このガイドを参考に、安全で使いやすいSymbolブロックチェーンアプリケーションを開発してください。

---

## 参考リンク

- [SSS Extension Chrome Web Store](https://chromewebstore.google.com/detail/sss-extension/llildiojemakefgnhhkmiiffonembcan)
- [SSS Extension ドキュメント](https://docs.sss-symbol.com/)
- [Symbol SDK ドキュメント](https://docs.symbol.dev/)
