# Phase 3 テストチェックシート

**テスト実施日**: _____ 年 _____ 月 _____ 日
**テスト実施者**: _____________________
**開始時刻**: _____:_____
**終了時刻**: _____:_____

---

## 📋 事前準備チェック

### 環境情報
- [x] 使用ブラウザ: Chrome 〇 / Edge □ / その他 ( _________________ )
- [x] ブラウザバージョン: _____________________
- [x] OS: Windows 〇/ macOS □ / Linux □
- [x] インターネット接続: 有 〇 / 無 □

### SSS Extension
- [x] インストール済み
- [ ] バージョン: _____________________
- [x] 拡張機能が有効になっている
- [x] ブラウザツールバーにアイコンが表示される

### テストネットアカウント
- [x] アカウント作成済み
- [x] ネットワーク: TESTNET
- [x] アドレス（記録用）: _____________________________________
- [x] 公開鍵（記録用）: _____________________________________
- [x] XYM残高: __________ XYM（最低 10 XYM 推奨）

### プロジェクト環境
- [x] Node.js インストール済み
- [x] npm インストール済み
- [x] `npm install` 実行済み
- [x] `.env.local` ファイル設定済み

---

## 🚀 ステップ1: 開発サーバー起動

### 実行コマンド
```bash
npm run dev
```

### チェック項目
- [x] エラーなく起動した
- [x] 起動メッセージ表示: `Local: http://localhost:3000`
- [x] ポート番号: __________ （デフォルト: 3000）

### 問題が発生した場合
- 問題: □ あり / □ なし
- エラーメッセージ:
  ```


  ```

---

## 🏠 ステップ2: ホームページ確認

### アクセスURL
http://localhost:3000

### チェック項目
- [x] ページが正常に表示される
- [x] タイトル表示: "学習証明システム - SymProof Tree"
- [x] ナビゲーションバー表示
  - [x] ホーム
  - [x] 保留中
  - [x] 確定済み
  - [x] 検証
  - [x] 学習ツリー
- [x] 統計情報カード（2つ）表示
  - [x] 保留中レコード: _____ 件
  - [x] 確定済みレコード: _____ 件
- [x] クイックアクション（3つ）表示
  - [x] 学習記録を登録
  - [x] 記録を検証
  - [x] 学習ツリーを見る
- [x] レイアウト崩れなし

### スクリーンショット
- [ ] 撮影済み（ファイル名: `01_home.png`）

---

## 📝 ステップ3: 保留中ページ移動

### ナビゲーション
- [ ] 「保留中」リンクをクリック
- [ ] URL変化: `/pending`

### チェック項目
- [ ] ページが表示される
- [ ] タイトル表示: "保留中レコード"
- [ ] ページ構成確認:
  - [ ] SSS Extension ステータスセクション
  - [ ] 統計情報（4つのカード）
  - [ ] レコード一覧エリア
  - [ ] 開発者ツールセクション

### スクリーンショット
- [ ] 撮影済み（ファイル名: `02_pending_initial.png`）

---

## 🔌 ステップ4: SSS Extension接続確認

### SSS Extension ステータス表示

#### 正常系（期待される表示）
- [x] 背景色: 緑
- [x] ステータス: "✓ 接続済み"
- [x] アドレス表示: "TBBBBB..." （39文字）
- [x] 表示アドレスとSSS Extensionのアドレスが一致

**表示されたアドレス（記録用）**:
_____________________________________

#### 異常系（もし表示される場合）
- [ ] 背景色: 赤
- [ ] ステータス: "✗ 未接続"
- [ ] メッセージ: "SSS Extensionをインストールし、接続を許可してください"

**異常系の場合の対処**:
- [ ] ブラウザコンソール（F12）を開いた
- [ ] エラーメッセージ確認:
  ```


  ```
- [x] ページリロード試行: 成功 □ / 失敗 □
- [x] ブラウザ再起動試行: 成功 □ / 失敗 □

### スクリーンショット
- [ ] 撮影済み（ファイル名: `03_sss_status.png`）

