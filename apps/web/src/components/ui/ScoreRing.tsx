export interface ScoreRingProps {
  value: number; // 0-100
  label: string;
  size?: number;
  className?: string;
}

/**
 * Circular progress ring. Used on the Profile page's ScoreSummaryPanel (one
 * ring per module) and reused as-is by the mini-games module — see migration
 * plan modules 2 and 8. Deliberately uses brand teal, not a leaderboard-style
 * bright color scale, per the profile page's REDESIGN notes ("shouldn't feel
 * like a game leaderboard").
 */
export function ScoreRing({ value, label, size = 72, className }: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const stroke = size * 0.09;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className={className} style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label}: ${clamped}%`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E4E1D9" // stone-200
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2F6F62" // brand-600
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-stone-900 text-sm font-medium"
        >
          {clamped}
        </text>
      </svg>
      <p className="mt-1 text-center text-xs text-stone-600">{label}</p>
    </div>
  );
}
