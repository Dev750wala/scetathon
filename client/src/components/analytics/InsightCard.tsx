import { InsightCard } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export default function InsightCardComponent({ insight }: { insight: InsightCard }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900">🤖 {insight.title}</h3>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full shrink-0">
          {Math.round(insight.confidence * 100)}%
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{insight.description}</p>
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-xs font-medium text-green-800">💡 {insight.suggestedAction}</p>
      </div>
      <p className="text-xs text-gray-400 mt-3">{formatRelativeTime(insight.createdAt)}</p>
    </div>
  );
}
