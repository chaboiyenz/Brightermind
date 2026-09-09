import type { Severity } from "@/app/screening/gad7/gad7Data";

// Prototype pivot (.references/roadmap/prototype-roadmap.MD) — static data,
// no call to GET /api/v2/psychologists/me/inbox/. Shape is
// docs/frontend-migration-plan.md module 12's InboxRow, unchanged. Sender
// names are invented placeholders (ground rule 3).

export type InboxStatus = "pending" | "read" | "accepted" | "rejected";

export interface InboxRow {
  messageId: number;
  senderName: string;
  severity: Severity | "unknown";
  status: InboxStatus;
}

const MOCK_INBOX: readonly InboxRow[] = [
  { messageId: 101, senderName: "Bea Castillo", severity: "moderate", status: "pending" },
  { messageId: 102, senderName: "Carlo Navarro", severity: "severe", status: "pending" },
  { messageId: 103, senderName: "Dana Lim", severity: "mild", status: "read" },
  { messageId: 104, senderName: "Eli Fernandez", severity: "minimal", status: "accepted" },
  { messageId: 105, senderName: "Faye Ocampo", severity: "unknown", status: "read" },
  { messageId: 106, senderName: "Gio Ramos", severity: "moderate", status: "rejected" },
];

/**
 * Single swap point for the real fetch later (ground rule 5) — replace with
 * GET /api/v2/psychologists/me/inbox/.
 */
export function getMockInbox(): readonly InboxRow[] {
  return MOCK_INBOX;
}
