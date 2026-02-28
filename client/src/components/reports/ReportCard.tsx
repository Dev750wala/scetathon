import { Report } from '@/types';
import { formatRelativeTime, getSeverityColor } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-600',
  MERGED: 'bg-purple-100 text-purple-700',
};

export default function ReportCard({ report }: { report: Report }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-medium text-gray-900">{report.title}</h3>
        <div className="flex gap-2 shrink-0">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(report.severity)}`}>{report.severity}</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[report.status] || 'bg-gray-100 text-gray-600'}`}>{report.status}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        {report.zone && <span>📍 {report.zone.name}</span>}
        <span>🏷️ {report.category}</span>
        <span>👥 {report.affectedCount}</span>
        <span>🕐 {formatRelativeTime(report.createdAt)}</span>
      </div>
    </div>
  );
}
