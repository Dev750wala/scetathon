interface ZoneOverlayProps {
  score: number;
  label: string;
}

export default function ZoneOverlay({ score, label }: ZoneOverlayProps) {
  const color = score >= 70 ? 'bg-green-200' : score >= 40 ? 'bg-amber-200' : 'bg-red-200';
  return (
    <div className={`${color} rounded p-2 text-center text-xs font-medium`}>
      {label}: {score.toFixed(0)}%
    </div>
  );
}
