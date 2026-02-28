'use client';
import dynamic from 'next/dynamic';

const CampusMap = dynamic(() => import('@/components/heatmap/CampusMap'), { ssr: false });

export default function HeatmapPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Campus Digital Twin Heatmap</h1>
      <p className="text-gray-500 mb-6">Real-time cleanliness scores for all campus zones. Colors indicate status: green = clean, amber = attention needed, red = critical.</p>
      <CampusMap />
    </div>
  );
}
