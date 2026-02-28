import { AuditLog } from '@/types';
import AuditEntry from './AuditEntry';

export default function AuditChain({ entries }: { entries: AuditLog[] }) {
  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <div key={entry.id}>
          <AuditEntry entry={entry} />
          {i < entries.length - 1 && (
            <div className="flex justify-center py-1">
              <div className="w-0.5 h-4 bg-gray-200" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
