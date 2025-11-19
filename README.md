# symproof-tree

**Symbol Blockchain × 学習証跡管理システム**

学習活動を自動検出し、Symbolブロックチェーンで改ざん不可能な証跡として記録する、Web3ベースの学習ポートフォリオプラットフォームです。

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Symbol](https://img.shields.io/badge/Symbol-Testnet-green)](https://docs.symbol.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 目次

- [概要](#概要)
- [主な機能](#主な機能)
- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [使用方法](#使用方法)
- [アーキテクチャ](#アーキテクチャ)
- [ディレクトリ構成](#ディレクトリ構成)
- [デモシナリオ](#デモシナリオ)
- [トラブルシューティング](#トラブルシューティング)
- [今後の展望](#今後の展望)
- [ライセンス](#ライセンス)

---

## 概要

### 背景

従来の学習ポートフォリオは、ユーザー自身が手動で記録するため、以下の課題がありました：

- **主観的な記録**: ユーザーが恣意的に内容を編集・装飾できる
- **改ざんリスク**: 後から記録を書き換えることが可能
- **証明困難**: 第三者が真正性を検証する手段がない

### 解決策

**symproof-tree**は、以下の技術を組み合わせて、客観的で改ざん不可能な学習証跡を実現します：

1. **自動検出**: ブラウザでの学習活動を自動的にキャプチャ（ユーザーによる編集不可）
2. **ブロックチェーン証明**: Symbolネットワークで改ざん不可能な記録を作成
3. **即座に検証可能**: 第三者が数秒で記録の真正性を確認
4. **視覚的な進捗管理**: 学習ツリーで知識の体系を可視化

### 想定ユースケース

- **就職活動**: 企業に対して客観的な学習履歴を証明
- **自己学習管理**: 学習の進捗を視覚的に把握し、モチベーション向上
- **教育機関**: 学生の学習活動を透明かつ公正に記録

---

## 主な機能

### 1. 学習記録の作成

- ✅ 手動入力による学習記録の作成
- ✅ タイトル、科目、学習時間、理解度、メモの入力
- ✅ リアルタイムバリデーション

### 2. ブロックチェーン登録

- ✅ SSS Extension（Symbol Signer）との連携
- ✅ TransferTransactionによる記録の永続化
- ✅ トランザクションハッシュの自動取得
- ✅ ブロック高の記録

### 3. 記録の検証

- ✅ トランザクションハッシュによる検証
- ✅ Symbol REST APIからの情報取得
- ✅ メッセージのデコードとJSON表示
- ✅ Symbol Explorerへのリンク

### 4. 確定済みレコード管理

- ✅ 確定済みレコードの一覧表示
- ✅ 統計情報（合計、検証済み、未検証）
- ✅ 検証ページへのワンクリック遷移

### 5. 学習ツリー可視化

- ✅ React Flowによるインタラクティブなツリー表示
- ✅ ズーム・パン機能
- ✅ ノードの詳細情報表示

### 6. ポートフォリオ共有

- ✅ 公開可能なポートフォリオURL
- ✅ 学習統計のダッシュボード表示

---

## 技術スタック

### フロントエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| **Next.js** | 14 (App Router) | Reactフレームワーク |
| **React** | 18 | UIライブラリ |
| **TypeScript** | 5.0 | 型安全性 |
| **Tailwind CSS** | 3.4 | スタイリング |
| **React Flow** | 11 | 学習ツリー可視化 |

### ブロックチェーン

| 技術 | 用途 |
|------|------|
| **Symbol SDK v3** | トランザクション作成 |
| **SSS Module** | SSS Extensionとの連携 |
| **Symbol Testnet** | ブロックチェーンネットワーク |

### ストレージ

| 技術 | 用途 |
|------|------|
| **LocalStorage** | ブラウザ内データ永続化 |
| **Symbol Blockchain** | 改ざん不可能な証跡記録 |

---

## セットアップ

### 前提条件

1. **Node.js**: v18.0以上
2. **npm**: v9.0以上
3. **SSS Extension**: Symbol Signerブラウザ拡張機能
4. **Testnet XYM**: テストネットのXYMトークン（Faucetから取得）

### インストール手順

#### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/symproof-tree.git
cd symproof-tree
```

#### 2. 依存関係のインストール

```bash
npm install
```

#### 3. 環境変数の設定

`.env.local` ファイルを作成:

```bash
# Symbol Blockchain設定
NEXT_PUBLIC_SYMBOL_NODE_URL=https://sym-test-03.opening-line.jp:3001
NEXT_PUBLIC_SYMBOL_NETWORK_TYPE=152
NEXT_PUBLIC_SYMBOL_GENERATION_HASH=49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4
NEXT_PUBLIC_SYMBOL_EPOCH_ADJUSTMENT=1667250467

# トランザクション設定
NEXT_PUBLIC_SYMBOL_MAX_FEE=100000
NEXT_PUBLIC_SYMBOL_DEADLINE_HOURS=2

# アプリケーション設定
NEXT_PUBLIC_APP_NAME=symproof-tree
```

#### 4. SSS Extensionのインストール

1. Chromeウェブストアから「SSS Extension」をインストール
2. 拡張機能を開き、新規アカウントを作成またはインポート
3. ネットワークを「Testnet」に切り替え
4. Faucetからテストネット用XYMを取得:
   - https://testnet.symbol.tools/

#### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

---

## 使用方法

### 基本的なワークフロー

#### 1. 学習記録の作成

1. ホームページ（`/`）にアクセス
2. 学習記録フォームに以下を入力:
   - **タイトル**: 学習内容の簡潔な説明（例: "React Hooksの学習"）
   - **科目**: カテゴリ（例: "プログラミング"）
   - **学習時間**: 分単位（例: 90）
   - **理解度**: 1～5の5段階
   - **メモ**: 詳細な記録（任意）
3. 「保存」ボタンをクリック
4. レコードが「保留中」タブに表示される

#### 2. ブロックチェーンへの登録

1. 「保留中」ページ（`/pending`）に移動
2. 登録したいレコードの「ブロックチェーンに登録」ボタンをクリック
3. SSS Extensionのポップアップで以下を確認:
   - 受信者アドレス（自分自身）
   - メッセージ内容（学習記録のJSON）
   - 手数料
4. 「承認」ボタンをクリックして署名
5. トランザクションが送信される
6. 約30秒後、ブロックで承認される
7. レコードが「確定済み」タブに移動

#### 3. 記録の検証

##### 方法A: 確定済みページから

1. 「確定済み」ページ（`/verified`）に移動
2. 検証したいレコードの「検証ページで確認」ボタンをクリック
3. 自動的に検証が実行され、結果が表示される

##### 方法B: 直接入力

1. 「検証」ページ（`/verify`）に移動
2. トランザクションハッシュ（64文字の16進数）を入力
3. 「検証する」ボタンをクリック
4. 検証結果が表示:
   - ✅ 成功: 緑色のバナー、トランザクション詳細表示
   - ✗ 失敗: 赤色のバナー、エラーメッセージ表示

#### 4. 学習ツリーの表示

1. 「学習ツリー」ページ（`/tree`）に移動
2. 確定済みレコードが階層構造で表示される
3. マウスでドラッグしてパン
4. マウスホイールでズーム
5. ノードをクリックして詳細情報を表示

#### 5. ポートフォリオの共有

1. 「ポートフォリオ」ページ（`/portfolio/[address]`）にアクセス
2. URLを企業や友人に共有
3. 統計情報と学習ツリーが表示される

---

## アーキテクチャ

### システム構成図

```
┌─────────────────────────────────────────────────────────┐
│                     ブラウザ                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Next.js App (React + TypeScript)         │   │
│  │                                                   │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────┐ │   │
│  │  │   UI Layer  │  │ Business     │  │Storage │ │   │
│  │  │  (Pages &   │→ │   Logic      │→ │ Local  │ │   │
│  │  │ Components) │  │ (lib/)       │  │Storage │ │   │
│  │  └─────────────┘  └──────────────┘  └────────┘ │   │
│  │                           ↓                      │   │
│  │                    ┌──────────────┐             │   │
│  │                    │ Symbol SDK   │             │   │
│  │                    │ SSS Module   │             │   │
│  │                    └──────────────┘             │   │
│  └───────────────────────────│───────────────────────┘│
│                              ↓                          │
│                    ┌──────────────────┐                │
│                    │  SSS Extension   │                │
│                    │  (署名処理)       │                │
│                    └──────────────────┘                │
└─────────────────────────────│───────────────────────────┘
                              ↓
                   ┌──────────────────────┐
                   │  Symbol Testnet      │
                   │  REST API Node       │
                   │  (sym-test-03...)    │
                   └──────────────────────┘
                              ↓
                   ┌──────────────────────┐
                   │  Symbol Blockchain   │
                   │  (Distributed Ledger)│
                   └──────────────────────┘
```

### データフロー

#### 記録作成 → ブロックチェーン登録

```
1. ユーザー入力
   ↓
2. バリデーション (クライアント)
   ↓
3. PendingRecord作成 (LocalStorage)
   ↓
4. ユーザーが「登録」をクリック
   ↓
5. TransferTransaction作成 (Symbol SDK)
   ↓
6. SSS Extensionで署名
   ↓
7. トランザクション送信 (REST API)
   ↓
8. ブロック承認待機 (~30秒)
   ↓
9. ConfirmedRecord作成 (LocalStorage)
```

#### トランザクション検証

```
1. トランザクションハッシュ入力
   ↓
2. バリデーション (64文字16進数)
   ↓
3. REST API GET /transactions/confirmed/{hash}
   ↓
4. レスポンス取得 (JSON)
   ↓
5. メッセージデコード (16進数→UTF-8→JSON)
   ↓
6. Symbol時刻変換 (Epoch→Date)
   ↓
7. 検証結果表示
```

---

## ディレクトリ構成

```
symproof-tree/
├── app/                           # Next.js App Routerページ
│   ├── page.tsx                   # ホームページ（学習記録作成）
│   ├── pending/                   # 保留中レコード
│   │   └── page.tsx
│   ├── verified/                  # 確定済みレコード
│   │   └── page.tsx
│   ├── verify/                    # 検証ページ
│   │   └── page.tsx
│   ├── tree/                      # 学習ツリー可視化
│   │   └── page.tsx
│   ├── portfolio/                 # ポートフォリオ共有
│   │   └── [id]/
│   │       └── page.tsx
│   ├── api/                       # API Routes (未使用)
│   ├── layout.tsx                 # ルートレイアウト
│   └── globals.css                # グローバルスタイル
│
├── components/                    # Reactコンポーネント
│   ├── Navigation.tsx             # ナビゲーションヘッダー
│   ├── RecordList.tsx             # レコード一覧（汎用）
│   ├── LearningRecordForm.tsx     # 学習記録入力フォーム
│   └── LearningTreeView.tsx       # 学習ツリー表示
│
├── lib/                           # ビジネスロジック
│   ├── symbol/                    # Symbol関連
│   │   ├── config.ts              # 設定管理
│   │   ├── sssSimple.ts           # SSS Extension連携
│   │   └── verify.ts              # トランザクション検証
│   └── storage/                   # ストレージ管理
│       └── localStorage.ts        # LocalStorage操作
│
├── types/                         # TypeScript型定義
│   └── index.ts                   # 共通型
│
├── constants/                     # 定数定義
│   └── index.ts                   # エラーコード、メッセージ
│
├── docs/                          # ドキュメント
│   ├── SPEC.md                    # プロジェクト仕様書
│   ├── tests/                     # テスト手順書
│   │   ├── phase-3-transaction-test.md
│   │   └── phase-4-verification-test.md
│   └── logs/                      # 実装ログ
│       ├── phase-3-debugging-log.md
│       └── phase-4-implementation-log.md
│
├── public/                        # 静的ファイル
│
├── .env.local                     # 環境変数（Git管理外）
├── .env.example                   # 環境変数テンプレート
├── next.config.js                 # Next.js設定
├── tailwind.config.ts             # Tailwind CSS設定
├── tsconfig.json                  # TypeScript設定
├── package.json                   # npm依存関係
└── README.md                      # このファイル
```

---

## トラブルシューティング

### 問題: SSS Extensionが認識されない

**症状**: 「SSS Extension is not installed」エラーが表示される

**解決方法**:
1. SSS Extensionがインストールされているか確認
2. ブラウザを再起動
3. 拡張機能がTestnetモードになっているか確認
4. ページをリロード

### 問題: トランザクションが失敗する

**症状**: トランザクション送信後にエラーが発生

**解決方法**:
1. アカウントに十分なXYMがあるか確認（最低1 XYM）
2. ノードURLが正しいか確認（`.env.local`）
3. ネットワークタイプがTestnet（152）か確認
4. SSS Extensionのネットワーク設定を確認

### 問題: 検証ページで「トランザクションが見つかりません」

**症状**: 有効なハッシュでも検証失敗

**解決方法**:
1. トランザクションが承認されるまで30秒～1分待機
2. トランザクションハッシュが正しいか確認（64文字の16進数）
3. ノードURLが正しいか確認
4. Symbol Explorerで直接トランザクションを確認

### 問題: ビルドエラー

**症状**: `npm run build` でエラーが発生

**解決方法**:
1. `node_modules` を削除して再インストール:
   ```bash
   rm -rf node_modules
   npm install
   ```
2. `.next` フォルダを削除:
   ```bash
   rm -rf .next
   npm run build
   ```
3. Node.jsのバージョンを確認（v18以上）

---

## 貢献

貢献を歓迎します！以下の手順でPull Requestを送信してください：

1. このリポジトリをフォーク
2. 新しいブランチを作成（`git checkout -b feature/amazing-feature`）
3. 変更をコミット（`git commit -m 'Add amazing feature'`）
4. ブランチにプッシュ（`git push origin feature/amazing-feature`）
5. Pull Requestを作成

---

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

---

**Built with ❤️ using Symbol Blockchain**
