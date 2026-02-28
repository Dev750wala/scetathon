'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { JobCard } from '@/types';
import JobCardComponent from './JobCard';
import JobAssignModalComponent from './JobAssignModal';

export default function JobList() {
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);

  const fetchJobs = () => {
    const params: Record<string, string> = { limit: '50' };
    if (statusFilter) params.status = statusFilter;
    setLoading(true);
    api.get('/jobs', { params }).then((res) => {
      setJobs(res.data.data?.jobs || []);
    }).finally(() => setLoading(false));
  };

  useEffect(fetchJobs, [statusFilter]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Status</option>
          {['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500">{jobs.length} jobs</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" /></div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">⚙️</p>
          <p className="text-gray-500">No jobs found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobCardComponent key={job.id} job={job} onAssign={setSelectedJob} />
          ))}
        </div>
      )}

      {selectedJob && (
        <JobAssignModalComponent
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onAssigned={() => { setSelectedJob(null); fetchJobs(); }}
        />
      )}
    </div>
  );
}
