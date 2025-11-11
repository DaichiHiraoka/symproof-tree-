/**
 * レコードリストコンポーネント
 * 複数のレコードを一覧表示
 */

import { PendingRecord, ConfirmedRecord } from '@/types';
import RecordCard from './RecordCard';

interface RecordListProps {
  records: (PendingRecord | ConfirmedRecord)[];
  type: 'pending' | 'confirmed';
  onRecordClick?: (recordId: string) => void;
  showActions?: boolean;
  renderAction?: (record: PendingRecord | ConfirmedRecord) => React.ReactNode;
  emptyMessage?: string;
}

export default function RecordList({
  records,
  type,
  onRecordClick,
  showActions = false,
  renderAction,
  emptyMessage = 'レコードがありません',
}: RecordListProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map(record => {
        const isPending = 'status' in record;
        const isConfirmed = 'transactionHash' in record;

        return (
          <RecordCard
            key={record.id}
            session={record.session}
            status={
              isPending
                ? (record as PendingRecord).status
                : isConfirmed
                ? 'confirmed'
                : 'pending'
            }
            timestamp={
              isConfirmed ? (record as ConfirmedRecord).timestamp : undefined
            }
            transactionHash={
              isConfirmed ? (record as ConfirmedRecord).transactionHash : undefined
            }
            onSelect={onRecordClick ? () => onRecordClick(record.id) : undefined}
            showActions={showActions}
            actionButton={renderAction ? renderAction(record) : undefined}
          />
        );
      })}
    </div>
  );
}
