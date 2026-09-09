import { Badge, Card, CardContent, CardHeader, CardTitle, severityToTone } from "@/components/ui";
import type { Severity } from "./gad7Data";

const SEVERITY_COPY: Record<Severity, string> = {
  minimal: "Your answers suggest minimal anxiety symptoms right now.",
  mild: "Your answers suggest mild anxiety symptoms.",
  moderate: "Your answers suggest moderate anxiety symptoms.",
  severe: "Your answers suggest a higher level of anxiety symptoms.",
};

interface Gad7ResultCardProps {
  totalScore: number;
  severity: Severity;
}

export function Gad7ResultCard({ totalScore, severity }: Gad7ResultCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your result</CardTitle>
        {/* Calm, non-alarming tone even at "severe" — never red/alarm styling,
            per the REDESIGN note. severityToTone already encodes this. */}
        <Badge tone={severityToTone(severity)}>{severity}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p>{SEVERITY_COPY[severity]}</p>
        <p className="text-xs text-stone-600">Score: {totalScore} / 21</p>
        <p>
          This is a screening tool, not a diagnosis. If you&apos;d like to talk
          to someone, the hotline directory and psychologist directory are a
          good next step.
        </p>
      </CardContent>
    </Card>
  );
}
