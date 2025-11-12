# UI改善計画 - Atlassian Design System準拠

## 📋 概要
現在のSymProof TreeアプリケーションのUIをAtlassian Design Systemのベストプラクティスに基づいて改善し、機能を損なわずにリッチで使いやすいUIを実現する。

---

## 🎯 改善目標
1. **視覚的階層の明確化**: ユーザーが直感的に操作できる情報設計
2. **インタラクションの改善**: フィードバックとローディング状態の明示
3. **一貫性の向上**: デザインシステムに基づいた統一感
4. **アクセシビリティの強化**: キーボード操作とスクリーンリーダー対応
5. **レスポンシブデザインの最適化**: モバイルでの操作性向上

---

## 📊 現状分析

### 現在の実装状況
- **フレームワーク**: Next.js 14 + React 18 + TypeScript
- **スタイリング**: Tailwind CSS
- **ビジュアライゼーション**: ReactFlow (学習ツリー表示)
- **状態管理**: React Hooks (useState, useEffect)
- **主要機能**:
  - ホームダッシュボード (統計表示)
  - 保留中レコード管理
  - 確定済みレコード表示
  - 検証機能
  - 学習ツリー可視化 (タイムライン/ポーラーレイアウト)

### 現在のUI課題
1. **ボタンとアクション要素**
   - 標準的なTailwindボタンのみ使用
   - ローディング状態の視覚的フィードバックが不足
   - アクションの優先度が不明確

2. **カードコンポーネント**
   - 情報密度が高く、視覚的な区切りが弱い
   - ホバー効果のみで、インタラクション性が低い
   - ステータス表示が色とテキストのみ

3. **ナビゲーション**
   - シンプルな水平タブのみ
   - 現在位置のインジケーターが下線のみ
   - モバイルメニューの視認性が低い

4. **フィードバック機構**
   - `alert()`によるモーダル表示（ユーザー体験が悪い）
   - エラーハンドリングの視覚的フィードバックが弱い
   - 成功/失敗の通知が一時的でない

5. **ローディング状態**
   - テキストのみの簡易表示
   - 進捗状況が不明確
   - スケルトンスクリーンなし

---

## 🎨 Atlassian Design System適用計画

### 1. **ボタン・アクションの改善**

#### 適用するAtlassianパターン
- **Button Component**: プライマリ/セカンダリ/デフォルトの明確な区別
- **Loading State**: スピナー統合によるローディング表示
- **Icon Integration**: アクションの意図を視覚的に強化

#### 実装計画
```tsx
// 改善前
<button className="bg-blue-600 text-white px-4 py-2 rounded">
  ブロックチェーンに登録
</button>

// 改善後（Atlassian風）
<Button
  appearance="primary"
  isLoading={isSubmitting}
  iconBefore={<ChainIcon />}
  isDisabled={!sssAvailable}
>
  ブロックチェーンに登録
</Button>
```

#### 影響範囲
- `/app/pending/page.tsx` - ブロックチェーン登録ボタン
- `/app/page.tsx` - クイックアクションボタン
- `/components/RecordCard.tsx` - アクションボタン

---

### 2. **カード・レコード表示の改善**

#### 適用するAtlassianパターン
- **Card Layout**: 視覚的階層を持つカード構造
- **Inline Message**: ステータス表示の強化
- **Badge**: カテゴリやタグの視覚化
- **Progress Indicator**: 学習時間の視覚化

#### 実装計画
```tsx
// 改善後のRecordCard構造
<Card elevation="medium" hoverable>
  <CardHeader>
    <Avatar size="medium" />
    <Heading level="h3">{session.title}</Heading>
    <Lozenge appearance={statusAppearance}>{statusText}</Lozenge>
  </CardHeader>

  <CardContent>
    <MetaData icon={<LinkIcon />} label="URL">
      {session.url}
    </MetaData>
    <ProgressBar
      value={duration}
      max={maxDuration}
      label="学習時間"
    />
    <Stack spacing="small">
      <Badge>{category}</Badge>
    </Stack>
  </CardContent>

  <CardFooter>
    <ButtonGroup>
      <Button appearance="primary">詳細</Button>
      <Button appearance="subtle">共有</Button>
    </ButtonGroup>
  </CardFooter>
</Card>
```

#### 影響範囲
- `/components/RecordCard.tsx` - カード全体のリデザイン
- `/components/RecordList.tsx` - リストレイアウトの調整

---

### 3. **ナビゲーションの改善**

#### 適用するAtlassianパターン
- **Side Navigation**: 大規模アプリ向けの階層的ナビゲーション
- **Breadcrumbs**: 現在位置の明確化
- **Tab Component**: ページ内セクション切り替え

