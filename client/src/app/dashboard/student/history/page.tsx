'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Report } from '@/types';
import { formatRelativeTime, getSeverityColor } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-600',
  MERGED: 'bg-purple-100 text-purple-700',
};

export default function HistoryPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const params: Record<string, string> = { limit: '50' };
    if (status) params.status = status;
    api.get('/reports', { params }).then((res) => {
      setReports(res.data.data?.reports || []);
    }).finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Status</option>
          {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'MERGED'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" /></div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-500">No reports found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-gray-900">{r.title}</h3>
                <div className="flex gap-2 shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(r.severity)}`}>{r.severity}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{r.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>📍 {r.zone?.name}</span>
                <span>🏷️ {r.category}</span>
                <span>👥 {r.affectedCount} affected</span>
                <span>🕐 {formatRelativeTime(r.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
