import { ZoneScore } from '@/types';
import { getScoreColor, getZoneStatusLabel } from '@/lib/utils';

interface ZoneDetailProps {
  zone: ZoneScore;
  onClose: () => void;
}

export default function ZoneDetail({ zone, onClose }: ZoneDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-bold text-gray-900">{zone.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="text-center py-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold" style={{ backgroundColor: getScoreColor(zone.score) }}>
            {zone.score.toFixed(0)}
          </div>
          <p className="font-semibold text-gray-900">{getZoneStatusLabel(zone.status)}</p>
          <p className="text-xs text-gray-400 mt-1">Cleanliness Score</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          <p>Status: <span className="font-medium">{zone.status}</span></p>
          <p className="mt-1">Last updated: <span className="font-medium">{new Date(zone.lastUpdated).toLocaleTimeString()}</span></p>
        </div>
      </div>
    </div>
  );
}
