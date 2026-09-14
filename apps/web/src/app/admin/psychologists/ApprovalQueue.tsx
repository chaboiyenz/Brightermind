"use client";

import { useState } from "react";
import { EmptyState, Table, TableBody, TableHead, TableHeaderCell, TableRow } from "@/components/ui";
import type { PendingPsychologist } from "@/lib/mock/pendingPsychologists";
import { ApprovalRow, type ApprovalDecision } from "./ApprovalRow";

// Client component holding the queue's decisions. Local state only — see
// ApprovalRow's docblock; nothing here is persisted or sent to an API.
export function ApprovalQueue({ pending }: { pending: readonly PendingPsychologist[] }) {
  const [decisions, setDecisions] = useState<Record<number, ApprovalDecision>>({});

  const remaining = pending.filter((psychologist) => !decisions[psychologist.id]);

  if (pending.length === 0) {
    return (
      <EmptyState
        title="No pending applications"
        description="New psychologist applications will appear here for review."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {remaining.length === 0 && (
        <p className="text-sm text-stone-600">
          All applications reviewed. Reloading the page resets these decisions (mock data only).
        </p>
      )}
      <Table aria-label="Pending psychologist applications">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Area of expertise</TableHeaderCell>
            <TableHeaderCell>License number</TableHeaderCell>
            <TableHeaderCell>Qualification</TableHeaderCell>
            <TableHeaderCell>Experience</TableHeaderCell>
            <TableHeaderCell>Decision</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pending.map((psychologist) => (
            <ApprovalRow
              key={psychologist.id}
              psychologist={psychologist}
              decision={decisions[psychologist.id] ?? null}
              onDecide={(id, decision) =>
                setDecisions((prev) => ({ ...prev, [id]: decision }))
              }
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
