'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  data: { date: string; value: number }[];
  title?: string;
  color?: string;
}

export default function TrendChart({ data, title, color = '#16a34a' }: TrendChartProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {title && <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
