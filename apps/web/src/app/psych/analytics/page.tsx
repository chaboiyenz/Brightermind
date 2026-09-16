import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui";
import type { Severity } from "@/app/screening/gad7/gad7Data";
import { StatTile, WorkspaceHeading, WorkspacePage } from "@/components/psych/WorkspacePage";
import { getMockAnalytics } from "@/lib/mock/adminAnalytics";
import { SeverityDistributionChart } from "./SeverityDistributionChart";

const SEVERITY_ORDER: readonly Severity[] = ["minimal", "mild", "moderate", "severe"];

// Analytics (docs/frontend-migration-plan.md module 15; moved from
// /admin/analytics into the psychologist workspace per
// docs/role-based-system-plan.md §3). Numbers from the mock
// fixture; the table below the chart is the plain-numbers view of the same
// data, so nothing depends on reading the chart.
export default function PsychAnalyticsPage() {
  const summary = getMockAnalytics();
  const screened = SEVERITY_ORDER.reduce((sum, key) => sum + summary.severityCounts[key], 0);

  return (
    <WorkspacePage>
      <WorkspaceHeading title="Analytics" description="A snapshot of how students are doing across the platform." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Students" value={summary.totalUsers} />
        <StatTile label="Staff" value={summary.totalStaff} />
        <StatTile label="Screened" value={screened} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Screening severity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <SeverityDistributionChart severityCounts={summary.severityCounts} />
          <Table aria-label="Screening severity counts">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Severity</TableHeaderCell>
                <TableHeaderCell className="text-right">Students</TableHeaderCell>
                <TableHeaderCell className="text-right">Share</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {SEVERITY_ORDER.map((key) => {
                const count = summary.severityCounts[key];
                const share = screened === 0 ? 0 : Math.round((count / screened) * 100);
                return (
                  <TableRow key={key}>
                    <TableCell className="capitalize">{key}</TableCell>
                    <TableCell className="text-right">{count}</TableCell>
                    <TableCell className="text-right">{share}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </WorkspacePage>
  );
}