#### 実装計画（2つのオプション）

**オプションA: 水平タブの強化**（現状維持、視覚改善）
```tsx
<Tabs
  selectedIndex={activeIndex}
  onChange={handleTabChange}
>
  <TabList>
    <Tab icon={<HomeIcon />}>ホーム</Tab>
    <Tab icon={<ClockIcon />}>保留中</Tab>
    <Tab icon={<CheckIcon />}>確定済み</Tab>
    <Tab icon={<TreeIcon />}>学習ツリー</Tab>
  </TabList>
</Tabs>
```

**オプションB: サイドナビゲーション**（大規模化に備える）
```tsx
<SideNavigation>
  <NavigationHeader>
    <Logo>SymProof Tree</Logo>
  </NavigationHeader>
  <NavigationContent>
    <Section title="レコード管理">
      <NavigationItem
        icon={<HomeIcon />}
        text="ホーム"
        isSelected={pathname === '/'}
      />
      <NavigationItem
        icon={<ClockIcon />}
        text="保留中"
        badge={pendingCount}
      />
      <NavigationItem
        icon={<CheckIcon />}
        text="確定済み"
        badge={confirmedCount}
      />
    </Section>
    <Section title="分析">
      <NavigationItem
        icon={<TreeIcon />}
        text="学習ツリー"
      />
    </Section>
  </NavigationContent>
</SideNavigation>
```

**推奨**: オプションA（段階的改善）→ 将来的にオプションBへ移行

#### 影響範囲
- `/components/Navigation.tsx` - ナビゲーション全体の再設計
- `/app/layout.tsx` - レイアウト構造の調整

---

### 4. **フィードバック・通知の改善**

#### 適用するAtlassianパターン
- **Flag**: 成功/エラー/警告の一時的な通知
- **Banner**: ページレベルの重要な情報表示
- **Inline Message**: フォーム内のバリデーションメッセージ
- **Modal Dialog**: 重要なアクション確認

#### 実装計画

**現在の`alert()`を置き換え**
```tsx
// 改善前
alert('トランザクション送信成功！');

// 改善後
showFlag({
  appearance: 'success',
  title: 'トランザクション送信成功',
  description: `Hash: ${transactionHash}`,
  icon: <CheckCircleIcon />,
  actions: [
    { content: '詳細を見る', onClick: () => viewTransaction(hash) }
  ],
  autoclose: 5000
});
```

**SSS Extension接続状態の改善**
```tsx
// 改善後
{!sssAvailable && (
  <Banner
    appearance="warning"
    icon={<WarningIcon />}
  >
    <BannerHeader>SSS Extensionが検出されません</BannerHeader>
    <BannerContent>
      ブロックチェーンへの登録には
      <Link href="https://sss-extension.com">SSS Extension</Link>
      のインストールが必要です。
    </BannerContent>
    <BannerActions>
      <Button onClick={checkSSS}>再接続を試行</Button>
    </BannerActions>
  </Banner>
)}
```

#### 新規コンポーネント作成
- `/components/FlagProvider.tsx` - 通知管理コンテキスト
- `/components/ConfirmDialog.tsx` - 確認ダイアログ

#### 影響範囲
- `/app/pending/page.tsx` - alert()の置き換え
- `/app/page.tsx` - モックデータ読み込み通知
- 全ページ - エラーハンドリング

---

### 5. **ローディング・スケルトンの改善**

#### 適用するAtlassianパターン
- **Spinner**: 汎用的なローディングインジケーター
- **Progress Bar**: 進捗状況の視覚化
- **Skeleton**: コンテンツ読み込み中のプレースホルダー

#### 実装計画

**ページローディングの改善**
```tsx
// 改善前
{isLoading && <p>読み込み中...</p>}

// 改善後
{isLoading ? (
  <Stack spacing="medium">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </Stack>
) : (
  <RecordList records={records} />
)}
```

**トランザクション送信時の進捗表示**
```tsx
<ProgressTracker>
  <Stage
    label="データ準備"
    status={progress.step === 'prepare' ? 'current' : 'visited'}
  />
  <Stage
    label="SSS署名"
    status={progress.step === 'sign' ? 'current' :
            progress.step === 'prepare' ? 'unvisited' : 'visited'}
  />
  <Stage
    label="トランザクション送信"
    status={progress.step === 'submit' ? 'current' :
            ['prepare', 'sign'].includes(progress.step) ? 'unvisited' : 'visited'}
  />
  <Stage
    label="承認待機"
    status={progress.step === 'confirm' ? 'current' : 'unvisited'}
  />
</ProgressTracker>
```

