'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyTransaction, VerificationResult } from '@/lib/symbol/verify';
import { getValidatedConfig } from '@/lib/symbol/config';
import { useFlag } from '@/components/FlagProvider';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import SectionMessage from '@atlaskit/section-message';
import Textfield from '@atlaskit/textfield';
import { Box, Stack, Grid, Inline, xcss } from '@atlaskit/primitives';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import LinkIcon from '@atlaskit/icon/glyph/link';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';

const pageContainerStyles = xcss({
  paddingBlock: 'space.400',
  paddingInline: 'space.300',
  minHeight: '100vh',
});

const contentContainerStyles = xcss({
  maxWidth: '900px',
  marginInline: 'auto',
});

const headingStyles = xcss({
  font: 'font.heading.xlarge',
  fontWeight: 'font.weight.semibold',
  marginBlockEnd: 'space.100',
});

const subtitleStyles = xcss({
  color: 'color.text.subtlest',
  marginBlockEnd: 'space.400',
});

const formBoxStyles = xcss({
  padding: 'space.300',
  backgroundColor: 'elevation.surface.raised',
  borderRadius: 'border.radius.200',
  boxShadow: 'elevation.shadow.raised',
  marginBlockEnd: 'space.300',
});

const infoBoxStyles = xcss({
  padding: 'space.150',
  backgroundColor: 'color.background.neutral',
  borderRadius: 'border.radius.100',
});

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const [txHash, setTxHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const { showError } = useFlag();

  useEffect(() => {
    const hashFromUrl = searchParams.get('hash');
    if (hashFromUrl) {
      setTxHash(hashFromUrl);
      verifyFromHash(hashFromUrl);
    }
  }, [searchParams]);

  const verifyFromHash = async (hash: string) => {
    setVerifying(true);
    setResult(null);

    try {
      const verificationResult = await verifyTransaction(hash.trim());
      setResult(verificationResult);
    } catch (error) {
      console.error('検証エラー:', error);
      showError('検証中にエラーが発生しました');
    } finally {
      setVerifying(false);
    }
  };

  const handleVerify = async () => {
    if (!txHash || txHash.trim().length === 0) {
      showError('トランザクションハッシュを入力してください');
      return;
    }

    await verifyFromHash(txHash);
  };

  const handleClear = () => {
    setTxHash('');
    setResult(null);
  };

  const getExplorerUrl = (hash: string) => {
    const config = getValidatedConfig();
    const network = config.networkType === 152 ? 'testnet' : 'mainnet';
    return `https://${network}.symbol.fyi/transactions/${hash}`;
  };

  return (
    <Box xcss={pageContainerStyles}>
      <Box xcss={contentContainerStyles}>
        <Stack space="space.300">
          <div>
            <Box xcss={headingStyles}>学習記録の検証</Box>
            <Box xcss={subtitleStyles}>
              トランザクションハッシュを入力して、ブロックチェーン上の学習記録を検証します
            </Box>
          </div>

          {/* 入力フォーム */}
          <Box xcss={formBoxStyles}>
            <Stack space="space.200">
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  トランザクションハッシュ
                </label>
                <Textfield
                  value={txHash}
                  onChange={(e) => setTxHash((e.target as HTMLInputElement).value)}
                  placeholder="例: 3532BA1180E2D12ABD2130488B6CA7EB165D38430202BAF0EC8449A4FF34588D"
                  isDisabled={verifying}
                />
                <div style={{ fontSize: '11px', color: '#6B778C', marginTop: '4px' }}>
                  64文字の16進数文字列（0-9, A-F）
                </div>
              </div>

              <Inline space="space.100">
                <Button
                  appearance="primary"
                  onClick={handleVerify}
                  isDisabled={verifying || !txHash.trim()}
                  iconBefore={verifying ? <Spinner size="small" /> : <EditorSearchIcon label="Verify" />}
                >
                  {verifying ? '検証中...' : '検証する'}
                </Button>

                <Button
                  appearance="subtle"
                  onClick={handleClear}
                  isDisabled={verifying}
                  iconBefore={<CrossCircleIcon label="Clear" />}
                >
                  クリア
                </Button>
              </Inline>
            </Stack>
          </Box>

          {/* 検証結果 */}
          {result && (
            <Box xcss={formBoxStyles}>
              <Stack space="space.300">
                <div style={{ fontSize: '18px', fontWeight: 600 }}>検証結果</div>

                {/* ステータス表示 */}
                {result.success && result.valid ? (
                  <SectionMessage appearance="success" title="検証成功">
                    <p>このトランザクションはブロックチェーン上で確認されました</p>
                  </SectionMessage>
                ) : (
                  <SectionMessage appearance="error" title="検証失敗">
                    <p>{result.error?.message || 'トランザクションの検証に失敗しました'}</p>
                    {result.error?.details && (
                      <p style={{ fontSize: '12px', marginTop: '8px' }}>
                        詳細: {result.error.details}
                      </p>
                    )}
                  </SectionMessage>
                )}

                {/* 詳細情報 */}
                {result.success && result.valid && (
                  <Stack space="space.200">
                    <Grid gap="space.200" templateColumns="1fr 1fr">
                      {/* トランザクションハッシュ */}
                      <Box xcss={infoBoxStyles}>
                        <div style={{ fontSize: '11px', color: '#6B778C', marginBottom: '4px' }}>
                          トランザクションハッシュ
                        </div>
                        <div style={{ fontSize: '12px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                          {result.txHash}
                        </div>
                      </Box>

                      {/* ブロック高 */}
                      <Box xcss={infoBoxStyles}>
                        <div style={{ fontSize: '11px', color: '#6B778C', marginBottom: '4px' }}>
                          ブロック高
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 600 }}>
                          {result.blockHeight?.toLocaleString()}
                        </div>
                      </Box>

                      {/* 署名者アドレス */}
                      <Box xcss={infoBoxStyles}>
                        <div style={{ fontSize: '11px', color: '#6B778C', marginBottom: '4px' }}>
                          署名者アドレス
                        </div>
                        <div style={{ fontSize: '12px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                          {result.signerAddress}
                        </div>
                      </Box>

                      {/* タイムスタンプ */}
                      <Box xcss={infoBoxStyles}>
                        <div style={{ fontSize: '11px', color: '#6B778C', marginBottom: '4px' }}>
                          タイムスタンプ
                        </div>
                        <div style={{ fontSize: '12px' }}>
                          {result.timestamp?.toLocaleString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </div>
                      </Box>
                    </Grid>

                    {/* メッセージ内容 */}
                    {result.message && (
                      <Box xcss={infoBoxStyles}>
                        <div style={{ fontSize: '11px', color: '#6B778C', marginBottom: '8px' }}>
                          メッセージ内容
                        </div>
                        <pre style={{
                          fontSize: '11px',
                          fontFamily: 'monospace',
                          overflowX: 'auto',
                          backgroundColor: '#FAFBFC',
                          padding: '12px',
                          borderRadius: '4px',
                          border: '1px solid #DFE1E6'
                        }}>
                          {JSON.stringify(result.message, null, 2)}
                        </pre>
                      </Box>
                    )}

                    {/* 検証詳細 */}
                    {result.details && (
                      <Box xcss={infoBoxStyles}>
                        <div style={{ fontSize: '11px', color: '#6B778C', marginBottom: '8px' }}>
                          検証詳細
                        </div>
                        <Stack space="space.100">
                          <Inline space="space.100" alignBlock="center">
                            <span style={{ color: result.details.transactionFound ? '#00875A' : '#DE350B' }}>
                              {result.details.transactionFound ? '✓' : '✗'}
                            </span>
                            <span style={{ fontSize: '12px' }}>
                              トランザクションが見つかりました
                            </span>
                          </Inline>

                          <Inline space="space.100" alignBlock="center">
                            <span style={{ color: result.details.messageDecoded ? '#00875A' : '#DE350B' }}>
                              {result.details.messageDecoded ? '✓' : '✗'}
                            </span>
                            <span style={{ fontSize: '12px' }}>
                              メッセージがデコードされました
                            </span>
                          </Inline>

                          <Inline space="space.100" alignBlock="center">
                            <span style={{ color: result.details.blockConfirmed ? '#00875A' : '#DE350B' }}>
                              {result.details.blockConfirmed ? '✓' : '✗'}
                            </span>
                            <span style={{ fontSize: '12px' }}>
                              ブロックで確認されました
                            </span>
                          </Inline>
                        </Stack>
                      </Box>
                    )}

                    {/* Symbol Explorerリンク */}
                    <div style={{ paddingTop: '16px', borderTop: '1px solid #DFE1E6' }}>
                      <a
                        href={getExplorerUrl(result.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          appearance="link"
                          iconAfter={<LinkIcon label="External" />}
                        >
                          Symbol Explorerで確認
                        </Button>
                      </a>
                    </div>
                  </Stack>
                )}
              </Stack>
            </Box>
          )}

          {/* 使い方ガイド */}
          {!result && (
            <SectionMessage appearance="information" title="💡 使い方">
              <ol style={{ marginLeft: '20px', fontSize: '14px' }}>
                <li>保留中レコードページでブロックチェーンに登録したトランザクションハッシュを取得</li>
                <li>上記の入力欄にトランザクションハッシュを貼り付け</li>
                <li>「検証する」ボタンをクリック</li>
                <li>検証結果とトランザクション詳細が表示されます</li>
              </ol>
            </SectionMessage>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

export default function VerifyPageAtlaskit() {
  return (
    <Suspense fallback={
      <Box xcss={pageContainerStyles}>
        <Box xcss={contentContainerStyles}>
          <Inline space="space.100" alignBlock="center">
            <Spinner size="large" />
            <span style={{ fontSize: '18px' }}>読み込み中...</span>
          </Inline>
        </Box>
      </Box>
    }>
      <VerifyPageContent />
    </Suspense>
  );
}
