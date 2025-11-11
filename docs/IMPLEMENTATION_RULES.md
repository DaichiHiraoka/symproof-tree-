# 実装ルール（最優先事項）

## 📌 このドキュメントについて

**このファイルは実装時に最優先で守るべきルールを記載します。**

コードを生成・変更する際は、必ずこのファイルを確認し、ここに記載された内容を厳守してください。

---

## 🚫 除外機能

### DAO関連機能は実装しない

**理由**: このプロジェクト（symproof-tree）では学習記録管理のみを扱い、DAO（分散型自律組織）機能は不要

**除外する実装例**:
- DAO作成トランザクション
- マルチシグアカウント生成
- ガバナンストークン発行
- 投票機能
- メンバー管理

**実装するのは以下のみ**:
- ✅ 学習記録の作成
- ✅ TransferTransaction（自己宛）の署名
- ✅ ブロックチェーンへの記録
- ✅ 記録の検証

---

## 🎯 SSS Extension統合の方針

### 1. 使用する機能のみ

**このプロジェクトで必要なSSS Extension機能**:

```typescript
// ✅ 使用する
import {
  isAllowedSSS,        // SSS接続確認
  getActiveAddress,    // アドレス取得
  getActivePublicKey,  // 公開鍵取得
  setTransactionByPayload,  // トランザクションセット
  requestSignTransaction    // 署名リクエスト
} from 'sss-module';
```

**❌ 使用しない（DAO関連）**:
```typescript
// ❌ このプロジェクトでは使わない
import {
  requestSignCosignatureTransaction,  // 連署名（マルチシグ用）
  // その他のDAO関連関数
} from 'sss-module';
```

### 2. トランザクション構造

**使用するトランザクションタイプ**:
- `TransferTransaction`のみ（自己宛メッセージ）

**❌ 使用しないトランザクションタイプ**:
- `AggregateCompleteTransaction`（複数トランザクションの集約）
- `MultisigAccountModificationTransaction`（マルチシグ設定）
- `MosaicDefinitionTransaction`（トークン発行）
- その他のDAO関連トランザクション

---

## 💻 実装パターン

### TransferTransaction署名の正しいフロー

```typescript
// ✅ 正しい実装（このプロジェクト用）
import { utils } from 'symbol-sdk';
import { models, Network, SymbolFacade } from 'symbol-sdk/symbol';
import {
  isAllowedSSS,
  getActiveAddress,
  setTransactionByPayload,
  requestSignTransaction
} from 'sss-module';

export async function recordToBlockchain(record: LearningRecord) {
  // 1. SSS接続確認
  if (!isAllowedSSS()) {
    throw new Error('SSS Extension not connected');
  }

  // 2. トランザクション作成（クライアント側で生成）
  const facade = new SymbolFacade(Network.TESTNET);
  const address = getActiveAddress();

  // ペイロード作成
  const payload = {
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

  // TransferTransaction作成（自己宛）
  const transferTx = facade.createTransferTransaction(
    address,  // 自己宛
    [],       // モザイク転送なし
    JSON.stringify(payload),  // メッセージ
    Config.FEE_MULTIPLIER,
    Config.DEADLINE_SECONDS
  );

  // 3. SSS Extensionで署名リクエスト
  const txPayload = utils.uint8ToHex(transferTx.serialize());
  setTransactionByPayload(txPayload);
  const signedTx = await requestSignTransaction();

  // 4. ブロードキャスト
  const jsonPayload = `{"payload":"${signedTx.payload}"}`;
  const response = await fetch(new URL('/transactions', Config.NODE_URL), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: jsonPayload
  });

  return signedTx.hash;
}
```

### ❌ 使用しないパターン（DAO用）

```typescript
// ❌ このプロジェクトでは使わない（DAO用の複雑なトランザクション）
const aggregateTx = models.AggregateCompleteTransactionV2.deserialize(
  utils.hexToUint8(payload)
);

const cosignedTx = await requestSignCosignatureTransaction();  // ❌ DAO用

const cosignature = new models.Cosignature();
cosignature.signature.bytes = utils.hexToUint8(cosignedTx.signature);
tx.cosignatures.push(cosignature);  // ❌ DAO用
```

