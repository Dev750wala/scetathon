'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Zone } from '@/types';
import { REPORT_CATEGORIES } from '@/lib/constants';
import VoiceRecorder from './VoiceRecorder';
import PhotoUpload from './PhotoUpload';

interface ReportFormProps {
  defaultZoneId?: string;
}

export default function ReportForm({ defaultZoneId }: ReportFormProps) {
  const router = useRouter();
  const [zones, setZones] = useState<Zone[]>([]);
  const [form, setForm] = useState({ title: '', description: '', category: 'OTHER', zoneId: defaultZoneId || '' });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/zones').then((res) => setZones(res.data.data || []));
  }, []);

  const handleVoiceTranscript = (text: string) => {
    setForm((f) => ({ ...f, description: (f.description + ' ' + text).trim() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.zoneId) { setError('Please select a zone'); return; }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (image) formData.append('image', image);

    try {
      const res = await api.post('/reports', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.merged) {
        setSuccess('Your report matched an existing one and has been merged. Thank you!');
      } else {
        setSuccess('Report submitted successfully! We\'ll take action soon.');
      }
      setTimeout(() => router.push('/dashboard/student/history'), 2000);
    } catch {
      setError('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-3xl mb-3">✅</p>
        <p className="font-semibold text-green-800">{success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Zone selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Campus Zone *</label>
        <select
          value={form.zoneId}
          onChange={(e) => setForm((f) => ({ ...f, zoneId: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        >
          <option value="">Select zone...</option>
          {zones.map((z) => <option key={z.id} value={z.id}>{z.name} — {z.building}</option>)}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g. Overflowing dustbin near entrance"
          required
          minLength={5}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {REPORT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* Description with voice */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          rows={3}
          placeholder="Describe the issue in detail..."
          required
          minLength={10}
        />
        <VoiceRecorder onTranscript={handleVoiceTranscript} />
      </div>

      {/* Photo upload */}
      <PhotoUpload onFileSelect={setImage} />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
}
