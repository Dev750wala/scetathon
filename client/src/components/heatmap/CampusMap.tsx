'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ZoneScore } from '@/types';
import { getScoreColor, getZoneStatusLabel } from '@/lib/utils';
import ZoneDetail from './ZoneDetail';

export default function CampusMap() {
  const [scores, setScores] = useState<ZoneScore[]>([]);
  const [selectedZone, setSelectedZone] = useState<ZoneScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/zones/scores').then((res) => {
      setScores(res.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" /></div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* SVG Map placeholder */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
          <p className="text-xs text-gray-400 text-center mb-2">Campus Map — SCET</p>
          <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
            {/* Campus boundary */}
            <rect x="10" y="10" width="780" height="480" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />

            {/* Block A */}
            <g onClick={() => setSelectedZone(scores.find(s => s.name.includes('Block A') || s.name.includes('Cafeteria')) || null)} className="cursor-pointer">
              <rect x="50" y="50" width="160" height="120" rx="4" fill={getScoreColor(getZoneScore(scores, 'Block A'))} fillOpacity="0.7" stroke="#fff" strokeWidth="2" />
              <text x="130" y="105" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Block A</text>
              <text x="130" y="120" textAnchor="middle" fill="#fff" fontSize="10">{getZoneScore(scores, 'Block A').toFixed(0)}%</text>
            </g>

            {/* Block B */}
            <g onClick={() => setSelectedZone(scores.find(s => s.name.includes('Block B')) || null)} className="cursor-pointer">
              <rect x="300" y="50" width="160" height="120" rx="4" fill={getScoreColor(getZoneScore(scores, 'Block B'))} fillOpacity="0.7" stroke="#fff" strokeWidth="2" />
              <text x="380" y="105" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Block B</text>
              <text x="380" y="120" textAnchor="middle" fill="#fff" fontSize="10">{getZoneScore(scores, 'Block B').toFixed(0)}%</text>
            </g>

            {/* Block C */}
            <g onClick={() => setSelectedZone(scores.find(s => s.name.includes('Block C')) || null)} className="cursor-pointer">
              <rect x="550" y="50" width="160" height="120" rx="4" fill={getScoreColor(getZoneScore(scores, 'Block C'))} fillOpacity="0.7" stroke="#fff" strokeWidth="2" />
              <text x="630" y="105" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Block C</text>
              <text x="630" y="120" textAnchor="middle" fill="#fff" fontSize="10">{getZoneScore(scores, 'Block C').toFixed(0)}%</text>
            </g>

            {/* Canteen */}
            <g onClick={() => setSelectedZone(scores.find(s => s.name.toLowerCase().includes('cafeteria') || s.name.toLowerCase().includes('canteen')) || null)} className="cursor-pointer">
              <rect x="50" y="250" width="220" height="100" rx="4" fill={getScoreColor(getZoneScore(scores, 'Canteen'))} fillOpacity="0.7" stroke="#fff" strokeWidth="2" />
              <text x="160" y="296" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Canteen</text>
              <text x="160" y="311" textAnchor="middle" fill="#fff" fontSize="10">{getZoneScore(scores, 'Canteen').toFixed(0)}%</text>
            </g>

            {/* Ground */}
            <g onClick={() => setSelectedZone(scores.find(s => s.name.toLowerCase().includes('ground')) || null)} className="cursor-pointer">
              <rect x="350" y="280" width="350" height="160" rx="4" fill={getScoreColor(getZoneScore(scores, 'Ground'))} fillOpacity="0.7" stroke="#fff" strokeWidth="2" />
              <text x="525" y="358" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Sports Ground</text>
              <text x="525" y="373" textAnchor="middle" fill="#fff" fontSize="10">{getZoneScore(scores, 'Ground').toFixed(0)}%</text>
            </g>

            {/* Legend */}
            <g transform="translate(50, 420)">
              <circle cx="8" cy="8" r="6" fill="#22c55e" />
              <text x="20" y="12" fontSize="10" fill="#666">Clean (≥70)</text>
              <circle cx="100" cy="8" r="6" fill="#f59e0b" />
              <text x="112" y="12" fontSize="10" fill="#666">Attention (40-70)</text>
              <circle cx="230" cy="8" r="6" fill="#ef4444" />
              <text x="242" y="12" fontSize="10" fill="#666">Critical (&lt;40)</text>
            </g>
          </svg>
        </div>
        <p className="text-xs text-gray-400 text-center">Click on a zone to see details</p>
      </div>

      {/* Zone list */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">All Zones</h3>
        {scores.map((zone) => (
          <button
            key={zone.zoneId}
            onClick={() => setSelectedZone(zone)}
            className="w-full text-left bg-white rounded-xl border border-gray-200 p-3 hover:border-green-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 truncate">{zone.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-bold" style={{ color: getScoreColor(zone.score) }}>
                  {zone.score.toFixed(0)}%
                </span>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getScoreColor(zone.score) }} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">{getZoneStatusLabel(zone.status)}</p>
          </button>
        ))}
      </div>

      {/* Zone detail modal */}
      {selectedZone && (
        <ZoneDetail zone={selectedZone} onClose={() => setSelectedZone(null)} />
      )}
    </div>
  );
}

function getZoneScore(scores: ZoneScore[], keyword: string): number {
  const zone = scores.find(s => s.name.toLowerCase().includes(keyword.toLowerCase()));
  return zone?.score ?? 75;
}
