import { Badge, severityToTone } from "@/components/ui";
import { SEVERITY_LABELS, type ScreeningInstrument, type ScreeningSeverity } from "@/lib/mock/patients";

// Screening result chip for the workspace. Severity never renders in
// brick/red: severityToTone caps at "warning" on purpose (calm language even
// at higher bands, with the next step shown elsewhere), per DESIGN.md.
export function SeverityBadge({
  severity,
  instrument,
  score,
}: {
  severity: ScreeningSeverity;
  instrument?: ScreeningInstrument;
  score?: number;
}) {
  const parts = [instrument, SEVERITY_LABELS[severity], score !== undefined ? String(score) : null].filter(Boolean);
  return <Badge tone={severityToTone(severity)}>{parts.join(" · ")}</Badge>;
}

export function NotScreenedBadge() {
  return <Badge tone="neutral">Not yet screened</Badge>;
}
