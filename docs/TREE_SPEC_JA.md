# 学習ツリー作成・表示仕様（実装版）

## 概要
- 目的: 確定済み学習記録（ConfirmedRecord）を、カテゴリと関連性にもとづいて可視化する。
- 範囲: ノード生成、カテゴリ判定、エッジ生成（時系列/類似度）、レイアウト（グリッド/極座標）、UI 表示。
- 関連ファイル:
  - ノード/レイアウト: `lib/tree/treeConverter.ts`
  - オントロジー/色: `lib/tree/ontology.ts`
  - 類似度: `lib/tree/similarity/*`
  - ビュー: `components/LearningTree/*`, `app/tree/page.tsx`

## 入力データ
- 入力: `ConfirmedRecord[]`（`lib/storage/localStorage.ts` から取得）
  - 主に使用する項目: `id`, `session.title`, `session.url`, `session.duration`, `session.startTime`, `transactionHash`, `blockHeight`, `verified`。

## カテゴリ判定
- 優先: オントロジー（`DEFAULT_ONTOLOGY`）の `terms.aliases` と canonical 名で照合しカテゴリ決定。
- 代替: 既知語に一致しない場合、正規表現でフォールバック（React/Next, TypeScript/JavaScript, Blockchain, CSS/Design, Backend, その他）。
- 実装: `extractSimpleCategory(url, title)`（`lib/tree/treeConverter.ts`）。

## ノード生成（React Flow）
- 変換: `convertRecordsToNodes(records)`
  - `type`: `learningRecord`
  - `data`:
    - `title`, `url`, `category`, `durationMinutes`, `dateISO(YYYY-MM-DD)`, `transactionHash`, `blockHeight`, `verified`。
- カスタムノード: `components/LearningTree/LearningRecordNode.tsx`
  - 表示: カテゴリバッジ（色は `getCategoryColor`）、タイトルリンク、日付・学習時間、ハッシュの一部、検証状態（✓/○）。

## エッジ生成
- 時系列エッジ（実線/アニメーション）
  - 同一カテゴリ内で `startTime` 昇順に並べ、隣接レコード同士を接続。
  - 実装: `generateTimelineEdges(records)`。
- 類似度エッジ（破線/スコアラベル）
  - Multi-signal 類似度により、ノード間の関連候補を接続。
  - デフォルト: 上位 `topK=2`、`minScore=0.35` 以上を採用。
  - 実装: `generateSimilarityEdges(records, topK, minScore)`。

## 類似度算出（Multi-signal）
- ルールベース（`rules.ts`）
  - 同カテゴリ一致（+0.5）、同ドメイン一致（+0.3）、タイトル単語重複（最大 +0.2）。
- 統計（`tfidf.ts`）
  - タイトル+URL をトークン化→平滑化 TF-IDF→コサイン類似度。
- 重み（初期値）
  - `rule:0.3`、`statistical:0.7`、`semantic:0.0`（埋め込み未使用時）。
- インターフェース: `calculateMultiSignalSimilarity(record1, record2, tfidf)`。

## レイアウト
- グリッド（カテゴリ × 時系列）
  - `layoutByCategory(nodes)`
  - カテゴリごとに列、日付昇順で行配置。
  - 定数: 列間隔 320px、行間隔 140px。
- 極座標（カテゴリ扇形 × 放射状）
  - `layoutPolar(nodes, { centerCategory? })`
  - カテゴリごとに角度セクターを均等割当。カテゴリ内は古い→新しい順に中心から外側へ配置。
  - `centerCategory` を先頭セクターに固定（UI から選択可能）。

## 表示/UI
- ビュー: `components/LearningTree/LearningTreeView.tsx`
  - ツールバー:
    - 類似度エッジ表示の切替（チェックボックス）。
    - レイアウト選択（グリッド/極座標）。
    - 極座標時のみ、中心カテゴリ選択。
  - 凡例: `CategoryLegend`（カテゴリ→色）。
  - キャンバス: React Flow（ズーム/パン可）、背景ドット、操作 UI。
- ページ: `app/tree/page.tsx`
  - `localStorage` の確定済みレコードを取得し、`LearningTreeView` に渡す。

## 非機能要件・制約
- パフォーマンス
  - 類似度行列は O(N^2)。N が大きい場合は `topK`/`minScore` の調整やバッチ化を検討。
- クライアント実行
  - すべてクライアント側で実行（SSR 不要）。`symbol-sdk` は既存機能で動的 import 済み。
- 設定拡張
  - パラメータ（`topK`、`minScore`、レイアウト定数）はコードに定義。必要に応じて UI で可変化可能。

## 拡張予定（任意）
- セマンティック類似度: 埋め込み（Gemini 等）導入、`semantic` シグナル追加（重み再調整）。
- 抽象度推定: ルール→LLM の二段階推定でレベル（1～5）付与し、極座標半径へ反映。
- 前提エッジ候補: 語彙被覆/時系列で DAG を満たす前提関係を推定。
- UI 強化: カテゴリフィルタ、ノード検索、状態保存（layout/toggles の `localStorage` 保持）。

## 例（簡易）
- 入力: `[{ title: 'React Hooks 入門', url: 'https://react.dev/learn', ... }]`
- カテゴリ: オントロジー照合→`React/Next.js`
- ノード: `type='learningRecord'`、バッジは `React/Next.js` 色
- エッジ: 同カテゴリ内で日付順に時系列エッジ、関連スコア >= 0.35 で類似度エッジ追加
- レイアウト: グリッド/極座標を UI で切替。中心カテゴリ（極座標のみ）選択可。