---

## 🔧 環境変数

### 必要な環境変数のみ

```bash
# ✅ 必要
NEXT_PUBLIC_SYMBOL_NETWORK_TYPE=testnet
NEXT_PUBLIC_SYMBOL_NODE_URL=https://sym-test-03.opening-line.jp:3001
NEXT_PUBLIC_SYMBOL_GENERATION_HASH=49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4
GOOGLE_AI_API_KEY=your-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ❌ DAO用なので不要
# MASTER_PRIVATE_KEY=...  # マスターアカウント（DAO管理用）
# DAO_ACCOUNT_PRIVATE_KEY=...  # DAO専用アカウント
```

---

## 📂 ディレクトリ構造

### 作成するファイル

```
src/
├── lib/
│   ├── symbol/
│   │   ├── client.ts          # ✅ Symbol SDK初期化
│   │   ├── transaction.ts     # ✅ TransferTransaction作成
│   │   ├── wallet.ts          # ✅ SSS Extension統合（NEW）
│   │   └── verify.ts          # ✅ 検証ロジック
│   ├── ai/
│   │   └── summarize.ts       # ✅ Gemini API
│   └── storage/
│       └── local.ts           # ✅ LocalStorage操作
```

### ❌ 作成しないファイル（DAO用）

```
src/
├── lib/
│   ├── symbol/
│   │   ├── dao.ts             # ❌ DAO管理
│   │   ├── multisig.ts        # ❌ マルチシグ
│   │   ├── mosaic.ts          # ❌ トークン発行
│   │   └── governance.ts      # ❌ ガバナンス投票
```

---

## 🎨 UI/UX要件

### SSS Extension未接続時の表示

```typescript
// ✅ 必ず実装
if (!isAllowedSSS()) {
  return (
    <div className="sss-connection-warning">
      <p>SSS Extensionと連携してください。</p>
      <a href="https://chrome.google.com/webstore/detail/sss-extension/..."
         target="_blank" rel="noopener noreferrer">
        SSS Extensionをインストール
      </a>
    </div>
  );
}
```

### ローディング状態

```typescript
// ✅ 署名待機中の表示
const [isSigning, setIsSigning] = useState(false);

const handleSign = async () => {
  setIsSigning(true);
  try {
    await recordToBlockchain(record);
  } finally {
    setIsSigning(false);
  }
};
```

---

## 🚨 エラーハンドリング

### 必須のエラーハンドリング

```typescript
try {
  const txHash = await recordToBlockchain(record);
  console.log('Success:', txHash);
} catch (error) {
  if (error.message.includes('User rejected')) {
    // ✅ ユーザーが署名を拒否
    alert('トランザクションがキャンセルされました');
  } else if (error.message.includes('SSS Extension not connected')) {
    // ✅ SSS未接続
    alert('SSS Extensionと連携してください');
  } else if (error.message.includes('Insufficient balance')) {
    // ✅ 残高不足
    alert('XYM残高が不足しています。Faucetから取得してください。');
  } else {
    // ✅ その他のエラー
    console.error('Transaction error:', error);
    alert('トランザクションの送信に失敗しました');
  }
}
```

---

## 📝 コメント規約

### 実装時のコメント

```typescript
// ✅ 良いコメント例
// SSS Extensionでユーザーに署名をリクエスト
// ユーザーがウォレットで承認する必要がある
const signedTx = await requestSignTransaction();

// ❌ 悪いコメント例（DAO用の説明）
// マルチシグアカウントの連署名を取得
// const cosignedTx = await requestSignCosignatureTransaction();  // このプロジェクトでは使わない
```

---

## 🔍 コードレビューチェックリスト

### 実装前に確認すること

