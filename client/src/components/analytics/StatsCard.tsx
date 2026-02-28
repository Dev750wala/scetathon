interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: number;
  className?: string;
}

export default function StatsCard({ label, value, icon, trend, className }: StatsCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className || ''}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-xl">{icon}</span>}
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {trend !== undefined && (
        <p className={`text-xs mt-1 ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last period
        </p>
      )}
    </div>
  );
}
