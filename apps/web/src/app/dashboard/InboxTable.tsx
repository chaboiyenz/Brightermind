import {
  Badge,
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  severityToTone,
} from "@/components/ui";
import type { InboxRow } from "@/lib/mock/inbox";
import { MessageStatusBadge } from "./MessageStatusBadge";

function SeverityCell({ severity }: { severity: InboxRow["severity"] }) {
  if (severity === "unknown") {
    return <Badge tone="neutral">Not screened</Badge>;
  }
  return <Badge tone={severityToTone(severity)}>{severity}</Badge>;
}

// Server component (module 12): renders whatever rows it is handed. Under the
// prototype those come from getMockInbox(); later, from
// GET /api/v2/psychologists/me/inbox/. No per-row "open" CTA yet: module 13's
// route is /messages/[partnerId], and module 12's InboxRow carries a messageId
// but no sender/partner id, so there is nothing correct to link to until that
// interface gains one (flagged in the Phase B PR).
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
          <TableHeaderCell>Latest screening</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.messageId}>
            <TableCell className="font-medium">{row.senderName}</TableCell>
            <TableCell>
              <SeverityCell severity={row.severity} />
            </TableCell>
            <TableCell>
              <MessageStatusBadge status={row.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