- [ ] DAO関連の機能を実装していないか？
- [ ] `requestSignCosignatureTransaction`を使っていないか？
- [ ] `AggregateCompleteTransaction`を使っていないか？
- [ ] マルチシグやトークン発行のコードが含まれていないか？
- [ ] SSS Extension未接続時のエラーハンドリングがあるか？
- [ ] ローディング状態の表示があるか？

---

## 📚 参考にするファイル

### ✅ 参考にして良いもの

**sssAndDaoExampleから参考にする部分**:
- `client/src/pages/DAO/Home.tsx` の `isAllowedSSS()`, `getActiveAddress()` の使い方
- SSS Extension接続確認のロジック
- エラーハンドリングのパターン

### ❌ 参考にしないもの

**sssAndDaoExampleから参考にしない部分**:
- `client/src/pages/DAO/Create.tsx` の DAO作成ロジック全体
- `client/src/pages/GovernanceVoting/index.tsx` の投票ロジック
- `server/src/routes/admin/createDao.ts` のDAO生成ロジック
- マルチシグ、トークン発行、連署名の実装

---

## ⚡ 高速開発のためのTips

### シンプルな実装を優先

```typescript
// ✅ シンプル（このプロジェクト向け）
const tx = createSimpleTransferTransaction(record);
await signWithSSS(tx);

// ❌ 複雑（DAO向け、不要）
const innerTxs = [tx1, tx2, tx3];
const aggregateTx = createAggregateTransaction(innerTxs);
await signWithMultipleCosigners(aggregateTx);
```

---

## 🎯 まとめ

### このプロジェクトで実装するもの

1. ✅ 学習記録のTransferTransaction生成
2. ✅ SSS ExtensionでのTransferTransaction署名
3. ✅ ブロックチェーンへのブロードキャスト
4. ✅ トランザクション検証

### このプロジェクトで実装しないもの

1. ❌ DAO作成・管理
2. ❌ マルチシグアカウント
3. ❌ トークン（モザイク）発行
4. ❌ ガバナンス投票
5. ❌ 連署名（Cosignature）

---

## 📞 質問があるとき

実装中に以下のような疑問が生じた場合は、このファイルを再確認してください：

- 「この機能は必要か？」 → **学習記録管理に必要な機能のみ実装**
- 「このトランザクションタイプは使うべきか？」 → **TransferTransactionのみ使用**
- 「この関数は使うべきか？」 → **DAO関連の関数は使わない**

---

---

## 👥 開発プロセスのルール（Claude Code & 開発者）

### 役割分担

**Claude Codeの役割**:
- ✅ コードの実装を全て担当
- ✅ タスクごとに実装ログを記録
- ✅ 自動テスト可能な部分はサブエージェントで実行
- ✅ 人間によるテストが必要な部分は手順書を作成

**開発者（人間）の役割**:
- ✅ 実装内容の確認・承認
- ✅ 手動テストの実行
- ✅ 必要に応じてファイルを直接編集（その際は報告）

### 実装プロセス

#### 1. フェーズ分けされた段階的実装

- 機能ごとにタスクを分割
- タスクの性質に応じてフェーズを構成
- 各フェーズ完了ごとに確認ポイントを設ける

#### 2. 実装ログの記録

**ログ配置場所**: `docs/logs/`

**ログ作成タイミング**:
- 実装完了後、開発者が内容を確認しOKを出したタイミングで作成
- 開発者の承認前にはログを作成しない

**ログに含める内容**:
- 実装したタスクのリスト
- 各タスクの目的（何のために実装したか）
- 変更したファイルとその箇所
- 実装完了日時

**ログファイル命名規則**:
```
docs/logs/phase-{N}-{feature-name}.md
例: docs/logs/phase-1-project-setup.md
```

#### 3. テスト戦略

**サブエージェントによる自動テスト**:
- ファイル存在確認
- 設定ファイルの検証
- インポート文の確認
- 基本的な構文チェック

**人間による手動テスト（テスト手順書を作成）**:
- サーバー起動確認
- ブラウザでの動作確認
- SSS Extension連携確認
- ブロックチェーントランザクション確認

**テスト手順書配置場所**: `docs/tests/`