---

## 📦 ステップ5: モックデータ読み込み

### 操作
- [x] ページ下部までスクロール
- [x] 「開発者ツール」セクション確認
- [x] 「モックデータを読み込む」ボタンをクリック

### アラート確認
- [x] アラート表示
- [x] メッセージ: "6件の保留中レコードを追加しました"
- [x] 「OK」をクリック

### ページ更新後の確認

#### 統計情報
- [x] 合計: 6 件
- [x] 保留中: 6 件
- [x] 送信中: 0 件
- [x] 失敗: 0 件

#### レコード一覧
- [ ] 6件のレコードカードが表示される

**各レコードの確認**:

| No. | タイトル（先頭20文字） | URL確認 | 学習時間表示 | ボタン有効 |
|-----|---------------------|---------|-------------|-----------|
| 1   | Next.js 14 チュート... | □ | □ | □ |
| 2   | Next.js Server Co... | □ | □ | □ |
| 3   | TypeScript完全ガイ... | □ | □ | □ |
| 4   | Symbol ブロックチェ... | □ | □ | □ |
| 5   | React Hooksの理解... | □ | □ | □ |
| 6   | Tailwind CSS ベス... | □ | □ | □ |

#### レコードカード内容確認（1件目の例）
- [x] タイトル表示
- [x] URL表示
- [x] 学習時間表示（例: "45分0秒"）
- [x] 開始日時表示
- [x] ステータス表示: "保留中"（黄色）
- [x] コンテンツハッシュ表示（省略形）
- [x] 「ブロックチェーンに登録」ボタンが有効（青色）

### スクリーンショット
- [ ] 撮影済み（ファイル名: `04_mock_data_loaded.png`）
- [ ] レコード一覧全体が写っている

---

## 🔗 ステップ6: トランザクション送信テスト

### 6-1. 送信開始

#### 操作
- [x] 1件目のレコード（"Next.js 14 チュート..."）を選択
- [x] 「ブロックチェーンに登録」ボタンをクリック
- [x] クリック時刻: _____:_____

---

### 6-2. SSS Extension ポップアップ

#### 表示確認
- [失敗] SSS Extensionポップアップが開いた
- [ ] ポップアップ表示までの時間: _____ 秒

# コンソールエラー
````bash
i18next: languageChanged EN
inject_script.js:200 i18next: initialized {debug: true, initImmediate: true, ns: Array(1), defaultNS: Array(1), fallbackLng: Array(1), …}
installHook.js:1 ./node_modules/symbol-crypto-wasm-web/symbol_crypto_wasm_bg.wasm
The generated code contains 'async/await' because this module is using "asyncWebAssembly".
However, your target environment does not appear to support 'async/await'.
As a result, the code may not run as expected or may cause runtime errors.
overrideMethod @ installHook.js:1
processMessage @ hot-reloader-client.js:227
handler @ hot-reloader-client.js:395Understand this warning
installHook.js:1 ./node_modules/symbol-crypto-wasm-web/symbol_crypto_wasm_bg.wasm
The generated code contains 'async/await' because this module is using "asyncWebAssembly".
However, your target environment does not appear to support 'async/await'.
As a result, the code may not run as expected or may cause runtime errors.

