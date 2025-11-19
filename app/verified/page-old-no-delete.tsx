'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ConfirmedRecord } from '@/types';
import { getConfirmedRecords } from '@/lib/storage/localStorage';
import RecordCardAtlaskit from '@/components/RecordCardAtlaskit';
import { getValidatedConfig } from '@/lib/symbol/config';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import SectionMessage from '@atlaskit/section-message';
import Lozenge from '@atlaskit/lozenge';
import { Box, Stack, Grid, Inline, xcss } from '@atlaskit/primitives';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import LinkIcon from '@atlaskit/icon/glyph/link';

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
  font: 'font.heading.xlarge',
  fontWeight: 'font.weight.semibold',
  marginBlockEnd: 'space.300',
});

const statCardStyles = xcss({
  padding: 'space.200',
  borderRadius: 'border.radius.200',
  backgroundColor: 'elevation.surface.raised',
  boxShadow: 'elevation.shadow.raised',
});

const infoBoxStyles = xcss({
  padding: 'space.100',
  backgroundColor: 'color.background.neutral',
  borderRadius: 'border.radius.100',
});

export default function VerifiedPageAtlaskit() {
  const [records, setRecords] = useState<ConfirmedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const confirmedRecords = getConfirmedRecords();
    setRecords(confirmedRecords);

    const total = confirmedRecords.length;
    const verified = confirmedRecords.filter(r => r.verified).length;
    const unverified = total - verified;

    setStats({ total, verified, unverified });
    setIsLoading(false);
  };

  const getExplorerUrl = (txHash: string) => {
    const config = getValidatedConfig();
    const network = config.networkType === 152 ? 'testnet' : 'mainnet';
    return `https://${network}.symbol.fyi/transactions/${txHash}`;
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
          <Box xcss={headingStyles}>確定済みレコード</Box>

          {/* 統計情報 */}
          <Grid gap="space.200" templateColumns="1fr 1fr 1fr">
            <Box xcss={statCardStyles}>
              <div style={{ fontSize: '12px', color: '#6B778C', marginBottom: '4px' }}>
                合計
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {stats.total}
              </div>
            </Box>

            <Box xcss={statCardStyles}>
              <div style={{ fontSize: '12px', color: '#6B778C', marginBottom: '4px' }}>
                検証済み
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00875A' }}>
                {stats.verified}
              </div>
            </Box>

            <Box xcss={statCardStyles}>
              <div style={{ fontSize: '12px', color: '#6B778C', marginBottom: '4px' }}>
                未検証
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF991F' }}>
                {stats.unverified}
              </div>
            </Box>
          </Grid>

          {/* レコード一覧 */}
          {records.length === 0 ? (
            <SectionMessage
              appearance="information"
              title="💡 確定済みレコードについて"
            >
              <Stack space="space.100">
                <p>確定済みレコードは、Symbolブロックチェーンに記録された学習記録です。</p>

                <div style={{ marginTop: '12px' }}>
                  <strong>確定済みレコードを作成するには:</strong>
                  <ol style={{ marginLeft: '20px', marginTop: '8px' }}>
                    <li>「保留中」ページに移動</li>
                    <li>レコードの「ブロックチェーンに登録」ボタンをクリック</li>
                    <li>SSS Extensionで署名</li>
                    <li>トランザクションが承認されると、こちらのページに表示されます</li>
                  </ol>
                </div>
              </Stack>
            </SectionMessage>
          ) : (
            <Stack space="space.200">
              {records.map((record) => (
                <RecordCardAtlaskit
                  key={record.id}
                  session={record.session}
                  status="confirmed"
                  timestamp={record.timestamp}
                  transactionHash={record.transactionHash}
                  showActions={true}
                  actionButton={
                    <Stack space="space.150">
                      {/* トランザクションハッシュ */}
                      <Box xcss={infoBoxStyles}>
                        <div style={{ fontSize: '10px', color: '#6B778C', marginBottom: '4px' }}>
                          トランザクションハッシュ
                        </div>
                        <div style={{ fontSize: '11px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                          {record.transactionHash}
                        </div>
                      </Box>

                      {/* ブロック高 */}
                      <Box xcss={infoBoxStyles}>
                        <div style={{ fontSize: '10px', color: '#6B778C', marginBottom: '4px' }}>
                          ブロック高
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>
                          {record.blockHeight.toLocaleString()}
                        </div>
                      </Box>

                      {/* 検証ステータス */}
                      <Inline space="space.100" alignBlock="center">
                        <Lozenge appearance={record.verified ? 'success' : 'moved'}>
                          {record.verified ? '検証済み' : '未検証'}
                        </Lozenge>
                      </Inline>

                      {/* アクションボタン */}
                      <Inline space="space.100">
                        <Link href={`/verify?hash=${record.transactionHash}`}>
                          <Button
                            appearance="primary"
                            iconBefore={<EditorSearchIcon label="Verify" />}
                          >
                            検証ページで確認
                          </Button>
                        </Link>

                        <a
                          href={getExplorerUrl(record.transactionHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            appearance="default"
                            iconBefore={<LinkIcon label="Explorer" />}
                          >
                            Explorer
                          </Button>
                        </a>
                      </Inline>
                    </Stack>
                  }
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
