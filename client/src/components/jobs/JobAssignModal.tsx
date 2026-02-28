'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { JobCard, User } from '@/types';
import Modal from '@/components/ui/Modal';

interface JobAssignModalProps {
  job?: JobCard;
  onClose: () => void;
  onAssigned?: () => void;
}

export default function JobAssignModal({ job, onClose, onAssigned }: JobAssignModalProps) {
  const [workers, setWorkers] = useState<User[]>([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingJobs, setPendingJobs] = useState<JobCard[]>([]);
  const [selectedJobId, setSelectedJobId] = useState(job?.id || '');

  useEffect(() => {
    Promise.all([
      api.get('/users?role=SUPERVISOR'),
      ...(!job ? [api.get('/jobs?status=PENDING')] : []),
    ]).then(([workersRes, jobsRes]) => {
      setWorkers(workersRes.data.data || []);
      if (jobsRes) setPendingJobs(jobsRes.data.data?.jobs || []);
    });
  }, [job]);

  const handleAssign = async () => {
    if (!selectedWorker || !selectedJobId) return;
    setLoading(true);
    try {
      await api.patch(`/jobs/${selectedJobId}/assign`, { workerId: selectedWorker });
      onAssigned?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose} title="Assign Worker to Job">
      <div className="space-y-4">
        {!job && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Job</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Choose a pending job...</option>
              {pendingJobs.map((j) => (
                <option key={j.id} value={j.id}>{j.report?.title || j.id}</option>
              ))}
            </select>
          </div>
        )}
        {job && (
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p className="font-medium text-gray-900">{job.report?.title}</p>
            <p className="text-gray-500 text-xs mt-0.5">📍 {job.zone?.name}</p>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Worker</label>
          <select
            value={selectedWorker}
            onChange={(e) => setSelectedWorker(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select worker...</option>
            {workers.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleAssign}
            disabled={!selectedWorker || !selectedJobId || loading}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Assigning...' : 'Assign Worker'}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