Import trace for requested module:
./node_modules/symbol-crypto-wasm-web/symbol_crypto_wasm_bg.wasm
./node_modules/symbol-crypto-wasm-web/symbol_crypto_wasm.js
./node_modules/symbol-sdk/src/impl/ed25519_wasm.js
./node_modules/symbol-sdk/src/impl/ed25519.js
./node_modules/symbol-sdk/src/symbol/KeyPair.js
./node_modules/symbol-sdk/src/symbol/index.js
./lib/symbol/sssSimple.ts
./app/pending/page.tsx
overrideMethod @ installHook.js:1
processMessage @ hot-reloader-client.js:227
handler @ hot-reloader-client.js:395Understand this warning
page.tsx:62 🔍 [DEBUG] handleSubmit 開始
page.tsx:63 🔍 [DEBUG] record: {id: '030e8edd-323e-4295-bc9d-3808a484cc8c', session: {…}, createdAt: Wed Nov 12 2025 04:45:03 GMT+0900 (GMT+09:00), status: 'pending'}
page.tsx:64 🔍 [DEBUG] sssAvailable: true
page.tsx:72 🔍 [DEBUG] setSubmitting実行: 030e8edd-323e-4295-bc9d-3808a484cc8c
page.tsx:74 🔍 [DEBUG] setProgress実行: init
page.tsx:78 🔍 [DEBUG] submitLearningRecord実行前
workflowSimple.ts:52 🔍 [DEBUG] submitLearningRecord 開始
workflowSimple.ts:53 🔍 [DEBUG] pendingRecordId: 030e8edd-323e-4295-bc9d-3808a484cc8c
workflowSimple.ts:54 🔍 [DEBUG] session: {id: 'session-001', url: 'https://www.youtube.com/watch?v=example1', title: 'Next.js 14 チュートリアル - App Routerの基礎', startTime: Mon Jan 15 2024 19:00:00 GMT+0900 (GMT+09:00), endTime: Mon Jan 15 2024 19:45:00 GMT+0900 (GMT+09:00), …}
workflowSimple.ts:60 🔍 [DEBUG] ステップ1: SSS Extension確認
page.tsx:83 🔍 [DEBUG] onProgress callback: init SSS Extensionを確認中...
workflowSimple.ts:63 🔍 [DEBUG] availability: {available: true}
workflowSimple.ts:74 🔍 [DEBUG] getSSSAccountInfo実行
workflowSimple.ts:76 🔍 [DEBUG] accountInfo: {address: 'TA5YAB2IYVOYFJ6V5R6B3UZ2JXHJDITL5LTUDIQ', publicKey: 'A7D2A947953FBA9FC206C22CE96B88C51BD06F87C5A67BD3476DA215AA8DA9D7'}
workflowSimple.ts:91 🔍 [DEBUG] signerAddress: TA5YAB2IYVOYFJ6V5R6B3UZ2JXHJDITL5LTUDIQ
workflowSimple.ts:95 🔍 [DEBUG] ステップ2+3: トランザクション作成と署名
page.tsx:83 🔍 [DEBUG] onProgress callback: sign_tx SSS Extensionで署名を要求中...
workflowSimple.ts:98 🔍 [DEBUG] generateRecordMessage実行
workflowSimple.ts:100 🔍 [DEBUG] message length: 284
workflowSimple.ts:102 🔍 [DEBUG] createAndSignTransferTransaction実行前
sssSimple.ts:99 🔍 [DEBUG] createAndSignTransferTransaction 開始
sssSimple.ts:100 🔍 [DEBUG] recipientAddress: TA5YAB2IYVOYFJ6V5R6B3UZ2JXHJDITL5LTUDIQ
sssSimple.ts:101 🔍 [DEBUG] message length: 284
sssSimple.ts:102 🔍 [DEBUG] mosaics: []
sssSimple.ts:105 🔍 [DEBUG] checkSSSAvailability 実行前
sssSimple.ts:107 🔍 [DEBUG] availability: {available: true}
sssSimple.ts:114 🔍 [DEBUG] Symbol SDK動的インポート開始
sssSimple.ts:117 🔍 [DEBUG] Symbol SDK動的インポート完了
sssSimple.ts:119 🔍 [DEBUG] Symbol Facade初期化開始
sssSimple.ts:122 🔍 [DEBUG] config: {nodeUrl: 'https://sym-test-01.opening-line.jp:3001', networkType: 152, epochAdjustment: 1667250467, currencyMosaicId: '0x72C0212E67A08BCE', maxFee: 100000000, …}
sssSimple.ts:124 🔍 [DEBUG] network: testnet
sssSimple.ts:126 🔍 [DEBUG] Symbol Facade初期化完了
sssSimple.ts:130 🔍 [DEBUG] deadline: 1762900183144n
sssSimple.ts:133 🔍 [DEBUG] メッセージ変換開始
sssSimple.ts:138 🔍 [DEBUG] メッセージ変換完了 length: 305
sssSimple.ts:141 🔍 [DEBUG] TransferTransaction作成開始
sssSimple.ts:151 🔍 [DEBUG] TransferTransaction作成完了
sssSimple.ts:152 🔍 [DEBUG] transaction type: object
sssSimple.ts:153 🔍 [DEBUG] transaction: TransferTransactionV1 {_signature: Signature, _signerPublicKey: PublicKey, _version: 1, _network: NetworkType, _type: TransactionType, …}
sssSimple.ts:156 🔍 [DEBUG] setTransaction実行前
sssSimple.ts:158 🔍 [DEBUG] setTransaction実行完了
sssSimple.ts:161 🔍 [DEBUG] requestSign実行前

