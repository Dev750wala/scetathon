'use client';
import dynamic from 'next/dynamic';

const JobAssignModal = dynamic(() => import('@/components/jobs/JobAssignModal'), { ssr: false });

export default function AssignPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Assign Workers</h1>
      <p className="text-gray-500 mb-6">Assign available workers to pending jobs.</p>
      <JobAssignModal />
    </div>
  );
}
