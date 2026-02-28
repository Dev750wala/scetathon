'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Report } from '@/types';
import { formatRelativeTime, getSeverityColor } from '@/lib/utils';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports?limit=5').then((res) => {
      setReports(res.data.data?.reports || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Help keep SCET campus clean by reporting issues.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link href="/dashboard/student/report" className="bg-green-600 text-white p-6 rounded-2xl hover:bg-green-700 transition-colors">
          <div className="text-3xl mb-2">📸</div>
          <h3 className="font-bold text-lg">Report an Issue</h3>
          <p className="text-green-100 text-sm mt-1">Text, voice, or photo</p>
        </Link>
        <Link href="/dashboard/student/history" className="bg-white text-gray-900 p-6 rounded-2xl border border-gray-200 hover:border-green-300 transition-colors">
          <div className="text-3xl mb-2">📋</div>
          <h3 className="font-bold text-lg">My Reports</h3>
          <p className="text-gray-500 text-sm mt-1">Track your complaint history</p>
        </Link>
      </div>

      {/* Recent Reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          <Link href="/dashboard/student/history" className="text-green-600 text-sm hover:underline">View all</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600" /></div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-gray-500">No reports yet. Be the first to report an issue!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{r.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{r.zone?.name} · {formatRelativeTime(r.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(r.severity)}`}>{r.severity}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{r.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