````

# サーバーエラー

```` bash
````

#### トランザクション詳細
- [ ] トランザクション種類: "TransferTransaction" または "Transfer"
- [ ] 送信先アドレス: _____________________________________
- [ ] 送信先が自分のアドレスと一致: はい □ / いいえ □
- [ ] メッセージフィールド表示
- [ ] メッセージ内容にJSONデータ確認:
  - [ ] `"type": "learning_record"` を含む
  - [ ] `"url":` を含む
  - [ ] `"title":` を含む
  - [ ] `"contentHash":` を含む
- [ ] 手数料表示: __________ XYM
- [ ] 手数料は妥当（0.1 XYM以下）: はい □ / いいえ □

#### 操作
- [ ] 内容を確認した
- [ ] 「承認」ボタンをクリック
- [ ] クリック時刻: _____:_____

### スクリーンショット
- [ ] 撮影済み（ファイル名: `05_sss_popup.png`）

---

### 6-3. 送信進捗表示

#### 進捗セクション表示
- [ ] ページ上部に進捗表示エリアが出現
- [ ] 背景色: 青

#### ステップ確認（チェックした時刻を記録）

| ステップ | 表示メッセージ | 表示確認 | 表示時刻 |
|---------|-------------|---------|----------|
| init | SSS Extensionを確認中... | □ | _____:_____ |
| sign_tx | SSS Extensionで署名を要求中... | □ | _____:_____ |
| announce_tx | トランザクションを送信中... | □ | _____:_____ |
| save_record | 確定済みレコードを保存中... | □ | _____:_____ |
| completed | 送信完了 | □ | _____:_____ |

#### 各ステップの表示時間（任意）
- init → sign_tx: 約 _____ 秒
- sign_tx → announce_tx: 約 _____ 秒
- announce_tx → save_record: 約 _____ 秒
- save_record → completed: 約 _____ 秒
- **合計処理時間**: 約 _____ 秒

### スクリーンショット
- [ ] 撮影済み（各ステップ、可能なら）

---

### 6-4. 送信完了確認

#### アラート表示
- [ ] アラートが表示された
- [ ] メッセージ: "トランザクション送信成功！"
- [ ] トランザクションハッシュ表示

**トランザクションハッシュ（重要！必ず記録）**:
________________________________________________________________

- [ ] ハッシュをコピーしてメモ帳に保存した
- [ ] ハッシュの長さ: 64文字
- [ ] ハッシュの形式: 0-9, A-F の16進数

#### アラート後の操作
- [ ] 「OK」をクリック
- [ ] クリック時刻: _____:_____

---

### 6-5. ページ更新後の確認

#### 統計情報の変化
- [ ] 合計: 5 件（6→5に変化）
- [ ] 保留中: 5 件（6→5に変化）
- [ ] 送信中: 0 件（変化なし）
- [ ] 失敗: 0 件（変化なし）

#### レコード一覧の変化
- [ ] 送信したレコードが一覧から消えた
- [ ] 残りのレコード数: 5 件
- [ ] 残りのレコードが正しく表示される

