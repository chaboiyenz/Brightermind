import { RestrictedPageNotice } from "@/components/RestrictedPageNotice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  RoleGate,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui";
import type { Severity } from "@/app/screening/gad7/gad7Data";
import { getMockAnalytics } from "@/lib/mock/adminAnalytics";
import { SeverityDistributionChart } from "./SeverityDistributionChart";

const SEVERITY_ORDER: readonly Severity[] = ["minimal", "mild", "moderate", "severe"];

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <Card className="flex flex-col gap-1">
      <p className="text-xs uppercase tracking-wide text-stone-600">{label}</p>
      <p className="text-2xl font-medium text-stone-900">{value}</p>
    </Card>
  );
}

// AdminAnalyticsPage (docs/frontend-migration-plan.md module 15). Server
// component behind RoleGate for "admin"; numbers from the mock fixture. The
// table below the chart is the plain-numbers view of the same data, so
// nothing depends on reading the chart.
export default function AdminAnalyticsPage() {
  const summary = getMockAnalytics();
  const screened = SEVERITY_ORDER.reduce((sum, key) => sum + summary.severityCounts[key], 0);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <RoleGate allow={["admin"]} fallback={<RestrictedPageNotice allow={["admin"]} />}>
        <header className="mb-6">
          <h1 className="text-lg font-medium text-stone-900">Analytics</h1>
          <p className="mt-1 text-sm text-stone-600">
            A snapshot of how students are doing across the platform.
          </p>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
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
      </RoleGate>
    </main>
  );
}