#### 新規コンポーネント作成
- `/components/SkeletonCard.tsx` - カードスケルトン
- `/components/TransactionProgressTracker.tsx` - トランザクション進捗

#### 影響範囲
- `/app/page.tsx` - 初期ローディング
- `/app/pending/page.tsx` - 送信進捗表示
- `/components/RecordList.tsx` - リストローディング

---

### 6. **学習ツリー表示の改善**

#### 適用するAtlassianパターン
- **Panel**: コントロールパネルのグループ化
- **Toggle**: レイアウト切り替え
- **Dropdown Menu**: カテゴリ選択
- **Tooltip**: ノード情報のホバー表示

#### 実装計画

**コントロールパネルの改善**
```tsx
<ControlPanel>
  <PanelSection title="表示設定">
    <ToggleGroup label="レイアウト">
      <ToggleButton
        value="timeline"
        icon={<CalendarIcon />}
        isSelected={layoutMode === 'timeline'}
      >
        タイムライン
      </ToggleButton>
      <ToggleButton
        value="polar"
        icon={<RadarIcon />}
        isSelected={layoutMode === 'polar'}
      >
        ポーラー
      </ToggleButton>
    </ToggleGroup>

    {layoutMode === 'polar' && (
      <Select
        label="カテゴリ選択"
        value={selectedCategory}
        onChange={setSelectedCategory}
        options={categories}
      />
    )}

    {layoutMode === 'timeline' && (
      <Checkbox
        label="類似度エッジを表示"
        isChecked={showSimilarityEdges}
        onChange={setShowSimilarityEdges}
      />
    )}
  </PanelSection>
</ControlPanel>
```

**ノード詳細の改善**
```tsx
// ReactFlowノードにTooltipを追加
<Tooltip content={
  <TooltipContent>
    <Heading size="small">{node.title}</Heading>
    <MetaList>
      <MetaItem icon={<ClockIcon />}>{duration}</MetaItem>
      <MetaItem icon={<TagIcon />}>{category}</MetaItem>
      <MetaItem icon={<LayersIcon />}>{abstractionLevel}</MetaItem>
    </MetaList>
  </TooltipContent>
}>
  <LearningRecordNode data={node.data} />
</Tooltip>
```

#### 影響範囲
- `/components/LearningTree/LearningTreeView.tsx` - コントロール改善
- `/components/LearningTree/LearningRecordNode.tsx` - ノード表示強化
- `/components/LearningTree/CategorySelector.tsx` - セレクター改善

---

### 7. **統計・ダッシュボードの改善**

#### 適用するAtlassianパターン
- **Metric**: 数値指標の視覚化
- **Progress Bar**: 達成率の表示
- **Chart Integration**: データ可視化（将来的）

#### 実装計画

**ホームページ統計カードの改善**
```tsx
// 改善後
<Grid columns={2} gap="medium">
  <MetricCard>
    <MetricHeader>
      <Icon>
        <ClockIcon size="large" />
      </Icon>
      <MetricTitle>保留中レコード</MetricTitle>
    </MetricHeader>
    <MetricValue>{pendingCount}</MetricValue>
    <MetricTrend trend="up">+5件 (今週)</MetricTrend>
    <MetricAction>
      <Button appearance="link" href="/pending">
        詳細を見る
      </Button>
    </MetricAction>
  </MetricCard>

  <MetricCard>
    <MetricHeader>
      <Icon>
        <CheckCircleIcon size="large" color="success" />
      </Icon>
      <MetricTitle>確定済みレコード</MetricTitle>
    </MetricHeader>
    <MetricValue>{confirmedCount}</MetricValue>
    <MetricProgress value={75} label="目標達成率" />
    <MetricAction>
      <Button appearance="link" href="/verified">
        詳細を見る
      </Button>
    </MetricAction>
  </MetricCard>
</Grid>
```

#### 影響範囲
- `/app/page.tsx` - ダッシュボード統計表示

---

## 🛠️ 実装フェーズ

### Phase 1: 基盤整備（1-2日）
1. ✅ **デザインシステム基礎コンポーネント作成**
   - `/components/ui/Button.tsx`
   - `/components/ui/Card.tsx`
   - `/components/ui/Badge.tsx`
   - `/components/ui/Spinner.tsx`
   - `/components/ui/Lozenge.tsx` (ステータス表示)

2. ✅ **通知システム実装**
   - `/components/FlagProvider.tsx`
   - `/hooks/useFlag.ts`
   - `/components/Banner.tsx`