#### SSS Extension残高確認
- [ ] SSS Extensionを開いた
- [ ] 残高が減少した
- [ ] 送信前の残高: __________ XYM
- [ ] 送信後の残高: __________ XYM
- [ ] 減少額（手数料）: __________ XYM

### スクリーンショット
- [ ] 送信成功アラート撮影済み（ファイル名: `06_tx_success.png`）
- [ ] 送信後のページ撮影済み（ファイル名: `07_after_send.png`）

---

## 🔍 ステップ7: Explorer確認（最重要）

### アクセス
- [ ] Symbol Testnet Explorer を開く
- [ ] URL: https://testnet.symbol.fyi/
- [ ] アクセス時刻: _____:_____

### 検索
- [ ] 検索ボックスにトランザクションハッシュを貼り付け
- [ ] Enter キーを押す

### トランザクション詳細ページ

#### 基本情報
- [ ] ページが表示された（404エラーでない）
- [ ] トランザクションハッシュ表示: _______________________________
- [ ] Type: "Transfer Transaction" または "TRANSFER"
- [ ] Status: _____________________
  - confirmed（確定済み）□ / unconfirmed（未確定）□ / その他 □

**Status が unconfirmed の場合**:
- [ ] 1分待ってリロード
- [ ] 再確認結果: confirmed □ / まだ unconfirmed □

#### アドレス情報
- [ ] Signer（署名者）: _____________________________________
- [ ] Recipient（受信者）: _____________________________________
- [ ] SignerとRecipientが同じアドレス（自分宛）: はい □ / いいえ □
- [ ] 自分のアドレスと一致: はい □ / いいえ □

#### メッセージフィールド
- [ ] Message セクションが存在する
- [ ] メッセージタイプ: Plain □ / Encrypted □ / その他 □
- [ ] メッセージ内容表示

**メッセージ内容のJSON確認**:
- [ ] `"type": "learning_record"` を含む
- [ ] `"url":` フィールド存在
  - URL値: _____________________________________
- [ ] `"title":` フィールド存在
  - タイトル: _____________________________________
- [ ] `"startTime":` フィールド存在（ISO 8601形式）
- [ ] `"endTime":` フィールド存在（ISO 8601形式）
- [ ] `"duration":` フィールド存在（ミリ秒、数値）
  - 値: __________ ms
- [ ] `"contentHash":` フィールド存在（64文字の16進数）
  - ハッシュ: _____________________________________

**JSONフォーマット確認**:
- [ ] 有効なJSON形式
- [ ] パース可能（エラーなし）

#### トランザクション詳細
- [ ] Fee（手数料）: __________ XYM
- [ ] Block Height（ブロック高）: __________
- [ ] Timestamp（タイムスタンプ）: _____________________
- [ ] Mosaics（送金額）: 0個（送金なし）□ / その他 □

#### その他の情報
- [ ] Transaction Hash: 64文字の16進数
- [ ] Network: Testnet

### スクリーンショット
- [ ] Explorer トランザクション詳細（全体）撮影済み（ファイル名: `08_explorer_detail.png`）
- [ ] メッセージフィールド（JSON内容）撮影済み（ファイル名: `09_explorer_message.png`）

### 検証結果
- [ ] ✅ すべての情報が正しく記録されている
- [ ] ⚠️ 一部情報に問題がある（後述）
- [ ] ❌ 重大な問題がある（後述）

**問題がある場合の詳細**:
```




```

---

## 🔄 ステップ8: 複数レコード送信テスト（任意）

### 2件目の送信

#### 送信レコード
- [ ] レコード選択: No. _____ （タイトル: _____________________）
- [ ] 「ブロックチェーンに登録」クリック
- [ ] SSS Extension承認
- [ ] 送信成功
- [ ] トランザクションハッシュ:
  ________________________________________________________________
- [ ] Explorer確認: 成功 □ / 失敗 □

### 3件目の送信

