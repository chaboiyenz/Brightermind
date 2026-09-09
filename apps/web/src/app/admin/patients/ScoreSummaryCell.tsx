import { ScoreRing } from "@/components/ui";
import {
  MODULE_SCORE_KEYS,
  MODULE_SCORE_LABELS,
  scoreToPercent,
  type ModuleScores,
} from "@/lib/mock/scores";

// Server component (module 15) — reuses module 2's ModuleScores shape and the
// shared ScoreRing, so the admin view and the future /profile page present
// scores the same way. Compact rings so a row stays scannable.
export function ScoreSummaryCell({ scores }: { scores: ModuleScores }) {
  return (
    <div className="flex items-start gap-2">
      {MODULE_SCORE_KEYS.map((key) => (
        <ScoreRing key={key} value={scoreToPercent(scores[key])} label={MODULE_SCORE_LABELS[key]} size={40} />
      ))}
      <div className="ml-2 self-center text-xs text-stone-600">
        <span className="block font-medium text-stone-800">{scores.total}</span>
        total
      </div>
    </div>
  );
}
