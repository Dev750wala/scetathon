'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';

export default function AnalyticsPage() {
  const [trends, setTrends] = useState<{ createdAt: string; _count: { id: number } }[]>([]);
  const [zones, setZones] = useState<{ name: string; currentScore: number; _count: { reports: number } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/trends?days=30'),
      api.get('/analytics/zones'),
    ]).then(([trendsRes, zonesRes]) => {
      setTrends(trendsRes.data.data || []);
      setZones(zonesRes.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const chartData = trends.map((t) => ({
    date: new Date(t.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    count: t._count.id,
  }));

  const zoneChartData = zones.slice(0, 10).map((z) => ({
    name: z.name.length > 15 ? z.name.slice(0, 15) + '…' : z.name,
    score: Math.round(z.currentScore),
    reports: z._count.reports,
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Performance Analytics</h1>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" /></div>
      ) : (
        <div className="space-y-8">
          {/* Reports Trend */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Reports — Last 30 Days</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Zone Cleanliness */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Zone Cleanliness Scores</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={zoneChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" fill="#16a34a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
