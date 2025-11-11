/**
 * レコードカードコンポーネント
 * 学習レコードを表示するための再利用可能なカード
 */

import { BrowsingSession } from '@/types';

interface RecordCardProps {
  session: BrowsingSession;
  status?: 'pending' | 'submitting' | 'failed' | 'confirmed';
  timestamp?: Date;
  transactionHash?: string;
  onSelect?: () => void;
  showActions?: boolean;
  actionButton?: React.ReactNode;
}

export default function RecordCard({
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'submitting':
        return 'text-blue-600 dark:text-blue-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'confirmed':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
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
        return '✓ 検証済み';
      default:
        return '';
    }
  };

  return (
    <div
      className={`border border-gray-300 dark:border-gray-700 p-4 rounded-lg hover:shadow-lg transition ${
        onSelect ? 'cursor-pointer' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg flex-1 pr-4">{session.title}</h3>
        <span className={`font-semibold text-sm ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 break-all">
        {session.url}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="text-gray-600 dark:text-gray-400">学習時間: </span>
          <span className="font-medium">{formatDuration(session.duration)}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">開始: </span>
          <span className="font-medium">{formatDate(session.startTime)}</span>
        </div>
        {timestamp && (
          <div>
            <span className="text-gray-600 dark:text-gray-400">確定日: </span>
            <span className="font-medium">{formatDate(timestamp)}</span>
          </div>
        )}
      </div>

      {transactionHash && (
        <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs break-all">
          <span className="text-gray-600 dark:text-gray-400">TX Hash: </span>
          <span className="font-mono">{transactionHash}</span>
        </div>
      )}

      {session.contentHash && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          <span>Hash: </span>
          <span className="font-mono">{session.contentHash.substring(0, 32)}...</span>
        </div>
      )}

      {showActions && actionButton && (
        <div className="mt-4 flex justify-end">{actionButton}</div>
      )}
    </div>
  );
}
