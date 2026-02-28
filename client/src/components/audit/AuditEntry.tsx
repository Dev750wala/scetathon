import { AuditLog } from '@/types';
import { formatDate, truncateHash } from '@/lib/utils';

export default function AuditEntry({ entry }: { entry: AuditLog }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="inline-block bg-gray-100 text-gray-700 text-xs font-mono px-2 py-0.5 rounded mr-2">{entry.action}</span>
          <span className="text-sm text-gray-600">by <span className="font-medium">{entry.actor}</span></span>
        </div>
        <span className="text-xs text-gray-400 shrink-0">{formatDate(entry.createdAt)}</span>
      </div>
      <div className="text-xs font-mono space-y-1">
        <div className="text-gray-400">prev: <span className="bg-gray-50 px-1 rounded">{truncateHash(entry.previousHash)}</span></div>
        <div className="text-green-600">curr: <span className="bg-green-50 px-1 rounded">{truncateHash(entry.currentHash)}</span></div>
      </div>
    </div>
  );
}
