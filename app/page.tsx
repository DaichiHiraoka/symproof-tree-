'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PendingRecord, ConfirmedRecord } from '@/types';
import { getAllPendingRecords, getPendingRecordsCount } from '@/lib/detection/pendingRecords';
import { getConfirmedRecords } from '@/lib/storage/localStorage';
import { loadMockBrowsingSessions } from '@/lib/detection/autoDetect';
import { useFlag } from '@/components/FlagProvider';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import { Box, Stack, Grid, Inline, xcss } from '@atlaskit/primitives';
import ClockIcon from '@atlaskit/icon/glyph/recent';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import EditorAddIcon from '@atlaskit/icon/glyph/editor/add';
import SearchIcon from '@atlaskit/icon/glyph/search';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';

const pageContainerStyles = xcss({
  paddingBlock: 'space.400',
  paddingInline: 'space.300',
  minHeight: '100vh',
});

const contentContainerStyles = xcss({
  maxWidth: '1200px',
  marginInline: 'auto',
});

const headingStyles = xcss({
  font: 'font.heading.xxlarge',
  fontWeight: 'font.weight.bold',
  marginBlockEnd: 'space.400',
  color: 'color.text',
});

const metricCardStyles = xcss({
  padding: 'space.300',
  borderRadius: 'border.radius.200',
  backgroundColor: 'elevation.surface.raised',
  boxShadow: 'elevation.shadow.raised',
  transition: 'all 0.2s',
  ':hover': {
    boxShadow: 'elevation.shadow.overlay',
    transform: 'translateY(-2px)',
  },
});

const metricIconContainerStyles = xcss({
  width: '48px',
  height: '48px',
  borderRadius: 'border.radius.circle',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBlockEnd: 'space.150',
});

const metricTitleStyles = xcss({
  font: 'font.body',
  color: 'color.text.subtlest',
  marginBlockEnd: 'space.050',
});

const metricValueStyles = xcss({
  font: 'font.heading.xxlarge',
  fontWeight: 'font.weight.bold',
  color: 'color.text',
});

const metricLinkStyles = xcss({
  font: 'font.body.small',
  color: 'color.link',
  marginBlockStart: 'space.100',
  display: 'inline-block',
  ':hover': {
    textDecoration: 'underline',
  },
});

const sectionHeadingStyles = xcss({
  font: 'font.heading.large',
  fontWeight: 'font.weight.semibold',
  marginBlockEnd: 'space.200',
});

const actionCardStyles = xcss({
  padding: 'space.250',
  borderRadius: 'border.radius.200',
  textAlign: 'center',
  backgroundColor: 'elevation.surface.raised',
  transition: 'all 0.2s',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: 'elevation.surface.hovered',
    boxShadow: 'elevation.shadow.raised',
  },
});

const recentCardStyles = xcss({
  padding: 'space.200',
  borderRadius: 'border.radius.200',
  borderStyle: 'solid',
  borderWidth: 'border.width',
  borderColor: 'color.border',
  backgroundColor: 'elevation.surface',
});

const devToolsBoxStyles = xcss({
  padding: 'space.200',
  backgroundColor: 'color.background.neutral',
  borderRadius: 'border.radius.200',
});