**テスト手順書に含める内容**:
- テスト手順（ステップバイステップ）
- 確認すべき事項
- テストの目的
- 期待される結果

**例外**: 6行以下の簡単なテスト手順はCLI上で直接指示

#### 4. 進捗管理

**Todoリスト配置場所**: `.claude/implementation-todo.md`

**Todoリストの内容**:
- [ ] 現在実装中のタスク
- [ ] 次に実装するタスク
- [ ] 完了したタスク（チェックマーク付き）
- 各タスクの優先度
- 依存関係

#### 5. ファイル編集の報告

**開発者がファイルを直接編集した場合**:
- 「〇〇.xxを変更しました」と報告
- Claude Codeは該当ファイルを確認し、変更内容を把握
- 必要に応じて関連ファイルの調整を提案

### ドキュメント構造

```
docs/
├── IMPLEMENTATION_RULES.md     # このファイル（最優先ルール）
├── SSS_INTEGRATION.md          # SSS Extension統合ガイド
├── logs/                       # 実装ログ
│   ├── phase-1-project-setup.md
│   ├── phase-2-core-features.md
│   └── ...
└── tests/                      # テスト手順書
    ├── test-sss-connection.md
    ├── test-blockchain-record.md
    └── ...

.claude/
└── implementation-todo.md      # 実装Todoリスト
```

---

## 📋 実装チェックリスト

### コード実装時

- [ ] `IMPLEMENTATION_RULES.md`のルールに従っているか
- [ ] DAO関連機能を含めていないか
- [ ] 正しいSSS Extension関数を使用しているか
- [ ] エラーハンドリングが実装されているか
- [ ] 実装ログを記録したか

### フェーズ完了時

- [ ] 全タスクが完了したか
- [ ] 実装ログが作成されたか
- [ ] テスト手順書が作成されたか（必要な場合）
- [ ] Todoリストが更新されたか
- [ ] 開発者の確認・承認を得たか

---

---

## 🐛 デバッグ原則（エラーメッセージが出ない場合）

### 基本方針

**エラーメッセージやコンソール出力が出ない場合のデバッグでは、現在の実装の大枠を崩さず、妥協的な手段を使用せずに根本原因の特定と解決を試みる。**

### 1. 段階的ロギングの実装

エラーメッセージが出ない場合、最も効果的な手段はログ出力による処理の可視化です。

```typescript
// ✅ 段階的ログの実装例
export async function createAndSignTransferTransaction(
  recipientAddress: string,
  message: string
) {
  console.log('🔍 [DEBUG] createAndSignTransferTransaction 開始');
  console.log('🔍 [DEBUG] recipientAddress:', recipientAddress);
  console.log('🔍 [DEBUG] message:', message);

  try {
    console.log('🔍 [DEBUG] checkSSSAvailability 実行前');
    const availability = checkSSSAvailability();
    console.log('🔍 [DEBUG] availability:', availability);

    if (!availability.available) {
      console.log('🔍 [DEBUG] SSS利用不可で早期リターン');
      return { success: false, error: availability.error };
    }

    console.log('🔍 [DEBUG] Symbol SDK動的インポート開始');
    const { SymbolFacade } = await import('symbol-sdk/symbol');
    console.log('🔍 [DEBUG] Symbol SDK動的インポート完了');

    console.log('🔍 [DEBUG] SymbolFacade初期化開始');
    const config = getValidatedConfig();
    const network = config.networkType === 152 ? 'testnet' : 'mainnet';
    const facade = new SymbolFacade(network);
    console.log('🔍 [DEBUG] SymbolFacade初期化完了:', { network });

    console.log('🔍 [DEBUG] トランザクション作成開始');
    const transaction = facade.transactionFactory.create({...});
    console.log('🔍 [DEBUG] トランザクション作成完了:', transaction);

    console.log('🔍 [DEBUG] setTransaction実行前');
    setTransaction(transaction);
    console.log('🔍 [DEBUG] setTransaction実行完了');

    console.log('🔍 [DEBUG] requestSign実行前');
    const signedTx = await requestSign();
    console.log('🔍 [DEBUG] requestSign実行完了:', signedTx);

    if (!signedTx) {
      console.log('🔍 [DEBUG] signedTxがnullまたはundefined');
      return { success: false, error: {...} };
    }

    console.log('🔍 [DEBUG] 署名成功で正常リターン');
    return {
      success: true,
      signedTransaction: signedTx,
      transactionHash: signedTx.hash,
    };
  } catch (error) {
    console.error('🔍 [DEBUG] catch句に到達:', error);
    console.error('🔍 [DEBUG] error.message:', error instanceof Error ? error.message : 'unknown');
    console.error('🔍 [DEBUG] error.stack:', error instanceof Error ? error.stack : 'unknown');
    // エラーハンドリング...
  }
}
```

