import Link from "next/link";
import {
  Badge,
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  buttonVariants,
  severityToLabel,
  severityToTone,
} from "@/components/ui";
import type { InboxRow } from "@/lib/mock/inbox";
import { MessageStatusBadge } from "./MessageStatusBadge";

function SeverityCell({ severity }: { severity: InboxRow["severity"] }) {
  if (severity === "unknown") {
    return <Badge tone="neutral">Not screened</Badge>;
  }
  return <Badge tone={severityToTone(severity)}>{severityToLabel(severity)}</Badge>;
}

// Server component (migration plan module 12, now at /psych/inbox per
// docs/role-based-system-plan.md §3): renders whatever rows
// it is handed. Under the prototype those come from getMockInbox(); later,
// from GET /api/v2/psychologists/me/inbox/. Rows now carry the patient's
// partner id, so each one opens the conversation at /messages/[partnerId].
export function InboxTable({ rows }: { rows: readonly InboxRow[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title="Your inbox is empty"
        description="New messages from students will appear here."
      />
    );
  }

  return (
    <Table aria-label="Inbox">
      <TableHead>
        <TableRow>
          <TableHeaderCell>From</TableHeaderCell>
          <TableHeaderCell>Message</TableHeaderCell>
          <TableHeaderCell>Latest screening</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell className="text-right">Waiting</TableHeaderCell>
          <TableHeaderCell>
            <span className="sr-only">Open</span>
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.messageId}>
            <TableCell className="font-medium">{row.senderName}</TableCell>
            <TableCell className="max-w-[28ch] truncate text-stone-700">{row.preview}</TableCell>
            <TableCell>
              <SeverityCell severity={row.severity} />
            </TableCell>
            <TableCell>
              <MessageStatusBadge status={row.status} />
            </TableCell>
            <TableCell className="text-right text-stone-600">{row.waitingLabel}</TableCell>
            <TableCell className="text-right">
              <Link href={`/messages/${row.partnerId}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                Open
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
