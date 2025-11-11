# symproof-tree 実装方針書

## 📋 概要

このドキュメントは、symproof-treeプロジェクトの実装を段階的に進めるための方針書です。

**プロジェクト目標**: 学習記録を自動検出し、Symbol Testnetに記録する学習証跡管理システムのMVPを構築

**除外機能**: DAO関連機能（マルチシグ、トークン発行、ガバナンス投票など）

---

## 🎯 実装の全体像

### 開発期間の想定
約2-3週間でMVP完成

### 技術スタック
- **フロントエンド**: Next.js 14 + TypeScript + Tailwind CSS
- **ブロックチェーン**: Symbol Testnet + SSS Extension
- **AI**: Google Gemini API
- **状態管理**: React Hooks + LocalStorage

---

## 📊 フェーズ別実装計画

### Phase 1: プロジェクトセットアップ（2-3日）
**目的**: 開発環境を整備し、基本構造を構築

### Phase 2: 自動検出とPending Records（3-4日）
**目的**: モックデータから学習記録を自動生成し、表示

### Phase 3: SSS Extension統合とブロックチェーン記録（3-4日）
**目的**: Symbol Testnetへのトランザクション送信を実装

### Phase 4: 検証機能（2-3日）
**目的**: ブロックチェーン上の記録を検証する機能を実装

### Phase 5: Learning Tree可視化（2-3日）
**目的**: React Flowで学習ツリーを表示

### Phase 6: AI要約とポリッシュ（2-3日）
**目的**: Gemini APIで要約生成、UIを洗練

---

## 🔧 Phase 1: プロジェクトセットアップ

### 目的
- Next.jsプロジェクトの初期化
- 必要なパッケージのインストール
- ディレクトリ構造の構築
- 型定義とConstants設定
- モックデータの準備

### タスク一覧

#### Task 1.1: Next.jsプロジェクトの初期化
**何をするか**:
- `create-next-app`でプロジェクト作成（既存の場合はスキップ）
- TypeScript、Tailwind CSS、App Routerを有効化

**成果物**:
- `package.json`
- `tsconfig.json`
- `tailwind.config.ts`
- `next.config.js`

#### Task 1.2: 依存パッケージのインストール
**何をするか**:
- Symbol SDK、SSS Module、Gemini API SDKなど必要なパッケージをインストール

**インストールするパッケージ**:
```bash
npm install symbol-sdk@3 sss-module @google/generative-ai reactflow uuid
npm install -D @types/uuid
```

**成果物**:
- 更新された`package.json`
- `package-lock.json`

#### Task 1.3: ディレクトリ構造の構築
**何をするか**:
- プロジェクトのディレクトリ構造を作成

**作成するディレクトリ**:
```
src/
├── app/
│   ├── api/
│   │   └── summarize/
│   ├── tree/
│   ├── verify/
│   ├── portfolio/[id]/
│   ├── page.tsx
│   └── layout.tsx
├── components/
├── lib/
│   ├── symbol/
│   ├── detection/
│   ├── ai/
│   ├── storage/
│   └── utils/
├── types/
└── constants/

public/
├── mock-browsing-sessions.json
└── mock-confirmed-records.json
```

**成果物**:
- 全ディレクトリが作成される

#### Task 1.4: 型定義ファイルの作成
**何をするか**:
- グローバルな型定義を作成

**作成するファイル**: `src/types/index.ts`

**含める型**:
- `BrowsingSession`
- `LearningRecord`
- `LearningNode`
- `Portfolio`
- `SymbolTransactionPayload`

**成果物**:
- `src/types/index.ts`

#### Task 1.5: Constants設定
**何をするか**:
- アプリケーション全体で使用する定数を定義

**作成するファイル**: `src/constants/index.ts`

**含める定数**:
- Symbol ノードURL
- ネットワークタイプ
- 手数料設定
- ポーリング設定

**成果物**:
- `src/constants/index.ts`

#### Task 1.6: 環境変数設定
**何をするか**:
- `.env.local`と`.env.example`を作成

