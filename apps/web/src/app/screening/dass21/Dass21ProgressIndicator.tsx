interface Dass21ProgressIndicatorProps {
  step: number;
  total: number;
}

export function Dass21ProgressIndicator({ step, total }: Dass21ProgressIndicatorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs text-stone-600">Question {step + 1} of {total}</p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
