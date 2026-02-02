# symproof-tree

**Symbol Blockchain × 学習証跡管理システム**

学習活動を自動検出し、Symbolブロックチェーンで改ざん不可能な証跡として記録する、Web3ベースの学習ポートフォリオプラットフォームです。

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Symbol](https://img.shields.io/badge/Symbol-Testnet-green)](https://docs.symbol.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

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

### 1. 学習活動の自動検出

- ブラウジングセッションからの学習活動自動検出（`lib/detection/`）
- 検出された記録は保留中（Pending）として管理
- モックデータによるデモ機能あり

### 2. ブロックチェーン登録

- SSS Extension（Symbol Signer）との連携（`lib/symbol/sssSimple.ts`）
- TransferTransactionによる記録の永続化
- トランザクションハッシュの自動取得

### 3. 記録の検証

- トランザクションハッシュによるオンチェーン検証（`/verify`）
- Symbol REST APIからの情報取得・メッセージデコード
- Symbol Explorerへのリンク

### 4. 学習ツリー可視化

- React Flowによるインタラクティブなツリー表示（`/tree`）
- **タイムラインレイアウト**: カテゴリ別の時系列表示
- **極座標レイアウト**: 抽象度に基づく放射状表示（基礎→中心、専門→外周）
- オントロジーベースの自動カテゴリ分類（JavaScript, React, Blockchain 等）
- 抽象度推定（5段階、ルールベース＋Gemini API）
- 類似度エッジ表示（TF-IDF + ルールベースのマルチシグナルスコアリング）
- ズーム・パン・ノード詳細表示

### 5. ダッシュボード

- 保留中・確定済みレコード数の統計表示（`/`）
- 各機能へのクイックアクセス
- 最近の記録一覧

---

## 技術スタック

### フロントエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| **Next.js** | 14 (App Router) | Reactフレームワーク |
| **React** | 18 | UIライブラリ |
| **TypeScript** | 5.x | 型安全性 |
| **Tailwind CSS** | 3.4 | スタイリング |
| **React Flow** | 11 | 学習ツリー可視化 |

### ブロックチェーン

| 技術 | 用途 |
|------|------|
| **Symbol SDK v3** | トランザクション作成 |
| **SSS Module** | SSS Extensionとの連携 |
| **Symbol Testnet** | ブロックチェーンネットワーク |

### AI / NLP

| 技術 | 用途 |
|------|------|
| **Google Generative AI (Gemini)** | 抽象度推定のLLM検証、セマンティック類似度（オプション） |

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

```bash
# 1. リポジトリのクローン
git clone https://github.com/DaichiHiraoka/symproof-tree-.git
cd symproof-tree-

# 2. 依存関係のインストール
npm install

# 3. 環境変数の設定
cp .env.example .env.local
# .env.local を編集:
#   NEXT_PUBLIC_SYMBOL_NODE_URL - Symbol Testnetノード URL
#   GOOGLE_AI_API_KEY - Google Gemini API キー（ツリー機能の抽象度推定に使用、オプション）

# 4. 開発サーバーの起動
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

### SSS Extensionの準備

1. Chromeウェブストアから「SSS Extension」をインストール
2. 拡張機能を開き、新規アカウントを作成またはインポート
3. ネットワークを「Testnet」に切り替え
4. [Faucet](https://testnet.symbol.tools/) からテストネット用XYMを取得

---

## ページ構成

| パス | 機能 |
|------|------|
| `/` | ダッシュボード（統計・クイックアクション・最近の記録） |
| `/pending` | 保留中レコード一覧・ブロックチェーン登録 |
| `/verified` | 確定済みレコード一覧 |
| `/verify` | トランザクションハッシュによる検証 |
| `/tree` | 学習ツリー可視化（タイムライン/極座標レイアウト） |

---

## ディレクトリ構成

```
symproof-tree/
├── app/                              # Next.js App Routerページ
│   ├── page.tsx                      # ダッシュボード
│   ├── pending/page.tsx              # 保留中レコード
│   ├── verified/page.tsx             # 確定済みレコード
│   ├── verify/page.tsx               # 検証ページ
│   ├── tree/page.tsx                 # 学習ツリー可視化
│   ├── layout.tsx                    # ルートレイアウト
│   └── globals.css                   # グローバルスタイル
│
├── components/                       # Reactコンポーネント
│   ├── Navigation.tsx                # ナビゲーションヘッダー
│   ├── RecordCard.tsx                # レコードカード表示
│   ├── RecordList.tsx                # レコード一覧（汎用）
│   └── LearningTree/                # 学習ツリー関連
│       ├── LearningTreeView.tsx      # ツリーメインビュー
│       ├── LearningRecordNode.tsx    # カスタムノード
│       └── CategorySelector.tsx      # カテゴリ選択（極座標用）
│
├── lib/                              # ビジネスロジック
│   ├── symbol/                       # Symbol Blockchain連携
│   │   ├── config.ts                 # ネットワーク設定
│   │   ├── facade.ts                 # 簡易インターフェース
│   │   ├── sssSimple.ts             # SSS Extension連携
│   │   ├── verify.ts                 # トランザクション検証
│   │   └── workflowSimple.ts        # 登録ワークフロー
│   ├── detection/                    # 学習活動検出
│   │   ├── autoDetect.ts            # 自動検出（モックデータ読込）
│   │   └── pendingRecords.ts        # 保留中レコード管理
│   ├── tree/                         # ツリー構築ロジック
│   │   ├── ontology.ts              # ドメイン語彙・カテゴリ定義
│   │   ├── abstractionEstimator.ts  # 抽象度推定（5段階）
│   │   ├── similarityScorer.ts      # 類似度スコアリング
│   │   ├── treeLayout.ts            # タイムラインレイアウト
│   │   ├── polarLayout.ts           # 極座標レイアウト
│   │   └── treeConverter.ts         # React Flow形式変換
│   ├── ai/                           # AI連携
│   │   └── geminiClient.ts          # Google Gemini APIクライアント
│   ├── storage/                      # ストレージ管理
│   │   └── localStorage.ts          # LocalStorage操作
│   └── utils/                        # ユーティリティ
│       └── hash.ts                   # ハッシュ生成
│
├── types/index.ts                    # TypeScript型定義
├── constants/index.ts                # 定数定義
├── public/mock/                      # モックデータ（デモ用）
├── docs/                             # ドキュメント
└── .env.example                      # 環境変数テンプレート
```

---

## ライセンス

MIT License
