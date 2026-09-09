import { Card, CardContent, CardHeader, CardTitle, ScoreRing } from "@/components/ui";
import {
  MODULE_SCORE_KEYS,
  MODULE_SCORE_LABELS,
  scoreToPercent,
  type ModuleScores,
} from "@/lib/mock/scores";

type ModuleKey = (typeof MODULE_SCORE_KEYS)[number];
type Trend = "strong" | "building" | "starting";

const TREND_LABEL: Record<Trend, string> = {
  strong: "Going strong",
  building: "Building momentum",
  starting: "Just getting started",
};

const TREND_ORDER: readonly Trend[] = ["strong", "building", "starting"];

// Thresholds on the 0-100 ring scale. Display banding only: this is not the
// score aggregation the migration plan says must live on the backend.
const STRONG_FROM = 67;
const BUILDING_FROM = 34;

function trendFor(percent: number): Trend {
  if (percent >= STRONG_FROM) return "strong";
  if (percent >= BUILDING_FROM) return "building";
  return "starting";
}

function groupByTrend(scores: ModuleScores): Record<Trend, ModuleKey[]> {
  return MODULE_SCORE_KEYS.reduce<Record<Trend, ModuleKey[]>>(
    (groups, key) => {
      const trend = trendFor(scoreToPercent(scores[key]));
      return { ...groups, [trend]: [...groups[trend], key] };
    },
    { strong: [], building: [], starting: [] }
  );
}

function listLabels(keys: ModuleKey[]): string {
  const labels = keys.map((key) => MODULE_SCORE_LABELS[key]);
  if (labels.length <= 1) return labels.join("");
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

function headline(groups: Record<Trend, ModuleKey[]>): string {
  if (groups.strong.length > 0) {
    return `You've been most consistent with ${listLabels(groups.strong)}.`;
  }
  if (groups.building.length > 0) {
    return `You're building momentum across ${listLabels(groups.building)}.`;
  }
  return "Every module is a fresh start right now, and that's a fine place to begin.";
}

function nextStep(groups: Record<Trend, ModuleKey[]>): string | null {
  if (groups.starting.length === 0) return null;
  return `${listLabels(groups.starting)} ${groups.starting.length === 1 ? "is" : "are"} a gentle place to explore next.`;
}

interface ScoreSummaryPanelProps {
  scores: ModuleScores;
}

// Server component (module 2, REDESIGN): one ScoreRing per module in muted
// brand teal instead of a flat "Total Score: N", and trend language instead
// of raw point totals. The raw total is deliberately not shown.
export function ScoreSummaryPanel({ scores }: ScoreSummaryPanelProps) {
  const groups = groupByTrend(scores);
  const next = nextStep(groups);

  return (
    <Card>
      <CardHeader className="flex-col items-start gap-1">
        <CardTitle>How you&apos;re doing</CardTitle>
        <p className="text-sm text-stone-600">{headline(groups)}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-7" aria-label="Progress by module">
          {MODULE_SCORE_KEYS.map((key) => (
            <li key={key} className="flex justify-center">
              <ScoreRing value={scoreToPercent(scores[key])} label={MODULE_SCORE_LABELS[key]} />
            </li>
          ))}
        </ul>

        <dl className="flex flex-col gap-1.5 text-sm">
          {TREND_ORDER.filter((trend) => groups[trend].length > 0).map((trend) => (
            <div key={trend} className="flex flex-wrap gap-x-2">
              <dt className="font-medium text-stone-800">{TREND_LABEL[trend]}:</dt>
              <dd className="text-stone-600">{listLabels(groups[trend])}</dd>
            </div>
          ))}
        </dl>

        {next && <p className="text-sm text-stone-600">{next}</p>}
      </CardContent>
    </Card>
  );
}
