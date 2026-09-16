import { MOOD_LEVELS } from "@/components/home/homeContent";
import type { MoodPoint } from "@/lib/mock/patients";

const DAY_LABELS = ["7 days ago", "6 days ago", "5 days ago", "4 days ago", "3 days ago", "2 days ago", "yesterday"];

// Seven-day mood strip for the patients table and patient detail. Bar height
// follows the 1–5 mood value; colour is the shared mood swatch (literal on
// purpose, see MOOD_LEVELS) so it reads the same as the patient's tracker.
// Missing days render as a short stone stub rather than nothing, so the
// strip always shows seven slots.
export function MoodBars({ values, className }: { values: readonly MoodPoint[]; className?: string }) {
  const summary = values
    .map((value, index) => {
      const level = value === null ? null : MOOD_LEVELS.find((entry) => entry.value === value);
      return `${DAY_LABELS[index] ?? `day ${index + 1}`}: ${level ? level.label : "no entry"}`;
    })
    .join(", ");

  return (
    <div className={className} role="img" aria-label={`Mood over the last 7 days. ${summary}`}>
      <div className="flex h-[22px] items-end gap-[3px]">
        {values.map((value, index) => {
          const level = value === null ? null : MOOD_LEVELS.find((entry) => entry.value === value);
          const height = level ? 6 + level.value * 3.2 : 5;
          return (
            <span
              key={index}
              aria-hidden="true"
              className="w-1.5 rounded-[2px]"
              style={{
                height,
                backgroundColor: level ? level.color : "rgb(var(--stone-200))",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
