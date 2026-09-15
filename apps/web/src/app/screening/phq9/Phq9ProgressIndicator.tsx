interface Phq9ProgressIndicatorProps {
  step: number;
  total: number;
}

export function Phq9ProgressIndicator({ step, total }: Phq9ProgressIndicatorProps) {
  const progress = ((step + 1) / total) * 100;

  return (
    <div aria-label="PHQ-9 progress" className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-stone-500">
        <span>Question {step + 1}</span>
        <span>{total}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
