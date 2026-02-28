'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { JobCard } from '@/types';
import { formatRelativeTime, getSeverityColor } from '@/lib/utils';

const JOB_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  ASSIGNED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-green-100 text-green-700',
  VERIFIED: 'bg-emerald-100 text-emerald-700',
};

export default function SupervisorDashboard() {
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/jobs?limit=5'),
      api.get('/analytics/overview'),
    ]).then(([jobsRes, statsRes]) => {
      setJobs(jobsRes.data.data?.jobs || []);
      const s = statsRes.data.data;
      setStats({ pending: s?.openReports || 0, inProgress: s?.activeJobs || 0, completed: s?.resolvedReports || 0 });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Supervisor Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage jobs and coordinate the cleaning team.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Open Reports', value: stats.pending, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Jobs', value: stats.inProgress, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Resolved', value: stats.completed, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-5`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-600 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <Link href="/dashboard/supervisor/jobs" className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
          View All Jobs
        </Link>
        <Link href="/dashboard/supervisor/assign" className="bg-white text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
          Assign Workers
        </Link>
      </div>

      {/* Recent Jobs */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h2>
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600" /></div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-gray-900">{job.report?.title || 'Job'}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">📍 {job.zone?.name} · {formatRelativeTime(job.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  {job.report?.severity && <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(job.report.severity)}`}>{job.report.severity}</span>}
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${JOB_STATUS_COLORS[job.status]}`}>{job.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
