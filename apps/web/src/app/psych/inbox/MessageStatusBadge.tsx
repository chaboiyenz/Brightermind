import { Badge, type BadgeProps } from "@/components/ui";
import type { InboxStatus } from "@/lib/mock/inbox";

const STATUS_TONE: Record<InboxStatus, NonNullable<BadgeProps["tone"]>> = {
  pending: "warning",
  read: "neutral",
  accepted: "success",
  rejected: "neutral",
};

const STATUS_LABEL: Record<InboxStatus, string> = {
  pending: "Pending",
  read: "Read",
  accepted: "Accepted",
  rejected: "Declined",
};

// Server component (module 12). "Declined" rather than "Rejected" in the UI
// copy — same status value, calmer wording for a mental-health context.
export function MessageStatusBadge({ status }: { status: InboxStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>;
}