**環境変数**:
```bash
NEXT_PUBLIC_SYMBOL_NETWORK_TYPE=testnet
NEXT_PUBLIC_SYMBOL_NODE_URL=https://sym-test-03.opening-line.jp:3001
NEXT_PUBLIC_SYMBOL_GENERATION_HASH=49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4
GOOGLE_AI_API_KEY=your-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**成果物**:
- `.env.example`
- `.env.local`（gitignoreに含まれる）

#### Task 1.7: モックデータの作成
**何をするか**:
- 自動検出をシミュレートするモックデータを作成

**作成するファイル**:
1. `public/mock-browsing-sessions.json` - 10-15件のブラウジングセッション
2. `public/mock-confirmed-records.json` - 2-3件の確認済み記録

**データの内容**:
- リアルなURL（Next.js、Symbol、TypeScriptのドキュメント）
- 信頼性のある学習時間（15-120分）
- 妥当な理解度スコア（1-5）

**成果物**:
- `public/mock-browsing-sessions.json`
- `public/mock-confirmed-records.json`

### Phase 1 完了条件
- [ ] 全てのパッケージがインストールされている
- [ ] ディレクトリ構造が完成している
- [ ] 型定義が作成されている
- [ ] 環境変数が設定されている
- [ ] モックデータが作成されている
- [ ] `npm run dev`でサーバーが起動する

### Phase 1 テスト
**簡易テスト（CLI上で指示）**:
1. `npm run dev`を実行
2. `http://localhost:3000`にアクセス
3. デフォルトのNext.jsページが表示されることを確認

---

## 📝 Phase 2: 自動検出とPending Records

### 目的
- モックデータから学習記録を自動生成
- Pending Recordsの表示
- LocalStorage操作の実装

### タスク一覧

#### Task 2.1: 自動検出ロジックの実装
**何をするか**:
- `BrowsingSession`から`LearningRecord`への変換ロジックを実装

**作成するファイル**:
- `src/lib/detection/auto-tracker.ts`
- `src/lib/detection/score-calculator.ts`
- `src/lib/detection/tag-extractor.ts`

**実装する関数**:
- `convertSessionToRecord()` - セッションを記録に変換
- `calculateDuration()` - 学習時間計算
- `calculateUnderstanding()` - 理解度スコア計算
- `extractTags()` - タグ抽出
- `generateAutoNote()` - 自動メモ生成

**成果物**:
- `src/lib/detection/auto-tracker.ts`
- `src/lib/detection/score-calculator.ts`
- `src/lib/detection/tag-extractor.ts`

#### Task 2.2: コンテンツハッシュ計算
**何をするか**:
- SHA-256でコンテンツハッシュを計算する関数を実装

**作成するファイル**: `src/lib/utils/hash.ts`

**実装する関数**:
- `calculateContentHash(record: LearningRecord): Promise<string>`

**成果物**:
- `src/lib/utils/hash.ts`

#### Task 2.3: LocalStorage操作の実装
**何をするか**:
- LocalStorageへの読み書き機能を実装

**作成するファイル**: `src/lib/storage/local.ts`

**実装する関数**:
- `savePendingRecords()` - Pending Recordsを保存
- `getPendingRecords()` - Pending Recordsを取得
- `saveConfirmedRecords()` - Confirmed Recordsを保存
- `getConfirmedRecords()` - Confirmed Recordsを取得
- `confirmRecord()` - PendingからConfirmedに移動
- `updateRecord()` - 記録を更新

**成果物**:
- `src/lib/storage/local.ts`

#### Task 2.4: RecordCardコンポーネントの作成
**何をするか**:
- 個別の学習記録を表示するカードコンポーネント

**作成するファイル**: `src/components/RecordCard.tsx`

**表示する内容**:
- タイトル
- URL
- 学習時間
- 理解度スコア
- タグ
- メモ
- ステータスバッジ（Pending/Confirmed）

**成果物**:
- `src/components/RecordCard.tsx`

#### Task 2.5: PendingRecordsコンポーネントの作成
**何をするか**:
- Pending Recordsのリストを表示

**作成するファイル**: `src/components/PendingRecords.tsx`

**機能**:
- モックデータを読み込み
- 自動検出ロジックで`LearningRecord`に変換
- `RecordCard`で各記録を表示
- カードクリックで確認モーダルを開く

**成果物**:
- `src/components/PendingRecords.tsx`

#### Task 2.6: ConfirmationModalコンポーネントの作成
**何をするか**:
- 記録の詳細を表示し、確認を求めるモーダル

**作成するファイル**: `src/components/ConfirmationModal.tsx`

**表示する内容**:
- 記録の全詳細（読み取り専用）
- コンテンツハッシュ
- 警告メッセージ
- 「ブロックチェーンに記録する」ボタン

**機能**:
- すべてのフィールドが読み取り専用
- ボタンクリックでブロックチェーン記録処理を開始（Phase 3で実装）

**成果物**:
- `src/components/ConfirmationModal.tsx`

