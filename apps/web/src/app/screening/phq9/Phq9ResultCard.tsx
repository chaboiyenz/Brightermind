import Link from "next/link";
import {
  Badge,
  buttonVariants,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  severityToLabel,
  severityToTone,
} from "@/components/ui";
import type { Severity } from "./phq9Data";

const SEVERITY_COPY: Record<Severity, string> = {
  minimal: "Your answers suggest minimal depressive symptoms right now.",
  mild: "Your answers suggest mild depressive symptoms.",
  moderate: "Your answers suggest moderate depressive symptoms.",
  "moderately-severe": "Your answers suggest moderately severe depressive symptoms.",
  severe: "Your answers suggest a higher level of depressive symptoms.",
};

interface Phq9ResultCardProps {
  totalScore: number;
  severity: Severity;
}

export function Phq9ResultCard({ totalScore, severity }: Phq9ResultCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your result</CardTitle>
        <Badge tone={severityToTone(severity)}>{severityToLabel(severity)}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p>{SEVERITY_COPY[severity]}</p>
        <p className="text-xs text-stone-600">Score: {totalScore} / 27</p>
        <p>
          This is a screening tool, not a diagnosis. If you&apos;d like to talk to
          someone, you can browse psychologists or reach out to a hotline for immediate support.
        </p>
        {severity === "severe" || severity === "moderately-severe" ? (
          <div className="flex flex-col gap-2 rounded-md border border-brand-100 bg-brand-50 p-3">
            <p className="text-sm text-stone-800">
              A higher score can be a sign that extra support may help. You can browse
              the psychologist directory or reach out for guidance when you&apos;re ready.
            </p>
            <Link
              href="/psychologists"
              className={buttonVariants({ variant: "primary", size: "sm" })}
            >
              Browse psychologists
            </Link>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