#### 送信レコード
- [ ] レコード選択: No. _____ （タイトル: _____________________）
- [ ] 「ブロックチェーンに登録」クリック
- [ ] SSS Extension承認
- [ ] 送信成功
- [ ] トランザクションハッシュ:
  ________________________________________________________________
- [ ] Explorer確認: 成功 □ / 失敗 □

### 統計情報最終確認
- [ ] 保留中レコード数: _____ 件（期待値: 3件送信なら3件残り）
- [ ] 送信成功件数合計: _____ 件

---

## ⚠️ ステップ9: エラーハンドリングテスト（任意）

### 9-1. ユーザーキャンセルテスト

#### 操作
- [ ] 任意のレコードで「ブロックチェーンに登録」クリック
- [ ] SSS Extensionポップアップで「キャンセル」をクリック

#### 確認
- [ ] アラート表示
- [ ] メッセージ内容: _____________________________________
- [ ] メッセージに「キャンセル」が含まれる: はい □ / いいえ □
- [ ] レコードが保留中のまま（削除されていない）: はい □ / いいえ □
- [ ] 統計情報が変化していない: はい □ / いいえ □

---

### 9-2. SSS Extension切断テスト

#### 操作
- [ ] ブラウザの拡張機能管理を開く
- [ ] SSS Extensionを無効化
- [ ] ページをリロード（F5）

#### 確認
- [ ] SSS Extension ステータスが「✗ 未接続」（赤背景）に変わる
- [ ] メッセージ表示確認
- [ ] 「ブロックチェーンに登録」ボタンが無効化（灰色）
- [ ] ボタンにカーソルを当てても反応しない

#### 後処理
- [ ] SSS Extensionを再度有効化
- [ ] ページをリロード
- [ ] ステータスが「✓ 接続済み」に戻る

---

## 📊 テスト結果サマリー

### 成功した機能
- [ ] 開発サーバー起動
- [ ] ホームページ表示
- [ ] 保留中ページ表示
- [ ] SSS Extension接続
- [ ] モックデータ読み込み
- [ ] トランザクション送信（_____ 件成功）
- [ ] Explorer確認
- [ ] 統計情報更新
- [ ] レコード削除（保留中→確定済み）

### 失敗した機能・問題点
```








```

### 全体評価
- [ ] ✅ すべての機能が正常に動作
- [ ] ⚠️ 一部機能に問題あり（上記参照）
- [ ] ❌ 重大な問題により継続不可

---

## 📸 スクリーンショット一覧

### 必須スクリーンショット
- [ ] `01_home.png` - ホームページ
- [ ] `02_pending_initial.png` - 保留中ページ（初期状態）
- [ ] `03_sss_status.png` - SSS Extension接続状態
- [ ] `04_mock_data_loaded.png` - モックデータ読み込み後
- [ ] `05_sss_popup.png` - SSS Extensionポップアップ
- [ ] `06_tx_success.png` - 送信成功アラート
- [ ] `07_after_send.png` - 送信後のページ
- [ ] `08_explorer_detail.png` - Explorerトランザクション詳細
- [ ] `09_explorer_message.png` - Explorerメッセージ内容

### 任意スクリーンショット
- [ ] 送信進捗の各ステップ
- [ ] 複数レコード送信結果
- [ ] エラーハンドリング画面

---

## 📝 メモ・気づいた点

```








```

---

## ✅ 最終確認

### Phase 3 必須項目
- [ ] SSS Extensionインストール・設定完了
- [ ] テストネットアカウント作成完了
- [ ] XYM取得完了（残高確認）
- [ ] 開発サーバー起動成功
- [ ] SSS Extension接続成功
- [ ] モックデータ読み込み成功
- [ ] トランザクション送信成功（最低1件）
- [ ] トランザクションハッシュ取得・記録
- [ ] Explorer確認成功
- [ ] メッセージ内容（JSON）確認
- [ ] すべての必須スクリーンショット撮影

### テスト完了判定
- [ ] ✅ Phase 3 テスト合格（Phase 4へ進む）
- [ ] 🔄 再テストが必要（問題箇所: _____________________）
- [ ] ❌ テスト不合格（開発者へ報告）

