import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

interface Who5ResultCardProps {
  rawScore: number;
  percentage: number;
}

export function Who5ResultCard({ rawScore, percentage }: Who5ResultCardProps) {
  const isLowerWellBeing = percentage < 50;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your WHO-5 well-being result</CardTitle>
        <Badge tone={isLowerWellBeing ? "warning" : "success"}>
          {isLowerWellBeing ? "Lower well-being range" : "Positive well-being range"}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.08em] text-stone-600">Well-being score</p>
          <p className="mt-1 font-display text-4xl font-semibold text-brand-700">{percentage}%</p>
          <p className="mt-1 text-xs text-stone-600">Raw score: {rawScore} / 25</p>
        </div>
        <p className="text-sm text-stone-700">This short questionnaire is a check-in on your well-being, not a diagnosis. A score below 50% can be a useful prompt to talk with a qualified professional.</p>
      </CardContent>
    </Card>
  );
}
