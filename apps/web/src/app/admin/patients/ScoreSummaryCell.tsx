import { ScoreRing } from "@/components/ui";
import { MODULE_SCORE_KEYS, MODULE_SCORE_LABELS, type ModuleScores } from "@/lib/mock/scores";

// Per-module maximum used to normalise raw points to the 0-100 ScoreRing
// scale. Placeholder for the prototype: the real ceiling belongs to module
// 2's /scores/ endpoint contract, not the frontend.
const MODULE_SCORE_MAX = 25;

function toPercent(value: number): number {
  return Math.round((Math.max(0, Math.min(MODULE_SCORE_MAX, value)) / MODULE_SCORE_MAX) * 100);
}

// Server component (module 15) — reuses module 2's ModuleScores shape and the
// shared ScoreRing, so the admin view and the future /profile page present
// scores the same way. Compact rings so a row stays scannable.
export function ScoreSummaryCell({ scores }: { scores: ModuleScores }) {
  return (
    <div className="flex items-start gap-2">
      {MODULE_SCORE_KEYS.map((key) => (
        <ScoreRing key={key} value={toPercent(scores[key])} label={MODULE_SCORE_LABELS[key]} size={40} />
      ))}
      <div className="ml-2 self-center text-xs text-stone-600">
        <span className="block font-medium text-stone-800">{scores.total}</span>
        total
      </div>
    </div>
  );
}