### Phase 2: コアコンポーネント改善（2-3日）
3. ✅ **RecordCard リデザイン**
   - 視覚的階層の改善
   - ステータス表示の強化
   - インタラクション性の向上

4. ✅ **ナビゲーション強化**
   - タブデザインの改善
   - アクティブ状態の明確化
   - モバイル対応の改善

5. ✅ **ローディング・スケルトン実装**
   - `/components/SkeletonCard.tsx`
   - ページローディングの改善

### Phase 3: ページ単位での適用（2-3日）
6. ✅ **Pendingページ改善**
   - alert()の置き換え
   - 進捗表示の改善
   - SSS接続状態の視覚化

7. ✅ **ホームページ改善**
   - 統計カードのリデザイン
   - クイックアクションの改善

8. ✅ **Verifiedページ改善**
   - フィルタリング機能の追加
   - ソート機能の追加

### Phase 4: 高度な機能（2-3日）
9. ✅ **学習ツリー表示の強化**
   - コントロールパネルのリデザイン
   - ノードツールチップの追加
   - レイアウト切り替えUIの改善

10. ✅ **アクセシビリティ対応**
    - キーボードナビゲーション
    - ARIA属性の追加
    - フォーカス管理

### Phase 5: 最終調整（1日）
11. ✅ **一貫性チェック**
    - デザイントークンの統一
    - スペーシングの調整
    - カラーパレットの検証

12. ✅ **パフォーマンス最適化**
    - コンポーネントのメモ化
    - 不要な再レンダリング削減

---

## 📦 必要な依存関係

### 新規追加候補
```json
{
  "dependencies": {
    "@atlaskit/button": "^17.0.0",
    "@atlaskit/badge": "^16.0.0",
    "@atlaskit/lozenge": "^11.0.0",
    "@atlaskit/spinner": "^16.0.0",
    "@atlaskit/flag": "^14.0.0",
    "@atlaskit/banner": "^12.0.0",
    "@atlaskit/tooltip": "^18.0.0",
    "@atlaskit/dropdown-menu": "^12.0.0",
    "@atlaskit/select": "^17.0.0",
    "@atlaskit/tabs": "^14.0.0",
    "@atlaskit/progress-bar": "^6.0.0",
    "@atlaskit/icon": "^22.0.0"
  }
}
```

**注意**: Atlaskitは公式パッケージだが、ライセンスと依存関係を確認する必要あり。
代替案として、Tailwindベースでのカスタム実装も検討可能。

### 代替アプローチ（推奨）
Atlassian Design Systemの**デザイン原則とパターン**を参照しつつ、
既存のTailwind CSSで独自実装することで、依存関係を最小限に抑える。

---

## 🎨 デザイントークン定義

### カラーパレット
```css
:root {
  /* Primary - Blockchain/Action */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-700: #1d4ed8;

  /* Success - Verified */
  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;
  --color-success-700: #15803d;

  /* Warning - Pending */
  --color-warning-50: #fefce8;
  --color-warning-500: #eab308;
  --color-warning-700: #a16207;

  /* Danger - Failed */
  --color-danger-50: #fef2f2;
  --color-danger-500: #ef4444;
  --color-danger-700: #b91c1c;

  /* Neutral */
  --color-neutral-50: #f9fafb;
  --color-neutral-500: #6b7280;
  --color-neutral-900: #111827;
}
```

### スペーシング
```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
}
```

### タイポグラフィ
```css
:root {
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

---

## ✅ 成功指標

### 定量的指標
- ページロード時間: 現状維持または改善
- インタラクションまでの時間(TTI): 20%改善
- Lighthouse Accessibility Score: 90点以上

### 定性的指標
- ユーザーが直感的に操作できる
- 視覚的な一貫性が向上している
- エラーやローディング状態が明確に伝わる
- モバイルでも快適に操作できる

---

## 🚀 次のステップ

1. **このUI改善計画のレビュー**
   - 実装優先度の確認
   - デザイン方針の合意

2. **Phase 1の実装開始**
   - 基盤コンポーネントの作成
   - デザイントークンの定義

3. **段階的なロールアウト**
   - 各Phaseごとにレビュー&テスト
   - ユーザーフィードバックの収集

---

## 📝 備考

- 現在の機能は一切損なわない（レコード管理、ブロックチェーン登録、ツリー表示）
- 既存のTailwind CSSを活用し、段階的に改善
- Atlaskitの直接導入は慎重に検討（バンドルサイズ・ライセンス）
- モバイルファーストでの実装を心がける
- アクセシビリティは最初から考慮する

---

**作成日**: 2025-11-13
**対象アプリケーション**: SymProof Tree (demoapp_newUI)
**参考**: https://atlassian.design/components
