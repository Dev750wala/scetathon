'use client';
import dynamic from 'next/dynamic';

const JobList = dynamic(() => import('@/components/jobs/JobList'), { ssr: false });

export default function JobsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Active Jobs</h1>
      <p className="text-gray-500 mb-6">Review and manage all cleaning job cards.</p>
      <JobList />
    </div>
  );
}
