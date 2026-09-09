import { Badge, TableCell, TableRow, severityToTone } from "@/components/ui";
import type { PatientRowData } from "@/lib/mock/adminPatients";
import { ScoreSummaryCell } from "./ScoreSummaryCell";

// Server component (module 15). One table row per patient; severity uses the
// same calm badge tones as the GAD-7 result card (no alarm-red for "severe").
export function PatientRow({ patient }: { patient: PatientRowData }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{patient.name}</TableCell>
      <TableCell>
        <Badge tone={severityToTone(patient.latestSeverity)}>{patient.latestSeverity}</Badge>
      </TableCell>
      <TableCell>
        <ScoreSummaryCell scores={patient.scoreSummary} />
      </TableCell>
    </TableRow>
  );
}
