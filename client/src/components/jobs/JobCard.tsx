import { JobCard } from '@/types';
import { formatRelativeTime, getSeverityColor } from '@/lib/utils';

const JOB_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  ASSIGNED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-green-100 text-green-700',
  VERIFIED: 'bg-emerald-100 text-emerald-700',
};

interface JobCardProps {
  job: JobCard;
  onAssign?: (job: JobCard) => void;
}

export default function JobCardComponent({ job, onAssign }: JobCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{job.report?.title || 'Job Card'}</h3>
          <p className="text-sm text-gray-500 mt-0.5">📍 {job.zone?.name} · {job.zone?.building}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {job.report?.severity && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(job.report.severity)}`}>{job.report.severity}</span>
          )}
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${JOB_STATUS_COLORS[job.status]}`}>{job.status}</span>
        </div>
      </div>

      {job.assignedWorker && (
        <p className="text-xs text-gray-500 mb-2">👷 {job.assignedWorker.name}</p>
      )}

      {job.notes && <p className="text-xs text-gray-600 mb-3 italic">"{job.notes}"</p>}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{formatRelativeTime(job.createdAt)}</span>
        {onAssign && job.status === 'PENDING' && (
          <button
            onClick={() => onAssign(job)}
            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
          >
            Assign Worker
          </button>
        )}
      </div>
    </div>
  );
}