#### Task 2.7: ホームページの実装
**何をするか**:
- メインページを実装

**作成するファイル**: `src/app/page.tsx`

**機能**:
- Pending/Confirmedタブの切り替え
- `PendingRecords`コンポーネントの表示
- SSS Extension接続状態の表示（Phase 3で完全実装）

**成果物**:
- `src/app/page.tsx`

### Phase 2 完了条件
- [ ] モックデータが正しく読み込まれる
- [ ] 自動検出ロジックが動作する
- [ ] Pending Recordsが表示される
- [ ] カードをクリックすると確認モーダルが開く
- [ ] モーダルで記録詳細が表示される（読み取り専用）

### Phase 2 テスト
**テスト手順書**: `docs/tests/test-pending-records.md`

**主な確認事項**:
- Pending Recordsに10-15件表示される
- 各カードに正しい情報が表示される
- カードクリックでモーダルが開く
- モーダルで編集できないことを確認

---

## 🔗 Phase 3: SSS Extension統合とブロックチェーン記録

### 目的
- SSS Extensionとの連携
- TransferTransactionの作成と署名
- Symbol Testnetへのブロードキャスト
- トランザクション確認のポーリング

### タスク一覧

#### Task 3.1: Symbol Wallet統合モジュールの作成
**何をするか**:
- SSS Extensionとの連携機能を実装

**作成するファイル**: `src/lib/symbol/wallet.ts`

**実装する関数**:
- `checkWalletConnection()` - SSS接続確認
- `getUserAddress()` - アドレス取得
- `getUserPublicKey()` - 公開鍵取得
- `getUserName()` - アカウント名取得
- `signTransactionWithSSS()` - TransferTransaction署名

**成果物**:
- `src/lib/symbol/wallet.ts`

#### Task 3.2: Symbol SDK初期化
**何をするか**:
- Symbol SDKの初期化とネットワーク接続

**作成するファイル**: `src/lib/symbol/client.ts`

**実装する関数**:
- `initializeSymbolFacade()` - SymbolFacadeの初期化
- `getRepositoryFactory()` - RepositoryFactoryの取得
- `getNetworkProperties()` - ネットワーク情報取得

**成果物**:
- `src/lib/symbol/client.ts`

#### Task 3.3: TransferTransaction作成
**何をするか**:
- 学習記録用のTransferTransactionを作成

**作成するファイル**: `src/lib/symbol/transaction.ts`

**実装する関数**:
- `createLearningRecordTransaction()` - TransferTransaction作成
- `recordToBlockchain()` - ブロックチェーンに記録
- `broadcastTransaction()` - トランザクション送信

**成果物**:
- `src/lib/symbol/transaction.ts`

#### Task 3.4: トランザクション確認のポーリング
**何をするか**:
- トランザクションが確認されるまでポーリング

**追加するファイル**: `src/lib/symbol/transaction.ts`（既存に追加）

**実装する関数**:
- `pollTransactionStatus()` - ステータスをポーリング
- `waitForConfirmation()` - 確認待機

**ポーリング設定**:
- 間隔: 3秒
- タイムアウト: 60秒

**成果物**:
- 更新された`src/lib/symbol/transaction.ts`

#### Task 3.5: ConfirmationModalの機能実装
**何をするか**:
- ブロックチェーン記録ボタンの機能を実装

**更新するファイル**: `src/components/ConfirmationModal.tsx`

**追加する機能**:
- SSS接続確認
- トランザクション作成
- SSS Extensionで署名
- ブロードキャスト
- ポーリング
- 成功時にConfirmed Recordsに移動

**成果物**:
- 更新された`src/components/ConfirmationModal.tsx`

#### Task 3.6: ConfirmedRecordsコンポーネントの作成
**何をするか**:
- 確認済み記録のリストを表示

**作成するファイル**: `src/components/ConfirmedRecords.tsx`

**表示する内容**:
- 確認済み記録のカード
- トランザクションハッシュ
- ブロック高
- 確認時刻
- ブロックチェーンアイコン

**成果物**:
- `src/components/ConfirmedRecords.tsx`

#### Task 3.7: ホームページのタブ切り替え実装
**何をするか**:
- Pending/Confirmedタブの切り替え機能

**更新するファイル**: `src/app/page.tsx`

**追加する機能**:
- タブ状態管理
- タブクリックで表示切り替え
- SSS Extension接続確認と表示

**成果物**:
- 更新された`src/app/page.tsx`

