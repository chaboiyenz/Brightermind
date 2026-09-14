"use client";

import { useState } from "react";
import { Badge, Button, TableCell, TableRow } from "@/components/ui";
import type { PendingPsychologist } from "@/lib/mock/pendingPsychologists";

export type ApprovalDecision = "approved" | "rejected";

interface ApprovalRowProps {
  psychologist: PendingPsychologist;
  decision: ApprovalDecision | null;
  onDecide: (id: number, decision: ApprovalDecision) => void;
}

const DECISION_LABEL: Record<ApprovalDecision, string> = {
  approved: "Approved",
  rejected: "Rejected",
};

const DECISION_TONE: Record<ApprovalDecision, "success" | "danger"> = {
  approved: "success",
  rejected: "danger",
};

// Client component (module 11: ApprovalRow) — approve/reject need local,
// optimistic state. This is UI state only, nothing persists: reloading the
// page resets every decision. No API call is made (mocked prototype).
export function ApprovalRow({ psychologist, decision, onDecide }: ApprovalRowProps) {
  const [isPending, setIsPending] = useState<ApprovalDecision | null>(null);

  function handleDecide(next: ApprovalDecision) {
    setIsPending(next);
    // No real request to await — the "pending" state is only here to make
    // the interaction feel real; resolve on the next tick.
    setTimeout(() => {
      onDecide(psychologist.id, next);
      setIsPending(null);
    }, 150);
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{psychologist.name}</TableCell>
      <TableCell>{psychologist.areaOfExpertise}</TableCell>
      <TableCell>{psychologist.licenseNumber}</TableCell>
      <TableCell>{psychologist.qualification}</TableCell>
      <TableCell>{psychologist.yearsOfExperience} yrs</TableCell>
      <TableCell>
        {decision ? (
          <Badge tone={DECISION_TONE[decision]}>{DECISION_LABEL[decision]}</Badge>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="primary"
              isLoading={isPending === "approved"}
              onClick={() => handleDecide("approved")}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="danger"
              isLoading={isPending === "rejected"}
              onClick={() => handleDecide("rejected")}
            >
              Reject
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
