'use client';

interface StarPointsDisplayProps {
  points: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarPointsDisplay({
  points,
  label = 'Star Points',
  size = 'md',
}: StarPointsDisplayProps) {
  const sizes = {
    sm: 'text-sm px-2 py-0.5',
    md: 'text-base px-3 py-1',
    lg: 'text-xl px-4 py-2',
  };

  return (
    <div
      className={`inline-flex items-center gap-1 bg-yellow-100 border border-yellow-400 rounded-full font-bold text-yellow-800 ${sizes[size]}`}
    >
      <span>⭐</span>
      <span>{points.toLocaleString()}</span>
      {label && <span className="text-yellow-600 font-normal">{label}</span>}
    </div>
  );
}
