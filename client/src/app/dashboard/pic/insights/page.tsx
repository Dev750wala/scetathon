'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { InsightCard } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchInsights = () => {
    setLoading(true);
    api.get('/insights').then((res) => {
      setInsights(res.data.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(fetchInsights, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.post('/insights/generate');
      fetchInsights();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-500 mt-1">AI-generated patterns and recommendations.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {generating ? '⏳ Generating...' : '🤖 Generate Insights'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" /></div>
      ) : insights.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">🤖</p>
          <p className="text-gray-500">No insights yet. Click "Generate Insights" to analyze patterns.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full shrink-0">
                  {Math.round(insight.confidence * 100)}% confidence
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{insight.description}</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 font-medium">💡 Suggested Action</p>
                <p className="text-sm text-green-700 mt-1">{insight.suggestedAction}</p>
              </div>
              <p className="text-xs text-gray-400 mt-3">{formatRelativeTime(insight.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