### 2. React状態管理のデバッグ

ブランクスクリーン問題はReactコンポーネントのレンダリングエラーの可能性があるため、状態遷移を追跡します。

```typescript
// ✅ React状態遷移のデバッグ例
const handleSubmit = async (recordId: string) => {
  console.log('🔍 [DEBUG] handleSubmit開始:', recordId);

  try {
    console.log('🔍 [DEBUG] setSubmitStatus実行前');
    setSubmitStatus({ status: 'signing', message: '署名中...' });
    console.log('🔍 [DEBUG] setSubmitStatus実行完了');

    console.log('🔍 [DEBUG] submitLearningRecord実行前');
    const result = await submitLearningRecord(session, recordId, (step, msg) => {
      console.log('🔍 [DEBUG] onProgress:', step, msg);
      setSubmitStatus({ status: 'progress', message: msg });
    });
    console.log('🔍 [DEBUG] submitLearningRecord実行完了:', result);

    if (result.success) {
      console.log('🔍 [DEBUG] 成功時の状態更新開始');
      setSubmitStatus({ status: 'completed', message: '登録完了' });
      console.log('🔍 [DEBUG] 成功時の状態更新完了');
    } else {
      console.log('🔍 [DEBUG] 失敗時の状態更新開始');
      setSubmitStatus({ status: 'error', message: result.error?.message });
      console.log('🔍 [DEBUG] 失敗時の状態更新完了');
    }
  } catch (error) {
    console.error('🔍 [DEBUG] catch句に到達:', error);
    setSubmitStatus({ status: 'error', message: 'エラーが発生しました' });
  }
};
```

### 3. 外部ライブラリの戻り値検証

SSS ExtensionやSymbol SDKなど外部ライブラリの戻り値が期待通りの構造であるか検証します。

```typescript
// ✅ 戻り値の構造検証例
const signedTx = await requestSign();
console.log('🔍 [DEBUG] signedTx:', signedTx);
console.log('🔍 [DEBUG] signedTx type:', typeof signedTx);
console.log('🔍 [DEBUG] signedTx keys:', signedTx ? Object.keys(signedTx) : 'null');
console.log('🔍 [DEBUG] signedTx.hash:', signedTx?.hash);
console.log('🔍 [DEBUG] signedTx.payload:', signedTx?.payload);
```

### 4. 非同期処理のデバッグ

Promise関連のエラーは検出が難しいため、特に注意してデバッグします。

```typescript
// ✅ Promise処理のデバッグ例
try {
  console.log('🔍 [DEBUG] Promise開始');
  const result = await someAsyncFunction();
  console.log('🔍 [DEBUG] Promise完了:', result);
} catch (error) {
  console.error('🔍 [DEBUG] Promise拒否:', error);
} finally {
  console.log('🔍 [DEBUG] Promise finally句');
}

// ❌ 避けるべきパターン
// then/catchを使わず、常にasync/awaitを使用
someAsyncFunction().then(result => {
  // このパターンは避ける
});
```

### 5. デバッグログの削除タイミング

