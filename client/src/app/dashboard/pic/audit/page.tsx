'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { AuditLog } from '@/types';
import { formatDate, truncateHash } from '@/lib/utils';

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditLog[]>([]);
  const [chainValid, setChainValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/audit'),
      api.get('/audit/verify'),
    ]).then(([chainRes, verifyRes]) => {
      setEntries(chainRes.data.data?.entries || []);
      setChainValid(verifyRes.data.data?.valid ?? null);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-gray-500 mt-1">SHA-256 hash-chained tamper-proof log of all system events.</p>
        </div>
        {chainValid !== null && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${chainValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {chainValid ? '✅ Chain Verified' : '❌ Chain Broken'}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" /></div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">🔐</p>
          <p className="text-gray-500">No audit entries yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <div key={entry.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs font-mono px-2 py-1 rounded mr-2">{entry.action}</span>
                  <span className="text-sm text-gray-600">by <span className="font-medium text-gray-900">{entry.actor}</span></span>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{formatDate(entry.createdAt)}</span>
              </div>
              <div className="text-xs font-mono text-gray-400 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">prev:</span>
                  <span className="bg-gray-50 px-2 py-0.5 rounded">{truncateHash(entry.previousHash)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">curr:</span>
                  <span className="bg-green-50 px-2 py-0.5 rounded text-green-700">{truncateHash(entry.currentHash)}</span>
                </div>
              </div>
              {i < entries.length - 1 && <div className="mt-2 ml-4 border-l-2 border-dashed border-gray-200 h-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
