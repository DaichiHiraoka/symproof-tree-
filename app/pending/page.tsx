'use client';

import { useEffect, useState } from 'react';
import { PendingRecord } from '@/types';
import {
  getAllPendingRecords,
  getPendingRecordsCount,
  addToPending,
} from '@/lib/detection/pendingRecords';
import { loadMockBrowsingSessions } from '@/lib/detection/autoDetect';
import { submitLearningRecord } from '@/lib/symbol/workflowSimple';
import { checkSSSAvailability, getSSSAccountInfo } from '@/lib/symbol/sssSimple';
import RecordCardAtlaskit from '@/components/RecordCardAtlaskit';
import { useFlag } from '@/components/FlagProvider';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import SectionMessage from '@atlaskit/section-message';
import { Box, Stack, Grid, Inline, xcss } from '@atlaskit/primitives';
import LinkFilledIcon from '@atlaskit/icon/glyph/link-filled';

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
  font: 'font.heading.large',
  fontWeight: 'font.weight.semibold',
  marginBlockEnd: 'space.300',
});

const statCardStyles = xcss({
  padding: 'space.200',
  borderRadius: 'border.radius.200',
  backgroundColor: 'elevation.surface.raised',
});

const statLabelStyles = xcss({
  font: 'font.body.small',
  color: 'color.text.subtlest',
});

const statValueStyles = xcss({
  font: 'font.heading.xlarge',
  fontWeight: 'font.weight.bold',
});

const devToolsBoxStyles = xcss({
  padding: 'space.200',
  backgroundColor: 'color.background.neutral',
  borderRadius: 'border.radius.200',
});

export default function PendingPageAtlaskit() {
  const [records, setRecords] = useState<PendingRecord[]>([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, submitting: 0, failed: 0 });
  const [sssAddress, setSSSAddress] = useState<string | null>(null);
  const [sssAvailable, setSSSAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ step: string; message: string } | null>(null);

  const { showSuccess, showError, showInfo } = useFlag();

  useEffect(() => {
    loadData();
    checkSSS();
  }, []);

  const loadData = () => {
    const allRecords = getAllPendingRecords();
    setRecords(allRecords);
    setCounts(getPendingRecordsCount());
    setIsLoading(false);
  };

  const checkSSS = () => {
    const availability = checkSSSAvailability();
    setSSSAvailable(availability.available);

    if (availability.available) {
      const accountInfo = getSSSAccountInfo();
      setSSSAddress(accountInfo?.address || null);
    }
  };

  const loadMockData = async () => {
    try {
      const sessions = await loadMockBrowsingSessions();
      const newRecords = sessions.map(session => addToPending(session)).filter(Boolean) as PendingRecord[];

      if (newRecords.length > 0) {
        showSuccess(
          'モックデータ読み込み完了',
          `${newRecords.length}件の保留中レコードを追加しました`
        );
        loadData();
      }
    } catch (error) {
      console.error('モックデータ読み込みエラー:', error);
      showError('モックデータの読み込みに失敗しました');
    }
  };

  const handleSubmit = async (record: PendingRecord) => {
    if (!sssAvailable) {
      showError(
        'SSS Extension未接続',
        'SSS Extensionがインストールされていないか、許可されていません'
      );
      return;
    }

    setSubmitting(record.id);
    setProgress({ step: 'init', message: '送信準備中...' });

    try {
      const result = await submitLearningRecord(
        record.session,
        record.id,
        (step, message) => {
          setProgress({ step, message });
        }
      );

      if (result.success) {
        showSuccess(
          'トランザクション送信成功',
          <>
            <strong>Transaction Hash:</strong>
            <br />
            <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
              {result.transactionHash}
            </code>
          </>
        );
        loadData();
      } else {
        showError(
          '送信失敗',
          result.error?.message || '不明なエラーが発生しました'
        );
      }
    } catch (error) {
      console.error('送信エラー:', error);
      showError('送信中にエラーが発生しました');
    } finally {
      setSubmitting(null);
      setProgress(null);
    }
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
        <Box xcss={headingStyles}>保留中レコード</Box>

        <Stack space="space.300">
          {/* SSS Extension ステータス */}
          <SectionMessage
            appearance={sssAvailable ? 'success' : 'warning'}
            title={sssAvailable ? 'SSS Extension 接続済み' : 'SSS Extension 未接続'}
          >
            {sssAvailable ? (
              <p>アドレス: <code>{sssAddress}</code></p>
            ) : (
              <p>
                SSS Extensionをインストールし、接続を許可してください。
                ブロックチェーンへの登録にはSSS Extensionが必要です。
              </p>
            )}
          </SectionMessage>

          {/* 統計情報 */}
          <Grid gap="space.200" templateColumns="1fr 1fr 1fr 1fr">
            <Box xcss={statCardStyles}>
              <Box xcss={statLabelStyles}>合計</Box>
              <Box xcss={statValueStyles}>{counts.total}</Box>
            </Box>
            <Box xcss={statCardStyles}>
              <Box xcss={statLabelStyles}>保留中</Box>
              <Box xcss={statValueStyles}>{counts.pending}</Box>
            </Box>
            <Box xcss={statCardStyles}>
              <Box xcss={statLabelStyles}>送信中</Box>
              <Box xcss={statValueStyles}>{counts.submitting}</Box>
            </Box>
            <Box xcss={statCardStyles}>
              <Box xcss={statLabelStyles}>失敗</Box>
              <Box xcss={statValueStyles}>{counts.failed}</Box>
            </Box>
          </Grid>

          {/* 進捗表示 */}
          {progress && (
            <SectionMessage appearance="information" title="送信中...">
              <p><strong>ステップ:</strong> {progress.step}</p>
              <p>{progress.message}</p>
            </SectionMessage>
          )}

          {/* レコード一覧 */}
          {records.length === 0 ? (
            <SectionMessage
              appearance="discovery"
              title="保留中のレコードがありません"
            >
              <p>モックデータを読み込んでテストしてください。</p>
            </SectionMessage>
          ) : (
            <Stack space="space.200">
              {records.map(record => {
                const isSubmittingThis = submitting === record.id;

                return (
                  <RecordCardAtlaskit
                    key={record.id}
                    session={record.session}
                    status={record.status}
                    showActions={true}
                    actionButton={
                      <Button
                        appearance="primary"
                        onClick={() => handleSubmit(record)}
                        isDisabled={!sssAvailable || isSubmittingThis || record.status === 'submitting'}
                        iconBefore={isSubmittingThis ? <Spinner size="small" /> : <LinkFilledIcon label="Register" />}
                      >
                        {isSubmittingThis ? '送信中...' : 'ブロックチェーンに登録'}
                      </Button>
                    }
                  />
                );
              })}
            </Stack>
          )}

          {/* 開発用ツール */}
          <Box xcss={devToolsBoxStyles}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
              開発者ツール
            </div>
            <Inline space="space.100">
              <Button onClick={loadMockData}>
                モックデータを読み込む
              </Button>
              <Button
                onClick={() => {
                  loadData();
                  checkSSS();
                }}
              >
                再読み込み
              </Button>
            </Inline>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
