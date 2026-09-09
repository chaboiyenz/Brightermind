import { EXAMPLE_MOOD_MONTH, MOOD_LEVELS } from "./homeContent";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"] as const;

// Example calendar, flagged as such in the header. Mood colors are literal
// (see MOOD_LEVELS) so the swatches match across themes and the real /mood page.
export function MoodCalendarPreview() {
  return (
    <div
      aria-label="Example mood calendar"
      className="grid gap-4 rounded-2xl border border-stone-200 bg-stone-25 p-6 shadow-soft"
    >
      <div className="flex items-center justify-between text-sm text-stone-600">
        <strong className="font-display text-[15px] font-semibold text-stone-900">September · mood</strong>
        <span>Example week, not real data</span>
      </div>
      <div className="grid grid-cols-7 gap-2" role="presentation">
        {WEEKDAYS.map((day, index) => (
          <span key={`${day}-${index}`} className="text-center text-[11.5px] tracking-[0.04em] text-stone-600">
            {day}
          </span>
        ))}
        {EXAMPLE_MOOD_MONTH.map((value, index) => {
          const level = value === null ? null : MOOD_LEVELS.find((mood) => mood.value === value);
          return (
            <span
              key={index}
              className={
                level
                  ? "grid aspect-square place-items-center rounded-full text-xs font-medium tabular-nums"
                  : "grid aspect-square place-items-center rounded-full bg-stone-100 text-xs tabular-nums text-stone-600"
              }
              style={level ? { backgroundColor: level.color, color: level.ink } : undefined}
            >
              {index + 1}
            </span>
          );
        })}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[12.5px] text-stone-600">
        {MOOD_LEVELS.map((level) => (
          <li key={level.value} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: level.color }} />
            {level.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
