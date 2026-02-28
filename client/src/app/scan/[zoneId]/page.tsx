'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Zone } from '@/types';
import { getScoreTextColor } from '@/lib/utils';
import dynamic from 'next/dynamic';

const ReportForm = dynamic(() => import('@/components/reports/ReportForm'), { ssr: false });

export default function ScanPage() {
  const params = useParams();
  const zoneId = params.zoneId as string;
  const [zone, setZone] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (zoneId) {
      api.get(`/zones/${zoneId}`).then((res) => setZone(res.data.data)).finally(() => setLoading(false));
    }
  }, [zoneId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-xl mx-auto">
      {zone ? (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{zone.name}</h1>
                <p className="text-gray-500 text-sm mt-0.5">{zone.building} {zone.floor && `· ${zone.floor}`}</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${getScoreTextColor(zone.liveScore ?? zone.currentScore)}`}>
                  {Math.round(zone.liveScore ?? zone.currentScore)}
                </p>
                <p className="text-xs text-gray-400">Cleanliness Score</p>
              </div>
            </div>
            <span className="mt-2 inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{zone.type}</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report an Issue Here</h2>
          <ReportForm defaultZoneId={zoneId} />
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">❓</p>
          <p className="text-gray-500">Zone not found. Please scan a valid QR code.</p>
        </div>
      )}
    </div>
  );
}
