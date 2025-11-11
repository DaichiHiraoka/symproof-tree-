# symproof-tree 実装Todoリスト

**最終更新**: 2025-11-12

---

## 🎯 全体進捗

- [ ] **Phase 1**: プロジェクトセットアップ（2-3日）
- [ ] **Phase 2**: 自動検出とPending Records（3-4日）
- [ ] **Phase 3**: SSS Extension統合（3-4日）
- [ ] **Phase 4**: 検証機能（2-3日）
- [ ] **Phase 5**: Learning Tree（2-3日）
- [ ] **Phase 6**: AI要約とポリッシュ（2-3日）

---

## 📋 Phase 1: プロジェクトセットアップ

### 優先度: 🔴 最優先

- [ ] **Task 1.1**: Next.jsプロジェクトの初期化
  - 依存関係: なし
  - 成果物: `package.json`, `tsconfig.json`, `tailwind.config.ts`

- [ ] **Task 1.2**: 依存パッケージのインストール
  - 依存関係: Task 1.1
  - 成果物: 更新された`package.json`, `package-lock.json`

- [ ] **Task 1.3**: ディレクトリ構造の構築
  - 依存関係: Task 1.1
  - 成果物: 全ディレクトリ

- [ ] **Task 1.4**: 型定義ファイルの作成
  - 依存関係: Task 1.3
  - 成果物: `src/types/index.ts`

- [ ] **Task 1.5**: Constants設定
  - 依存関係: Task 1.3
  - 成果物: `src/constants/index.ts`

- [ ] **Task 1.6**: 環境変数設定
  - 依存関係: なし
  - 成果物: `.env.example`, `.env.local`

- [ ] **Task 1.7**: モックデータの作成
  - 依存関係: Task 1.4
  - 成果物: `public/mock-browsing-sessions.json`, `public/mock-confirmed-records.json`

### Phase 1 完了条件
- [ ] 全タスク完了
- [ ] `npm run dev`でサーバー起動
- [ ] 実装ログ作成: `docs/logs/phase-1-project-setup.md`

---

## 📝 Phase 2: 自動検出とPending Records

### 優先度: 🟡 高

- [ ] **Task 2.1**: 自動検出ロジックの実装
  - 依存関係: Phase 1完了
  - 成果物: `src/lib/detection/auto-tracker.ts`, `score-calculator.ts`, `tag-extractor.ts`

- [ ] **Task 2.2**: コンテンツハッシュ計算
  - 依存関係: Task 2.1
  - 成果物: `src/lib/utils/hash.ts`

- [ ] **Task 2.3**: LocalStorage操作の実装
  - 依存関係: Phase 1完了
  - 成果物: `src/lib/storage/local.ts`

- [ ] **Task 2.4**: RecordCardコンポーネントの作成
  - 依存関係: Phase 1完了
  - 成果物: `src/components/RecordCard.tsx`

- [ ] **Task 2.5**: PendingRecordsコンポーネントの作成
  - 依存関係: Task 2.1, Task 2.4
  - 成果物: `src/components/PendingRecords.tsx`

- [ ] **Task 2.6**: ConfirmationModalコンポーネントの作成
  - 依存関係: Task 2.2, Task 2.4
  - 成果物: `src/components/ConfirmationModal.tsx`

- [ ] **Task 2.7**: ホームページの実装
  - 依存関係: Task 2.5, Task 2.6
  - 成果物: `src/app/page.tsx`

### Phase 2 完了条件
- [ ] 全タスク完了
- [ ] Pending Recordsが表示される
- [ ] カードクリックでモーダル表示
- [ ] テスト手順書作成: `docs/tests/test-pending-records.md`
- [ ] 実装ログ作成: `docs/logs/phase-2-pending-records.md`

---

## 🔗 Phase 3: SSS Extension統合

### 優先度: 🔴 最優先

- [ ] **Task 3.1**: Symbol Wallet統合モジュールの作成
  - 依存関係: Phase 1完了
  - 成果物: `src/lib/symbol/wallet.ts`

- [ ] **Task 3.2**: Symbol SDK初期化
  - 依存関係: Phase 1完了
  - 成果物: `src/lib/symbol/client.ts`

- [ ] **Task 3.3**: TransferTransaction作成
  - 依存関係: Task 3.1, Task 3.2
  - 成果物: `src/lib/symbol/transaction.ts`

- [ ] **Task 3.4**: トランザクション確認のポーリング
  - 依存関係: Task 3.3
  - 成果物: 更新された`src/lib/symbol/transaction.ts`

- [ ] **Task 3.5**: ConfirmationModalの機能実装
  - 依存関係: Task 3.3, Task 3.4
  - 成果物: 更新された`src/components/ConfirmationModal.tsx`

