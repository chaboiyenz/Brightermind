import Link from "next/link";
import {
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  buttonVariants,
} from "@/components/ui";
import { SeverityBadge } from "@/components/psych/SeverityBadge";
import { WorkspaceHeading, WorkspacePage } from "@/components/psych/WorkspacePage";
import { getMockRecentScreenings } from "@/lib/mock/patients";

const LONG_DATE = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" });

// Screenings (docs/role-based-system-plan.md §3, new): every result across
// the caseload, newest first, so a rising score is visible without opening
// each patient. Server component over the patients fixture.
export default function PsychScreeningsPage() {
  const results = getMockRecentScreenings();

  return (
    <WorkspacePage>
      <WorkspaceHeading
        title="Screenings"
        description="Every GAD-7, PHQ-9, DASS-21 and WHO-5 result across your patients, newest first."
      />

      {results.length === 0 ? (
        <EmptyState title="No screenings yet" description="Results appear here as soon as a patient completes one." />
      ) : (
        <Table aria-label="Screening results">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Patient</TableHeaderCell>
              <TableHeaderCell>Instrument</TableHeaderCell>
              <TableHeaderCell>Result</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>
                <span className="sr-only">Open</span>
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => (
              <TableRow key={`${result.patient.id}-${result.instrument}-${result.date}`}>
                <TableCell className="font-medium">{result.patient.name}</TableCell>
                <TableCell>{result.instrument}</TableCell>
                <TableCell>
                  <SeverityBadge severity={result.severity} score={result.score} />
                </TableCell>
                <TableCell className="text-stone-600">{LONG_DATE.format(new Date(result.date))}</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/psych/patients/${result.patient.id}`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    Open patient
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </WorkspacePage>
  );
}
