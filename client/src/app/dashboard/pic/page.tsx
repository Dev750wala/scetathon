'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { OverviewStats } from '@/types';

export default function PICDashboard() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/overview').then((res) => {
      setStats(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const kpis = stats ? [
    { label: 'Total Reports', value: stats.totalReports, icon: '📋', color: 'bg-blue-50 text-blue-700' },
    { label: 'Open Issues', value: stats.openReports, icon: '🔴', color: 'bg-red-50 text-red-700' },
    { label: 'Active Jobs', value: stats.activeJobs, icon: '⚙️', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Resolved', value: stats.resolvedReports, icon: '✅', color: 'bg-green-50 text-green-700' },
    { label: 'Avg. Score', value: `${stats.avgCleanlinessScore}%`, icon: '🏆', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Resolution Rate', value: `${stats.resolutionRate}%`, icon: '📈', color: 'bg-purple-50 text-purple-700' },
  ] : [];

  const quickLinks = [
    { href: '/dashboard/pic/analytics', label: 'Analytics', icon: '📊' },
    { href: '/dashboard/pic/heatmap', label: 'Heatmap', icon: '🗺️' },
    { href: '/dashboard/pic/insights', label: 'AI Insights', icon: '🤖' },
    { href: '/dashboard/pic/audit', label: 'Audit Trail', icon: '🔐' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">PIC Dashboard</h1>
        <p className="text-gray-500 mt-1">Campus-wide sanitation intelligence overview.</p>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {kpis.map((kpi) => (
            <div key={kpi.label} className={`${kpi.color} rounded-xl p-5`}>
              <div className="flex items-center gap-2 mb-1">
                <span>{kpi.icon}</span>
                <p className="text-sm font-medium opacity-80">{kpi.label}</p>
              </div>
              <p className="text-3xl font-bold">{kpi.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-green-400 hover:bg-green-50 transition-colors text-center">
            <div className="text-3xl mb-2">{link.icon}</div>
            <p className="font-semibold text-gray-900 text-sm">{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
