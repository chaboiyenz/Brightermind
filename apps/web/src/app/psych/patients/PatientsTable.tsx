"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Avatar,
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  buttonVariants,
  cn,
} from "@/components/ui";
import { MoodBars } from "@/components/psych/MoodBars";
import { NotScreenedBadge, SeverityBadge } from "@/components/psych/SeverityBadge";
import { latestScreening, type PatientRecord } from "@/lib/mock/patients";
import {
  MOCK_TODAY,
  formatSessionTime,
  type CounsellingSession,
} from "@/lib/mock/sessions";

type Filter = "all" | "attention" | "active" | "new";

const FILTERS: readonly { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "attention", label: "Needs attention" },
  { key: "active", label: "Active this week" },
  { key: "new", label: "New" },
];

const ACTIVE_LABELS = new Set(["Today", "Yesterday", "2 days ago", "3 days ago"]);

function matches(patient: PatientRecord, filter: Filter): boolean {
  switch (filter) {
    case "all":
      return true;
    case "attention":
      return Boolean(patient.needsAttention);
    case "active":
      return ACTIVE_LABELS.has(patient.lastActiveLabel);
    case "new":
      return patient.since === "September 2026";
  }
}

const SHORT_DATE = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Manila" });

function nextSessionLabel(patientId: number, sessions: readonly CounsellingSession[]): string | null {
  const next = sessions.find((session) => session.patientId === patientId);
  if (!next) return null;
  const day = next.startsAt.startsWith(MOCK_TODAY) ? "Today" : SHORT_DATE.format(new Date(next.startsAt));
  return `${day}, ${formatSessionTime(next.startsAt)}`;
}

export function PatientsTable({
  patients,
  upcomingSessions,
}: {
  patients: readonly PatientRecord[];
  upcomingSessions: readonly CounsellingSession[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = patients.filter((patient) => matches(patient, filter));

  return (
    <div className="grid gap-4">
      <div role="group" aria-label="Filter patients" className="flex flex-wrap gap-2">
        {FILTERS.map((option) => {
          const count = patients.filter((patient) => matches(patient, option.key)).length;
          const selected = option.key === filter;
          return (
            <button
              key={option.key}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(option.key)}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full border px-3.5 font-display text-label-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300",
                selected
                  ? "border-brand-300 bg-brand-300/20 text-stone-900"
                  : "border-stone-200 bg-stone-25 text-stone-800 hover:border-brand-300"
              )}
            >
              {option.label}
              <span className="text-stone-600">{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No patients match" description="Try another filter." />
      ) : (
        <Table aria-label="Patients">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Patient</TableHeaderCell>
              <TableHeaderCell>Latest screening</TableHeaderCell>
              <TableHeaderCell>Mood, 7 days</TableHeaderCell>
              <TableHeaderCell>Last active</TableHeaderCell>
              <TableHeaderCell>Next session</TableHeaderCell>
              <TableHeaderCell>
                <span className="sr-only">Actions</span>
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((patient) => {
              const latest = latestScreening(patient);
              const next = nextSessionLabel(patient.id, upcomingSessions);
              return (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={patient.name} size="sm" />
                      <div className="leading-tight">
                        <Link
                          href={`/psych/patients/${patient.id}`}
                          className="font-medium text-stone-900 hover:text-brand-700"
                        >
                          {patient.name}
                        </Link>
                        <p className="text-xs text-stone-600">{patient.yearLevel}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {latest ? (
                      <SeverityBadge severity={latest.severity} instrument={latest.instrument} />
                    ) : (
                      <NotScreenedBadge />
                    )}
                  </TableCell>
                  <TableCell>
                    <MoodBars values={patient.moodLast7} />
                  </TableCell>
                  <TableCell>{patient.lastActiveLabel}</TableCell>
                  <TableCell className={next ? undefined : "text-stone-600"}>{next ?? "Not scheduled"}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Link href={`/messages/${patient.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        Message
                      </Link>
                      <Link href={`/psych/patients/${patient.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                        Open
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      <p className="text-sm text-stone-600">
        Showing {visible.length} of {patients.length} patients
      </p>
    </div>
  );
}
