'use client';
import dynamic from 'next/dynamic';

const ReportForm = dynamic(() => import('@/components/reports/ReportForm'), { ssr: false });

export default function ReportPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Report an Issue</h1>
      <p className="text-gray-500 mb-6">Use text, voice, or photo to report a sanitation issue on campus.</p>
      <ReportForm />
    </div>
  );
}