export default function HomeAtlaskit() {
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [recentPending, setRecentPending] = useState<PendingRecord[]>([]);
  const [recentConfirmed, setRecentConfirmed] = useState<ConfirmedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { showSuccess, showError } = useFlag();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);

    const pending = getAllPendingRecords();
    const counts = getPendingRecordsCount();
    setPendingCount(counts.total);
    setRecentPending(pending.slice(0, 5));

    const confirmed = getConfirmedRecords();
    setConfirmedCount(confirmed.length);
    setRecentConfirmed(confirmed.slice(0, 5));

    setIsLoading(false);
  };

  const loadMockData = async () => {
    try {
      const sessions = await loadMockBrowsingSessions();
      showSuccess(
        'モックデータ読み込み完了',
        `${sessions.length}件のモックデータを読み込みました`
      );
      loadData();
    } catch (error) {
      console.error('Failed to load mock data:', error);
      showError('モックデータの読み込みに失敗しました');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;
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
        <Box xcss={headingStyles}>学習証明システム - SymProof Tree</Box>

        <Stack space="space.500">
          {/* 統計情報カード */}
          <Grid gap="space.300" templateColumns="1fr 1fr">
            {/* 保留中レコード */}
            <Box xcss={metricCardStyles}>
              <Box
                xcss={metricIconContainerStyles}
                style={{ backgroundColor: 'var(--ds-background-accent-blue-subtler, #E9F2FF)' }}
              >
                <ClockIcon label="保留中" primaryColor="var(--ds-icon-accent-blue, #0065FF)" />
              </Box>
              <Box xcss={metricTitleStyles}>保留中レコード</Box>
              <Box xcss={metricValueStyles}>{pendingCount}件</Box>
              <Link href="/pending" style={{ textDecoration: 'none' }}>
                <Box xcss={metricLinkStyles}>詳細を見る →</Box>
              </Link>
            </Box>

            {/* 確定済みレコード */}
            <Box xcss={metricCardStyles}>
              <Box
                xcss={metricIconContainerStyles}
                style={{ backgroundColor: 'var(--ds-background-accent-green-subtler, #DFFCF0)' }}
              >
                <CheckCircleIcon label="確定済み" primaryColor="var(--ds-icon-accent-green, #00875A)" />
              </Box>
              <Box xcss={metricTitleStyles}>確定済みレコード</Box>
              <Box xcss={metricValueStyles}>{confirmedCount}件</Box>
              <Link href="/verified" style={{ textDecoration: 'none' }}>
                <Box xcss={metricLinkStyles}>詳細を見る →</Box>
              </Link>
            </Box>
          </Grid>

          {/* クイックアクション */}
          <Box>
            <Box xcss={sectionHeadingStyles}>クイックアクション</Box>
            <Grid gap="space.200" templateColumns="1fr 1fr 1fr">
              <Link href="/pending" style={{ textDecoration: 'none' }}>
                <Box xcss={actionCardStyles}>
                  <EditorAddIcon label="登録" size="medium" />
                  <div style={{ marginTop: '8px', fontSize: '14px' }}>
                    学習記録を登録
                  </div>
                </Box>
              </Link>

              <Link href="/verify" style={{ textDecoration: 'none' }}>
                <Box xcss={actionCardStyles}>
                  <SearchIcon label="検証" size="medium" />
                  <div style={{ marginTop: '8px', fontSize: '14px' }}>
                    記録を検証
                  </div>
                </Box>
              </Link>

              <Link href="/tree" style={{ textDecoration: 'none' }}>
                <Box xcss={actionCardStyles}>
                  <GraphLineIcon label="ツリー" size="medium" />
                  <div style={{ marginTop: '8px', fontSize: '14px' }}>
                    学習ツリーを見る
                  </div>
                </Box>
              </Link>
            </Grid>
          </Box>

          {/* 最近の保留中レコード */}
          {recentPending.length > 0 && (
            <Box>
              <Box xcss={sectionHeadingStyles}>最近の保留中レコード</Box>
              <Stack space="space.150">
                {recentPending.map(record => (
                  <Box key={record.id} xcss={recentCardStyles}>
                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                      {record.session.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B778C', marginBottom: '8px' }}>
                      {record.session.url}
                    </div>
                    <Inline space="space.200">
                      <span style={{ fontSize: '12px' }}>
                        学習時間: {formatDuration(record.session.duration)}
                      </span>
                      <span style={{ fontSize: '12px' }}>
                        登録日: {formatDate(record.createdAt)}
                      </span>
                    </Inline>
                  </Box>
                ))}
                <Link href="/pending" style={{ textDecoration: 'none' }}>
                  <Box xcss={metricLinkStyles}>すべて見る →</Box>
                </Link>
              </Stack>
            </Box>
          )}

          {/* 最近の確定済みレコード */}
          {recentConfirmed.length > 0 && (
            <Box>
              <Box xcss={sectionHeadingStyles}>最近の確定済みレコード</Box>
              <Stack space="space.150">
                {recentConfirmed.map(record => (
                  <Box key={record.id} xcss={recentCardStyles}>
                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                      {record.session.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B778C', marginBottom: '8px' }}>
                      {record.session.url}
                    </div>
                    <Inline space="space.200">
                      <span style={{ fontSize: '12px' }}>
                        学習時間: {formatDuration(record.session.duration)}
                      </span>
                      <span style={{ fontSize: '12px' }}>
                        確定日: {formatDate(record.timestamp)}
                      </span>
                    </Inline>
                  </Box>
                ))}
                <Link href="/verified" style={{ textDecoration: 'none' }}>
                  <Box xcss={metricLinkStyles}>すべて見る →</Box>
                </Link>
              </Stack>
            </Box>
          )}

          {/* 開発用ツール */}
          <Box xcss={devToolsBoxStyles}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
              開発者ツール
            </div>
            <Button onClick={loadMockData}>
              モックデータを読み込む
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
