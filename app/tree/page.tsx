/**
 * 学習ツリーページ (Atlaskit版)
 * Phase 5.1: 基本ツリー表示
 */

'use client';

import { useEffect, useState } from 'react';
import { ConfirmedRecord } from '@/types';
import { getConfirmedRecords } from '@/lib/storage/localStorage';
import LearningTreeView from '@/components/LearningTree/LearningTreeView';
import { generateBalancedMockRecords } from '@/lib/symbol/__mocks__/mockData';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import SectionMessage from '@atlaskit/section-message';
import { Box, Stack, Grid, Inline, xcss } from '@atlaskit/primitives';

const pageContainerStyles = xcss({
  paddingBlock: 'space.400',
  paddingInline: 'space.300',
  minHeight: '100vh',
});

const contentContainerStyles = xcss({
  maxWidth: '1400px',
  marginInline: 'auto',
});

const headingStyles = xcss({
  font: 'font.heading.xlarge',
  fontWeight: 'font.weight.semibold',
  marginBlockEnd: 'space.100',
});

const subtitleStyles = xcss({
  color: 'color.text.subtlest',
});

const statCardStyles = xcss({
  padding: 'space.200',
  borderRadius: 'border.radius.200',
  backgroundColor: 'elevation.surface.raised',
  boxShadow: 'elevation.shadow.raised',
});

export default function TreePageAtlaskit() {
  const [records, setRecords] = useState<ConfirmedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    loadData();
  }, [useMockData]);

  const loadData = () => {
    if (useMockData) {
      const mockRecords = generateBalancedMockRecords();
      setRecords(mockRecords);
    } else {
      const confirmedRecords = getConfirmedRecords();
      setRecords(confirmedRecords);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Box xcss={pageContainerStyles}>
        <Box xcss={contentContainerStyles}>
          <Inline space="space.100" alignBlock="center">
            <Spinner size="large" />
            <span style={{ fontSize: '18px' }}>読み込み中...</span>
          </Inline>
        </Box>
      </Box>
    );
  }

  return (
    <Box xcss={pageContainerStyles}>
      <Box xcss={contentContainerStyles}>
        <Stack space="space.300">
          {/* ヘッダー */}
          <Inline spread="space-between" alignBlock="center">
            <div>
              <Box xcss={headingStyles}>学習ツリー</Box>
              <Box xcss={subtitleStyles}>
                ブロックチェーンに記録した学習の進捗を可視化します
              </Box>
            </div>

            {/* モックデータトグル */}
            <Button
              appearance={useMockData ? 'primary' : 'default'}
              onClick={() => setUseMockData(!useMockData)}
            >
              {useMockData ? '🧪 モックデータ使用中' : '📊 実データ使用中'}
            </Button>
          </Inline>

          {/* 統計情報カード */}
          {records.length > 0 && (
            <Grid gap="space.200" templateColumns="1fr 1fr 1fr 1fr">
              <Box xcss={statCardStyles}>
                <div style={{ fontSize: '12px', color: '#6B778C', marginBottom: '4px' }}>
                  確定済みレコード
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {records.length}件
                </div>
              </Box>

              <Box xcss={statCardStyles}>
                <div style={{ fontSize: '12px', color: '#6B778C', marginBottom: '4px' }}>
                  総学習時間
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {Math.round(
                    records.reduce((sum, r) => sum + r.session.duration, 0) / 60000
                  )}
                  分
                </div>
              </Box>

              <Box xcss={statCardStyles}>
                <div style={{ fontSize: '12px', color: '#6B778C', marginBottom: '4px' }}>
                  ブロックチェーン証明
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00875A' }}>
                  100%
                </div>
              </Box>

              <Box xcss={statCardStyles}>
                <div style={{ fontSize: '12px', color: '#6B778C', marginBottom: '4px' }}>
                  平均学習時間
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {records.length > 0
                    ? Math.round(
                        records.reduce((sum, r) => sum + r.session.duration, 0) /
                          60000 /
                          records.length
                      )
                    : 0}
                  分
                </div>
              </Box>
            </Grid>
          )}

          {/* ツリー表示 */}
          <LearningTreeView records={records} />

          {/* ヘルプセクション */}
          {records.length === 0 && (
            <SectionMessage
              appearance="information"
              title="💡 学習ツリーについて"
            >
              <Stack space="space.100">
                <p>
                  学習ツリーは、ブロックチェーンに記録された学習記録を視覚的に表示する機能です。
                </p>

                <div style={{ marginTop: '12px' }}>
                  <strong>表示方法:</strong>
                  <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                    <li><strong>縦列</strong>: 学習分野（カテゴリ）ごとに列が分かれます</li>
                    <li><strong>縦方向</strong>: 時系列順（古い順に上から下へ）</li>
                    <li><strong>矢印</strong>: 同じカテゴリ内での学習の流れを示します</li>
                  </ul>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <strong>学習ツリーを作成するには:</strong>
                  <ol style={{ marginLeft: '20px', marginTop: '8px' }}>
                    <li>「保留中」ページに移動</li>
                    <li>レコードの「ブロックチェーンに登録」ボタンをクリック</li>
                    <li>SSS Extensionで署名</li>
                    <li>トランザクションが承認されると、こちらのページにツリーとして表示されます</li>
                  </ol>
                </div>
              </Stack>
            </SectionMessage>
          )}

          {/* Phase 5.1完了の説明 */}
          {records.length > 0 && (
            <SectionMessage
              appearance="success"
              title="✅ Phase 5.1: 基本ツリー表示 完了"
            >
              <Stack space="space.100">
                <p>現在の表示方法:</p>
                <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                  <li><strong>カテゴリベース配置</strong>: URLとタイトルから自動的にカテゴリを判定</li>
                  <li><strong>時系列順配置</strong>: 同じカテゴリ内で学習した順番に上から下へ配置</li>
                  <li><strong>インタラクティブ操作</strong>: ズーム・パン・ミニマップで自由に閲覧</li>
                </ul>
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#6B778C' }}>
                  <strong>今後の改善予定:</strong> Phase 5.2以降で用語の正規化、抽象度推定、類似度スコアリング、埋め込みベクトルによる高精度配置を実装します。
                </div>
              </Stack>
            </SectionMessage>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