```typescript
// デバッグログは問題解決後に削除
// ただし、本番環境でも有用なログは残す

// ✅ 本番環境でも残すログ
console.log('Transaction submitted:', txHash);
console.error('Transaction failed:', error.message);

// ❌ 問題解決後に削除するデバッグログ
console.log('🔍 [DEBUG] ...');  // 削除
```

### 6. ブランクスクリーン問題の調査手順

1. **ブラウザDevToolsでElementsタブを確認**
   - DOMが存在するか
   - どこで描画が止まっているか

2. **Reactコンポーネントのエラーバウンダリ確認**
   - Error Boundaryが設定されているか
   - レンダリングエラーをキャッチできているか

3. **Networkタブでリクエスト確認**
   - 未完了のリクエストがあるか
   - レスポンスが返っているか

4. **Consoleタブで全ての出力を確認**
   - Warningも見逃さない
   - 非同期処理の完了を確認

5. **段階的なログ追加**
   - 関数の入口
   - 条件分岐の各パス
   - 外部ライブラリ呼び出しの前後
   - 関数の出口

### 7. 問題の分離

複雑な処理を簡素化して問題箇所を特定します。

```typescript
// ✅ 問題の分離例

// Step 1: 最小限の実装で動作確認
export async function testMinimal() {
  console.log('Test 1: SSS接続確認');
  const available = isAllowedSSS();
  console.log('Result:', available);
}

// Step 2: Symbol SDK初期化のみ
export async function testSymbolSDK() {
  console.log('Test 2: Symbol SDK初期化');
  const { SymbolFacade } = await import('symbol-sdk/symbol');
  const facade = new SymbolFacade('testnet');
  console.log('Facade:', facade);
}

// Step 3: トランザクション作成のみ
export async function testTransactionCreate() {
  console.log('Test 3: トランザクション作成');
  const { SymbolFacade } = await import('symbol-sdk/symbol');
  const facade = new SymbolFacade('testnet');
  const tx = facade.transactionFactory.create({...});
  console.log('Transaction:', tx);
}

// Step 4: SSS署名のみ
export async function testSSSSign() {
  console.log('Test 4: SSS署名');
  const tx = await createMinimalTransaction();
  setTransaction(tx);
  const signed = await requestSign();
  console.log('Signed:', signed);
}
```

### 8. 妥協的手段を使わない原則

以下のような「動けば良い」という対処療法は避け、根本原因を特定します。

```typescript
// ❌ 避けるべき妥協的対処

// 1. エラーを隠蔽
try {
  await problematicFunction();
} catch {
  // エラーを無視（絶対にしない）
}

// 2. 安易なポーリング
setInterval(() => {
  // 根本解決せずにリトライ（避ける）
}, 1000);

// 3. グローバル変数での強制的な状態管理
window.forceUpdate = true;  // 避ける

// 4. 過度なtry-catchによる問題の先送り
// エラーの根本原因を特定せずにcatchでラップしない
```

### 9. ドキュメント・ソースコード調査

外部ライブラリの挙動が不明な場合は、公式ドキュメントやソースコードを確認します。

```typescript
// ✅ 調査項目

// 1. sss-moduleの公式ドキュメント
// - requestSign()の戻り値の構造
// - setTransaction()の引数の要件

// 2. Symbol SDK v3のドキュメント
// - SymbolFacadeの正しい使い方
// - TransactionFactoryの仕様

// 3. GitHubのissues検索
// - 同様の問題が報告されていないか
// - バージョン固有の問題がないか
```

### 10. 段階的な修正とテスト

問題を一度に全て修正せず、小さな変更を加えてテストを繰り返します。

```typescript
// ✅ 段階的修正の例

// Phase 1: ログ追加のみ（コードの動作は変えない）
// → ログで問題箇所を特定

// Phase 2: 1箇所だけ修正
// → 効果を確認

// Phase 3: 関連する箇所を修正
// → 総合的にテスト

// ❌ 一度に大量の変更を加えて原因が分からなくなる
```

---

**最終更新**: 2025-11-12

**重要**: このファイルに記載されたルールは、他のドキュメントよりも優先されます。矛盾がある場合は、このファイルの内容を優先してください。
