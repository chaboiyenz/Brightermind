"use client";

import { useState } from "react";
import { Badge, Button, RoleGate, type BadgeProps } from "@/components/ui";
import type { ConversationRequestStatus } from "@/lib/mock/conversations";

const STATUS_TONE: Record<ConversationRequestStatus, NonNullable<BadgeProps["tone"]>> = {
  pending: "warning",
  accepted: "success",
  rejected: "neutral",
};

const STATUS_LABEL: Record<ConversationRequestStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Declined",
};

// Client component (module 13), psychologist-only per the migration plan —
// mirrors InboxRow's accept/reject/pending workflow from module 12, but at
// the conversation level. Local state only: no PATCH to
// /api/v2/messages/:id/status/ yet (ground rule 1).
export function MessageStatusControls({
  initialStatus,
}: {
  initialStatus: ConversationRequestStatus;
}) {
  const [status, setStatus] = useState(initialStatus);

  return (
    <RoleGate allow={["psychologist"]}>
      <div className="flex items-center gap-2 border-b border-stone-200 bg-stone-50 px-4 py-2">
        <span className="text-xs font-medium text-stone-600">Request status:</span>
        <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={status === "accepted"}
            onClick={() => setStatus("accepted")}
          >
            Accept
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={status === "rejected"}
            onClick={() => setStatus("rejected")}
          >
            Decline
          </Button>
        </div>
      </div>
    </RoleGate>
  );
}
