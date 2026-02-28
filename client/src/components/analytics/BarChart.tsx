'use client';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: { label: string; value: number }[];
  title?: string;
  color?: string;
}

export default function BarChart({ data, title, color = '#16a34a' }: BarChartProps) {
  const chartData = data.map((d) => ({ name: d.label, value: d.value }));
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {title && <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={200}>
        <RechartsBarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