### Phase 3 完了条件
- [ ] SSS Extensionとの連携が動作する
- [ ] トランザクションが作成される
- [ ] SSS Extensionで署名できる
- [ ] Symbol Testnetにブロードキャストされる
- [ ] トランザクション確認を待機する
- [ ] 確認後、Confirmed Recordsに表示される
- [ ] トランザクションハッシュとブロック高が表示される

### Phase 3 テスト
**テスト手順書**: `docs/tests/test-blockchain-record.md`

**主な確認事項**:
- SSS Extension接続確認
- Walletに十分なXYMがあることを確認
- 実際にトランザクションを送信
- Symbol Explorerで確認

---

## ✅ Phase 4: 検証機能

### 目的
- トランザクションハッシュで記録を検証
- ハッシュ一致確認
- Symbol Explorerへのリンク

### タスク一覧

#### Task 4.1: 検証ロジックの実装
**何をするか**:
- ブロックチェーン上のトランザクションを検証

**作成するファイル**: `src/lib/symbol/verify.ts`

**実装する関数**:
- `fetchTransactionByHash()` - トランザクション取得
- `verifyContentHash()` - ハッシュ検証
- `verifyProof()` - 検証実行

**成果物**:
- `src/lib/symbol/verify.ts`

#### Task 4.2: ProofCardコンポーネントの作成
**何をするか**:
- 検証結果を表示するカード

**作成するファイル**: `src/components/ProofCard.tsx`

**表示する内容**:
- 検証ステータス（成功/失敗）
- トランザクション詳細
- ブロック情報
- Symbol Explorerリンク

**成果物**:
- `src/components/ProofCard.tsx`

#### Task 4.3: VerifyPanelコンポーネントの作成
**何をするか**:
- 検証UIパネル

**作成するファイル**: `src/components/VerifyPanel.tsx`

**機能**:
- トランザクションハッシュ入力
- Verifyボタン
- 検証結果表示

**成果物**:
- `src/components/VerifyPanel.tsx`

#### Task 4.4: 検証ページの実装
**何をするか**:
- 検証専用ページを作成

**作成するファイル**: `src/app/verify/page.tsx`

**機能**:
- `VerifyPanel`を表示
- 検証結果を`ProofCard`で表示

**成果物**:
- `src/app/verify/page.tsx`

### Phase 4 完了条件
- [ ] トランザクションハッシュを入力できる
- [ ] Verifyボタンで検証が実行される
- [ ] 検証結果が表示される（成功/失敗）
- [ ] Symbol Explorerリンクが動作する

### Phase 4 テスト
**テスト手順書**: `docs/tests/test-verification.md`

---

## 🌳 Phase 5: Learning Tree可視化

### 目的
- React Flowで学習ツリーを表示
- ノードとエッジの表示
- インタラクション（クリック、ズーム、パン）

### タスク一覧

#### Task 5.1: LearningNodeデータ生成
**何をするか**:
- `LearningRecord`から`LearningNode`を生成

**作成するファイル**: `src/lib/utils/tree.ts`

**実装する関数**:
- `convertRecordsToNodes()` - 記録をノードに変換
- `generateMockPrerequisites()` - モックの前提関係生成
- `calculateNodePositions()` - ノード座標計算

**成果物**:
- `src/lib/utils/tree.ts`

#### Task 5.2: LearningTreeコンポーネントの作成
**何をするか**:
- React Flowでツリーを表示

**作成するファイル**: `src/components/LearningTree.tsx`

**機能**:
- React Flow統合
- カスタムノードスタイル
- ノードクリックで詳細表示
- ズーム・パン操作

**成果物**:
- `src/components/LearningTree.tsx`

#### Task 5.3: Treeページの実装
**何をするか**:
- Learning Tree専用ページ

**作成するファイル**: `src/app/tree/page.tsx`

**機能**:
- `LearningTree`コンポーネントを表示
- Confirmed Recordsを読み込み

**成果物**:
- `src/app/tree/page.tsx`

### Phase 5 完了条件
- [ ] Learning Treeが表示される
- [ ] ノードをクリックで詳細表示
- [ ] ズーム・パン操作が動作する

### Phase 5 テスト
**簡易テスト（CLI上で指示）**:
1. `/tree`ページにアクセス
2. ノードが表示されることを確認
3. ノードをクリックして詳細表示を確認

---

## 🤖 Phase 6: AI要約とポリッシュ

### 目的
- Gemini APIで要約生成
- UIの洗練
- ポートフォリオページ

### タスク一覧

