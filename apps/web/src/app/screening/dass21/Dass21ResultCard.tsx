import Link from "next/link";
import { Badge, buttonVariants, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { scoreToSeverity, type Dass21Scale, type Dass21Severity } from "./dass21Data";

const SCALE_LABELS: Record<Dass21Scale, string> = {
  depression: "Depression",
  anxiety: "Anxiety",
  stress: "Stress",
};

const SCALE_ORDER: readonly Dass21Scale[] = ["depression", "anxiety", "stress"];

interface Dass21ResultCardProps {
  scores: Record<Dass21Scale, number>;
}

function severityTone(severity: Dass21Severity) {
  if (severity === "normal") return "success" as const;
  if (severity === "mild") return "brand" as const;
  if (severity === "moderate") return "warning" as const;
  return "danger" as const;
}

export function Dass21ResultCard({ scores }: Dass21ResultCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your DASS-21 result</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-stone-600">Your scores are doubled as recommended for the DASS-21. This screening tool is not a diagnosis.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {SCALE_ORDER.map((scale) => {
            const severity = scoreToSeverity(scale, scores[scale]);
            return (
              <div key={scale} className="rounded-md border border-stone-200 p-3">
                <p className="text-sm font-medium text-stone-900">{SCALE_LABELS[scale]}</p>
                <p className="mt-1 text-2xl font-semibold text-brand-700">{scores[scale]}</p>
                <Badge tone={severityTone(severity)}>{severity}</Badge>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-stone-700">Consider discussing these results with a qualified professional if they are worrying you or affecting daily life.</p>
        <Link href="/psychologists" className={buttonVariants({ variant: "primary", size: "sm" })}>
          Browse psychologists
        </Link>
      </CardContent>
    </Card>
  );
}