- [ ] **Task 3.6**: ConfirmedRecordsコンポーネントの作成
  - 依存関係: Phase 2完了
  - 成果物: `src/components/ConfirmedRecords.tsx`

- [ ] **Task 3.7**: ホームページのタブ切り替え実装
  - 依存関係: Task 3.6
  - 成果物: 更新された`src/app/page.tsx`

### Phase 3 完了条件
- [ ] 全タスク完了
- [ ] SSS Extension連携動作
- [ ] トランザクション送信成功
- [ ] Confirmed Recordsに表示
- [ ] テスト手順書作成: `docs/tests/test-blockchain-record.md`
- [ ] 実装ログ作成: `docs/logs/phase-3-sss-integration.md`

---

## ✅ Phase 4: 検証機能

### 優先度: 🟡 高

- [ ] **Task 4.1**: 検証ロジックの実装
  - 依存関係: Phase 3完了
  - 成果物: `src/lib/symbol/verify.ts`

- [ ] **Task 4.2**: ProofCardコンポーネントの作成
  - 依存関係: Task 4.1
  - 成果物: `src/components/ProofCard.tsx`

- [ ] **Task 4.3**: VerifyPanelコンポーネントの作成
  - 依存関係: Task 4.2
  - 成果物: `src/components/VerifyPanel.tsx`

- [ ] **Task 4.4**: 検証ページの実装
  - 依存関係: Task 4.3
  - 成果物: `src/app/verify/page.tsx`

### Phase 4 完了条件
- [ ] 全タスク完了
- [ ] トランザクションハッシュで検証可能
- [ ] Symbol Explorerリンク動作
- [ ] テスト手順書作成: `docs/tests/test-verification.md`
- [ ] 実装ログ作成: `docs/logs/phase-4-verification.md`

---

## 🌳 Phase 5: Learning Tree

### 優先度: 🟢 中

- [ ] **Task 5.1**: LearningNodeデータ生成
  - 依存関係: Phase 3完了
  - 成果物: `src/lib/utils/tree.ts`

- [ ] **Task 5.2**: LearningTreeコンポーネントの作成
  - 依存関係: Task 5.1
  - 成果物: `src/components/LearningTree.tsx`

- [ ] **Task 5.3**: Treeページの実装
  - 依存関係: Task 5.2
  - 成果物: `src/app/tree/page.tsx`

### Phase 5 完了条件
- [ ] 全タスク完了
- [ ] Learning Tree表示
- [ ] ノードクリックで詳細表示
- [ ] 実装ログ作成: `docs/logs/phase-5-learning-tree.md`

---

## 🤖 Phase 6: AI要約とポリッシュ

### 優先度: 🟢 中

- [ ] **Task 6.1**: Gemini API統合
  - 依存関係: Phase 3完了
  - 成果物: `src/lib/ai/summarize.ts`, `src/app/api/summarize/route.ts`

- [ ] **Task 6.2**: 要約表示の統合
  - 依存関係: Task 6.1
  - 成果物: 更新された`src/components/RecordCard.tsx`

- [ ] **Task 6.3**: Headerコンポーネントの作成
  - 依存関係: なし
  - 成果物: `src/components/Header.tsx`

- [ ] **Task 6.4**: Portfolioページの実装
  - 依存関係: Phase 5完了
  - 成果物: `src/app/portfolio/[id]/page.tsx`

- [ ] **Task 6.5**: スタイリングとレスポンシブ対応
  - 依存関係: 全Phase完了
  - 成果物: 全コンポーネント更新

### Phase 6 完了条件
- [ ] 全タスク完了
- [ ] AI要約生成動作
- [ ] Portfolio表示
- [ ] レスポンシブ対応完了
- [ ] テスト手順書作成: `docs/tests/test-ai-summary.md`
- [ ] 実装ログ作成: `docs/logs/phase-6-ai-polish.md`

---

## 📊 マイルストーン

### Week 1
- [x] ドキュメント整備（完了）
- [ ] Phase 1完了
- [ ] Phase 2完了

### Week 2
- [ ] Phase 3完了
- [ ] Phase 4完了

### Week 3
- [ ] Phase 5完了
- [ ] Phase 6完了
- [ ] デモ準備

---

## 🔄 現在の作業

**現在のフェーズ**: Phase 1（準備完了、実装待ち）

**次のタスク**: Task 1.1 - Next.jsプロジェクトの初期化

**ブロッカー**: なし

---

## 📝 メモ

- DAO関連機能は実装しない
- TransferTransactionのみ使用
- エラーハンドリングを必ず実装
- 各フェーズ完了時に実装ログとテスト手順書を作成