#### Task 6.1: Gemini API統合
**何をするか**:
- AI要約生成機能を実装

**作成するファイル**:
- `src/lib/ai/summarize.ts`
- `src/app/api/summarize/route.ts`

**実装する関数**:
- `generateSummary()` - クライアント側から呼び出し
- API Route - Gemini APIを呼び出し

**成果物**:
- `src/lib/ai/summarize.ts`
- `src/app/api/summarize/route.ts`

#### Task 6.2: 要約表示の統合
**何をするか**:
- Confirmed Recordsに要約を表示

**更新するファイル**:
- `src/components/RecordCard.tsx`
- `src/components/ConfirmedRecords.tsx`

**追加する機能**:
- トランザクション確認後に自動要約
- 要約をカードに表示
- リトライボタン

**成果物**:
- 更新された`src/components/RecordCard.tsx`
- 更新された`src/components/ConfirmedRecords.tsx`

#### Task 6.3: Headerコンポーネントの作成
**何をするか**:
- ナビゲーションヘッダー

**作成するファイル**: `src/components/Header.tsx`

**機能**:
- Home、Tree、Verify、Portfolioへのリンク
- SSS接続状態表示

**成果物**:
- `src/components/Header.tsx`

#### Task 6.4: Portfolioページの実装
**何をするか**:
- ポートフォリオ共有ページ

**作成するファイル**: `src/app/portfolio/[id]/page.tsx`

**機能**:
- 統計情報表示
- 記録リスト
- Learning Tree埋め込み

**成果物**:
- `src/app/portfolio/[id]/page.tsx`

#### Task 6.5: スタイリングとレスポンシブ対応
**何をするか**:
- Tailwind CSSでスタイリング
- モバイル対応

**更新するファイル**: 全コンポーネント

**成果物**:
- 洗練されたUI

### Phase 6 完了条件
- [ ] AI要約が生成される
- [ ] 要約がConfirmed Recordsに表示される
- [ ] Headerナビゲーションが動作する
- [ ] Portfolioページが表示される
- [ ] レスポンシブ対応完了

### Phase 6 テスト
**テスト手順書**: `docs/tests/test-ai-summary.md`

---

## 📊 進捗管理

### Todoリスト
**場所**: `.claude/implementation-todo.md`

**内容**:
- [ ] Phase 1: プロジェクトセットアップ
- [ ] Phase 2: 自動検出とPending Records
- [ ] Phase 3: SSS Extension統合
- [ ] Phase 4: 検証機能
- [ ] Phase 5: Learning Tree
- [ ] Phase 6: AI要約とポリッシュ

### 実装ログ
**場所**: `docs/logs/`

**作成するログファイル**:
- `phase-1-project-setup.md`
- `phase-2-pending-records.md`
- `phase-3-sss-integration.md`
- `phase-4-verification.md`
- `phase-5-learning-tree.md`
- `phase-6-ai-polish.md`

### テスト手順書
**場所**: `docs/tests/`

**作成するテスト手順書**:
- `test-pending-records.md`
- `test-blockchain-record.md`
- `test-verification.md`
- `test-ai-summary.md`

---

## 🎯 成功基準

### 最小限の動作（MVP）
- ✅ モックデータからPending Records表示
- ✅ SSS Extensionで署名
- ✅ Symbol Testnetに記録
- ✅ Confirmed Recordsに表示
- ✅ 検証機能が動作
- ✅ Learning Tree表示
- ✅ AI要約生成

### デモ可能な状態
- ✅ 3-5件のPending Records
- ✅ 実際にブロックチェーン記録できる
- ✅ Symbol Explorerで確認できる
- ✅ 検証ページで真正性確認できる

---

## 📝 注意事項

### 実装時の心構え
1. **DAO機能は実装しない** - TransferTransactionのみ
2. **シンプルに保つ** - 過度に複雑にしない
3. **段階的に進める** - 一度に全部やらない
4. **テストを欠かさない** - 各フェーズ完了時に確認

### よくある落とし穴
- ❌ `requestSignCosignatureTransaction`を使ってしまう → ✅ `requestSignTransaction`を使う
- ❌ `AggregateTransaction`を作ってしまう → ✅ `TransferTransaction`のみ
- ❌ エラーハンドリングを忘れる → ✅ try-catchを必ず実装

---

**実装開始準備完了！**

次のステップ:
1. `.claude/implementation-todo.md`を作成
2. Phase 1から順次実装開始
3. 各フェーズ完了ごとに実装ログを記録