---

## 📤 報告事項

### 開発者への報告内容

**テスト結果**: 合格 □ / 条件付き合格 □ / 不合格 □

**送信成功件数**: _____ 件 / 6 件

**トランザクションハッシュ一覧**:
1. ________________________________________________________________
2. ________________________________________________________________
3. ________________________________________________________________

**所要時間**: _____ 分

**問題・改善提案**:
```








```

---

## 🔍 デバッグログ収集（ブランクスクリーン問題調査用）

### 重要: ブランクスクリーン問題が発生した場合

署名ポップアップでパスワードを入力して「OK」を押した後、画面が真っ白になる場合は以下を実施してください。

### 手順

#### 1. ブラウザのDevToolsを開く
- [ ] F12キーを押してDevToolsを開く
- [ ] Consoleタブを選択

#### 2. コンソールログを確認
- [ ] 🔍 [DEBUG] で始まるログが大量に出力されている
- [ ] 最後に表示されたDEBUGログを探す

#### 3. ログの記録

**最後に出力された5つのDEBUGログ**:
```
1.


2.


3.


4.


5.


```

**エラーが出力されている場合（赤文字）**:
```



```

#### 4. Elementsタブで確認
- [ ] Elementsタブを開く
- [ ] `<body>`タグの中身を確認
- [ ] DOMが存在する: はい □ / いいえ □

**DOMの状態（存在する場合）**:
```
<body>配下の主要な要素:




```

#### 5. Networkタブで確認
- [ ] Networkタブを開く
- [ ] 未完了のリクエストがある: はい □ / いいえ □
- [ ] 失敗したリクエストがある: はい □ / いいえ □

**未完了または失敗したリクエスト**:
```



```

#### 6. Reactコンポーネントの状態
- [ ] Reactエラーバウンダリのエラーがコンソールに表示されている: はい □ / いいえ □

**Reactエラー**:
```



```

### デバッグログ解析のポイント

以下のどこまでログが出力されているかを確認:

**lib/symbol/sssSimple.ts (createAndSignTransferTransaction)**:
- [ ] `🔍 [DEBUG] createAndSignTransferTransaction 開始`
- [ ] `🔍 [DEBUG] checkSSSAvailability 実行前`
- [ ] `🔍 [DEBUG] Symbol SDK動的インポート開始`
- [ ] `🔍 [DEBUG] Symbol SDK動的インポート完了`
- [ ] `🔍 [DEBUG] Symbol Facade初期化完了`
- [ ] `🔍 [DEBUG] TransferTransaction作成完了`
- [ ] `🔍 [DEBUG] setTransaction実行完了`
- [ ] `🔍 [DEBUG] requestSign実行前`
- [ ] `🔍 [DEBUG] requestSign実行完了`（⭐ ここまで到達すれば署名成功）
- [ ] `🔍 [DEBUG] 署名成功で正常リターン`

**lib/symbol/workflowSimple.ts (submitLearningRecord)**:
- [ ] `🔍 [DEBUG] submitLearningRecord 開始`
- [ ] `🔍 [DEBUG] createAndSignTransferTransaction実行後`
- [ ] `🔍 [DEBUG] announceSignedTransaction実行完了`
- [ ] `🔍 [DEBUG] submitLearningRecord 正常終了`

**app/pending/page.tsx (handleSubmit)**:
- [ ] `🔍 [DEBUG] handleSubmit 開始`
- [ ] `🔍 [DEBUG] submitLearningRecord実行後`
- [ ] `🔍 [DEBUG] 成功: アラート表示`
- [ ] `🔍 [DEBUG] handleSubmit 終了`

**どのステップで止まっているか**:
```
最後に成功したステップ:


止まっているステップ:


```

---

**チェックシート作成日**: 2025年
**対象Phase**: Phase 3 - SSS Extension統合とブロックチェーン送信
**想定テスト時間**: 30～45分
**チェック項目数**: 200+項目
