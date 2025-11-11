# symproof-tree セットアップガイド

## 目次
1. [前提条件](#前提条件)
2. [環境構築手順](#環境構築手順)
3. [Symbol Wallet設定](#symbol-wallet設定)
4. [Testnet XYM取得](#testnet-xym取得)
5. [環境変数設定](#環境変数設定)
6. [依存パッケージのインストール](#依存パッケージのインストール)
7. [開発サーバーの起動](#開発サーバーの起動)
8. [トラブルシューティング](#トラブルシューティング)

---

## 前提条件

### システム要件

- **Node.js**: v18.17.0以上
- **npm**: v9.0.0以上
- **OS**: Windows 10/11, macOS 10.15+, Ubuntu 20.04+
- **ブラウザ**: Chrome 90+, Firefox 88+, Safari 14+

### 必要なアカウント

1. **Google AI API Key** (Gemini API使用)
   - [Google AI Studio](https://makersuite.google.com/app/apikey)でアカウント作成
   - API Keyを発行（無料枠あり）

2. **Symbol Wallet** (Testnet用)
   - Symbol Desktop WalletまたはSymbol Extension Wallet
   - Testnetモードで使用

---

## 環境構築手順

### 1. リポジトリのクローン

```bash
# リポジトリをクローン（URLは適宜変更）
git clone https://github.com/yourusername/symproof-tree.git
cd symproof-tree
```

### 2. Node.jsバージョン確認

```bash
# Node.jsバージョン確認
node --version
# v18.17.0以上であることを確認

# npmバージョン確認
npm --version
# v9.0.0以上であることを確認
```

バージョンが古い場合は[Node.js公式サイト](https://nodejs.org/)から最新版をインストールしてください。

---

## Symbol Wallet設定

### オプション1: Symbol Desktop Wallet（推奨）

#### インストール

1. [Symbol Desktop Wallet](https://github.com/symbol/desktop-wallet/releases)から最新版をダウンロード
2. OSに応じたインストーラーを実行

#### Testnetアカウント作成

1. ウォレットを起動
2. 右上の設定アイコンをクリック
3. 「ネットワーク設定」→「Testnet」を選択
4. 「新しいアカウント」をクリック
5. ニーモニックフレーズを安全に保管（**絶対に他人に教えない**）
6. アカウント名を設定（例: "symproof-demo"）
7. アカウント作成完了

#### アドレスの確認

- ダッシュボードに表示されるアドレスをコピー（例: `TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`）
- このアドレスがユーザーIDとして使用されます

### オプション2: Symbol Extension Wallet（ブラウザ拡張）

#### インストール

1. [Chrome Web Store](https://chrome.google.com/webstore/)で「Symbol Wallet」を検索
2. 「Chromeに追加」をクリック

#### 設定

1. 拡張機能アイコンをクリック
2. 「Create New Wallet」を選択
3. Testnetモードを選択
4. パスワードを設定
5. ニーモニックフレーズを保管
6. アカウント作成完了

---

## Testnet XYM取得

### Faucet（蛇口）を使用

Testnet XYMは無料で取得できます。トランザクション手数料として必要です。

#### 手順

1. **Symbol Faucetにアクセス**
   - URL: http://faucet.testnet.symbol.dev/
   - または: https://testnet.symbol.tools/

2. **アドレスを入力**
   - Symbol Walletで確認したアドレスを入力
   - 「CLAIM!」または「GET XYM」ボタンをクリック

3. **受信確認**
   - 通常30秒〜1分で着金
   - Symbol Desktop Walletで残高を確認
   - 目安: 100 XYM以上あれば十分（トランザクション手数料は約0.02 XYM/回）

#### トラブルシューティング

- **着金しない場合**:
  - ネットワークがTestnetになっているか確認
  - アドレスが正しいか再確認
  - 24時間以内に同じアドレスで複数回請求していないか確認（制限あり）

- **Faucetが使えない場合**:
  - 別のFaucetサービスを試す
  - [Symbol Discord](https://discord.gg/xymcity)で相談（英語）

---

## 環境変数設定

### 1. `.env.local`ファイルの作成

プロジェクトルートに`.env.local`ファイルを作成します。

```bash
# プロジェクトルートで実行
touch .env.local
```

### 2. 環境変数の記入

`.env.local`に以下の内容を記入してください：

```bash
# Symbol Blockchain設定
NEXT_PUBLIC_SYMBOL_NETWORK_TYPE=testnet
NEXT_PUBLIC_SYMBOL_NODE_URL=https://sym-test-03.opening-line.jp:3001
NEXT_PUBLIC_SYMBOL_GENERATION_HASH=49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4

# Google AI API設定（サーバーサイドのみ）
GOOGLE_AI_API_KEY=your-actual-google-ai-api-key-here

# アプリケーション設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=symproof-tree
```

### 3. API Keyの設定

`GOOGLE_AI_API_KEY`を実際の値に置き換えてください：

1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
2. Googleアカウントでログイン
3. 「Create API Key」をクリック
4. 生成されたキーをコピー
5. `.env.local`の`GOOGLE_AI_API_KEY`に貼り付け

**重要**:
- `.env.local`は`.gitignore`に含まれており、Gitにコミットされません
- API Keyを他人に共有しないでください
- 公開リポジトリにアップロードしないでください

### 4. 環境変数の説明

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `NEXT_PUBLIC_SYMBOL_NETWORK_TYPE` | Symbolネットワークタイプ（testnet固定） | ✅ |
| `NEXT_PUBLIC_SYMBOL_NODE_URL` | SymbolノードのURL | ✅ |
| `NEXT_PUBLIC_SYMBOL_GENERATION_HASH` | TestnetのGenesis Hash | ✅ |
| `GOOGLE_AI_API_KEY` | Gemini APIキー | ✅ |
| `NEXT_PUBLIC_APP_URL` | アプリケーションのベースURL | ✅ |
| `NEXT_PUBLIC_APP_NAME` | アプリケーション名 | ⚪ |

---

## 依存パッケージのインストール

### 1. パッケージインストール

```bash
# プロジェクトルートで実行
npm install
```

インストールされる主要パッケージ：

- `next@14.x` - Next.jsフレームワーク
- `react@18.x` - Reactライブラリ
- `typescript@5.x` - TypeScript
- `tailwindcss@3.x` - CSSフレームワーク
- `symbol-sdk@3.x` - Symbol blockchain SDK
- `@google/generative-ai` - Gemini API SDK
- `reactflow` - グラフ可視化ライブラリ
- `uuid` - UUID生成

### 2. インストール確認

```bash
# インストールされたパッケージを確認
npm list --depth=0
```

エラーが出た場合は[トラブルシューティング](#トラブルシューティング)を参照してください。

---

## 開発サーバーの起動

### 1. サーバー起動

```bash
npm run dev
```

正常に起動すると以下のようなメッセージが表示されます：

```
> symproof-tree@0.1.0 dev
> next dev

   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Ready in 2.5s
```

### 2. ブラウザでアクセス

ブラウザで以下のURLを開きます：

```
http://localhost:3000
```

### 3. 初期画面の確認

- **ホームページ**: Pending RecordsとConfirmed Recordsのタブが表示される
- **ナビゲーション**: Header with links to Home, Tree, Portfolio, Verify
- **Mock Data**: Pending Recordsに10-15件の自動検出された学習記録が表示される

---

## 動作確認

### 基本機能テスト

#### 1. Pending Recordsの表示

- ホームページの「Pending」タブに自動検出された記録が表示されているか確認
- 各記録カードに以下の情報が表示されているか：
  - タイトル
  - URL
  - 学習時間（分）
  - 理解度スコア（1-5）
  - タグ
  - 自動生成されたメモ

#### 2. 記録の確認フロー

1. Pending Recordsから任意の記録カードをクリック
2. 確認モーダルが表示されることを確認
3. すべてのフィールドが読み取り専用であることを確認
4. 「ブロックチェーンに記録する」ボタンが表示されることを確認
5. **実際にトランザクションを送信する前に**Symbol Walletに十分なXYMがあることを確認

#### 3. ブロックチェーン記録テスト

1. 確認モーダルで「ブロックチェーンに記録する」をクリック
2. Symbol Walletの署名画面が表示される
3. 署名を承認
4. トランザクション送信中のローディング表示を確認
5. 約30秒後、記録がConfirmed Recordsタブに移動
6. トランザクションハッシュとブロック高が表示されることを確認

#### 4. Learning Tree表示

1. ナビゲーションから「Tree」ページに移動
2. React Flowによるグラフが表示される
3. ノードをクリックして詳細が表示されるか確認
4. ズーム・パン操作が動作するか確認

#### 5. AI要約生成

1. Confirmed Recordsタブに戻る
2. ブロックチェーン確認後、しばらく待つ（10-20秒）
3. AI生成された日本語の要約が表示されることを確認
4. 要約が記録内容を適切に反映しているか確認

#### 6. 検証機能

1. ナビゲーションから「Verify」ページに移動
2. Confirmed Recordから任意のトランザクションハッシュをコピー
3. 検証ページに貼り付けて「Verify」をクリック
4. 検証結果が表示される：
   - ✅ Transaction exists
   - ✅ Content hash matches
   - ✅ Timestamp verified
5. Symbol Explorerリンクをクリックして外部で確認

---

## トラブルシューティング

### 依存パッケージのエラー

#### 問題: `npm install`でエラーが出る

**解決策1**: キャッシュをクリア

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**解決策2**: Node.jsバージョンを確認

```bash
node --version
# v18.17.0以上が必要
```

古い場合は[nvm](https://github.com/nvm-sh/nvm)を使用してバージョンを切り替え：

```bash
nvm install 18
nvm use 18
npm install
```

### Symbol SDK関連のエラー

#### 問題: `Cannot find module 'symbol-sdk'`

**解決策**: symbol-sdkを再インストール

```bash
npm uninstall symbol-sdk
npm install symbol-sdk@3
```

#### 問題: ノード接続エラー

```
Error: Connection to Symbol node failed
```

**解決策**:

1. `.env.local`のノードURLを確認
2. 代替ノードを試す：

```bash
# .env.localを編集
NEXT_PUBLIC_SYMBOL_NODE_URL=https://001-sai-dual.symboltest.net:3001
```

3. ノードの状態を確認：

```bash
curl https://sym-test-03.opening-line.jp:3001/node/health
```

### Gemini API関連のエラー

#### 問題: `GOOGLE_AI_API_KEY is not defined`

**解決策**:

1. `.env.local`が存在するか確認
2. API Keyが正しく設定されているか確認
3. サーバーを再起動

```bash
# Ctrl+Cでサーバー停止
npm run dev
```

#### 問題: `Rate limit exceeded`

Gemini APIのレート制限を超えた場合に発生。

**解決策**:

1. [Google AI Studio](https://makersuite.google.com/app/apikey)で使用状況を確認
2. 無料枠: 15 requests/minute, 1500 requests/day
3. しばらく待ってから再試行
4. 必要に応じて課金プランを検討

### Transaction関連のエラー

#### 問題: `Insufficient balance`

**解決策**:

1. Symbol Walletの残高を確認
2. Testnet XYMが不足している場合はFaucetから取得
3. 最低10 XYM以上推奨

#### 問題: `Transaction timeout`

60秒経ってもトランザクションが確認されない。

**解決策**:

1. Symbol Testnetの状態を確認（[Symbol Explorer](https://testnet.symbol.fyi/)）
2. ネットワークが混雑している可能性
3. 「Retry」ボタンをクリックして再送信
4. または、別のノードに切り替え

### ブラウザ関連の問題

#### 問題: Symbol Wallet Extension が動作しない

**解決策**:

1. 拡張機能が有効になっているか確認
2. ブラウザを再起動
3. Symbol Desktop Walletを使用（より安定）

#### 問題: LocalStorageが保存されない

**解決策**:

1. ブラウザのプライベートモードを無効化
2. ブラウザのストレージ設定を確認
3. 開発者ツール（F12）→ Application → Local Storage で確認

### Next.js関連のエラー

#### 問題: `Module not found` エラー

**解決策**:

```bash
# TypeScript型定義を再生成
npm run build
```

#### 問題: Hot Reload が動作しない

**解決策**:

1. サーバーを再起動
2. `.next`フォルダを削除して再起動

```bash
rm -rf .next
npm run dev
```

---

## 本番環境へのデプロイ（参考）

### Vercelへのデプロイ

1. [Vercel](https://vercel.com/)にサインアップ
2. GitHubリポジトリを接続
3. 環境変数を設定：
   - `GOOGLE_AI_API_KEY`
   - その他の`NEXT_PUBLIC_*`変数
4. デプロイ実行

### 注意事項

- **GOOGLE_AI_API_KEY**は環境変数として設定（コードに含めない）
- Symbol WalletはユーザーのローカルPCにインストール必要
- LocalStorageはブラウザ依存のため、デバイス間で同期されない

---

## 開発Tips

### ホットリロード

ファイルを編集すると自動的にブラウザがリロードされます。

### TypeScript型チェック

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Mock データの編集

- `public/mock-browsing-sessions.json`: Pending Recordsのデータソース
- `public/mock-confirmed-records.json`: 初期Confirmed Recordsとツリー表示用

これらのファイルを編集してデモデータをカスタマイズできます。

---

## 次のステップ

セットアップが完了したら、以下を参照してください：

- [DEMO_GUIDE.md](./DEMO_GUIDE.md) - デモシナリオと実施手順
- [ARCHITECTURE.md](./ARCHITECTURE.md) - システムアーキテクチャの詳細
- [DATA_MODELS.md](./DATA_MODELS.md) - データモデル仕様

---

## サポート

問題が解決しない場合：

1. **GitHub Issues**: プロジェクトのIssuesページで質問
2. **Symbol Discord**: [Symbol Community](https://discord.gg/xymcity)
3. **Google AI Support**: [Google AI Documentation](https://ai.google.dev/)

---

**セットアップ完了おめでとうございます！ 🎉**

デモの準備が整いました。[DEMO_GUIDE.md](./DEMO_GUIDE.md)を参照してデモを実施してください。
