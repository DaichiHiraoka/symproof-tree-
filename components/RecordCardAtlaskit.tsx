/**
 * レコードカードコンポーネント (Atlaskit版)
 * 学習レコードを表示するための再利用可能なカード
 */

'use client';

import { BrowsingSession } from '@/types';
import Button from '@atlaskit/button';
import Lozenge from '@atlaskit/lozenge';
import { Box, Stack, Inline, xcss } from '@atlaskit/primitives';
import LinkIcon from '@atlaskit/icon/glyph/link';
import TimeIcon from '@atlaskit/icon/glyph/recent';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';

interface RecordCardProps {
  session: BrowsingSession;
  status?: 'pending' | 'submitting' | 'failed' | 'confirmed';
  timestamp?: Date;
  transactionHash?: string;
  onSelect?: () => void;
  showActions?: boolean;
  actionButton?: React.ReactNode;
}

const cardStyles = xcss({
  borderStyle: 'solid',
  borderWidth: 'border.width',
  borderColor: 'color.border',
  borderRadius: 'border.radius.200',
  padding: 'space.200',
  backgroundColor: 'elevation.surface',
  ':hover': {
    backgroundColor: 'elevation.surface.hovered',
    boxShadow: 'elevation.shadow.raised',
  },
  cursor: 'pointer',
  transition: 'all 0.2s',
});

const cardNonClickableStyles = xcss({
  borderStyle: 'solid',
  borderWidth: 'border.width',
  borderColor: 'color.border',
  borderRadius: 'border.radius.200',
  padding: 'space.200',
  backgroundColor: 'elevation.surface',
});

const titleStyles = xcss({
  font: 'font.heading.small',
  fontWeight: 'font.weight.semibold',
  color: 'color.text',
});

const urlStyles = xcss({
  font: 'font.body.small',
  color: 'color.text.subtlest',
  wordBreak: 'break-all',
});

const metaItemStyles = xcss({
  font: 'font.body.small',
  color: 'color.text.subtle',
});

const hashBoxStyles = xcss({
  backgroundColor: 'color.background.neutral',
  borderRadius: 'border.radius.100',
  padding: 'space.100',
  font: 'font.code',
  wordBreak: 'break-all',
});

export default function RecordCardAtlaskit({
  session,
  status = 'pending',
  timestamp,
  transactionHash,
  onSelect,
  showActions = false,
  actionButton,
}: RecordCardProps) {
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

  const getStatusAppearance = (status: string): 'default' | 'inprogress' | 'moved' | 'new' | 'removed' | 'success' => {
    switch (status) {
      case 'pending':
        return 'moved'; // Yellow
      case 'submitting':
        return 'inprogress'; // Blue
      case 'failed':
        return 'removed'; // Red
      case 'confirmed':
        return 'success'; // Green
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '保留中';
      case 'submitting':
        return '送信中';
      case 'failed':
        return '失敗';
      case 'confirmed':
        return '検証済み';
      default:
        return '';
    }
  };

  return (
    <Box xcss={onSelect ? cardStyles : cardNonClickableStyles} onClick={onSelect}>
      <Stack space="space.150">
        {/* Header: Title + Status */}
        <Inline space="space.100" alignBlock="start" spread="space-between">
          <Box xcss={titleStyles}>
            {session.title}
          </Box>
          <Lozenge appearance={getStatusAppearance(status)}>
            {getStatusText(status)}
          </Lozenge>
        </Inline>

        {/* URL */}
        <Inline space="space.050" alignBlock="center">
          <LinkIcon label="URL" size="small" />
          <Box xcss={urlStyles}>
            {session.url}
          </Box>
        </Inline>

        {/* Meta Information */}
        <Inline space="space.200" alignBlock="center">
          <Inline space="space.050" alignBlock="center">
            <TimeIcon label="学習時間" size="small" />
            <Box xcss={metaItemStyles}>
              {formatDuration(session.duration)}
            </Box>
          </Inline>

          <Inline space="space.050" alignBlock="center">
            <CalendarIcon label="開始時刻" size="small" />
            <Box xcss={metaItemStyles}>
              {formatDate(session.startTime)}
            </Box>
          </Inline>
        </Inline>

        {/* Timestamp (if confirmed) */}
        {timestamp && (
          <Inline space="space.050" alignBlock="center">
            <CalendarIcon label="確定日" size="small" />
            <Box xcss={metaItemStyles}>
              確定日: {formatDate(timestamp)}
            </Box>
          </Inline>
        )}

        {/* Transaction Hash */}
        {transactionHash && (
          <Box xcss={hashBoxStyles}>
            <Box xcss={metaItemStyles}>
              TX Hash: {transactionHash}
            </Box>
          </Box>
        )}

        {/* Content Hash */}
        {session.contentHash && (
          <Box xcss={metaItemStyles}>
            Hash: {session.contentHash.substring(0, 32)}...
          </Box>
        )}

        {/* Action Button */}
        {showActions && actionButton && (
          <Box>
            {actionButton}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
