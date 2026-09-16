import type { Severity } from "@/app/screening/gad7/gad7Data";

// Prototype pivot (.references/roadmap/prototype-roadmap.MD) — static data,
// no call to GET /api/v2/psychologists/me/inbox/. Shape is
// docs/frontend-migration-plan.md module 12's InboxRow, unchanged. Sender
// names are invented placeholders (ground rule 3).

export type InboxStatus = "pending" | "read" | "accepted" | "rejected";

export interface InboxRow {
  messageId: number;
  /** Patient id (lib/mock/patients.ts) — the /messages/[partnerId] target. */
  partnerId: number;
  senderName: string;
  preview: string;
  waitingLabel: string;
  severity: Severity | "unknown";
  status: InboxStatus;
}

const MOCK_INBOX: readonly InboxRow[] = [
  { messageId: 101, partnerId: 202, senderName: "Carlo Navarro", preview: "Could we move Thursday earlier?", waitingLabel: "6 h", severity: "severe", status: "pending" },
  { messageId: 102, partnerId: 203, senderName: "Dana Lim", preview: "The breathing exercise helped a lot this week.", waitingLabel: "3 h", severity: "mild", status: "pending" },
  { messageId: 103, partnerId: 201, senderName: "Bea Castillo", preview: "Sending my journal note before our call.", waitingLabel: "1 h", severity: "mild", status: "pending" },
  { messageId: 104, partnerId: 204, senderName: "Eli Fernandez", preview: "Thanks for the welcome message.", waitingLabel: "Yesterday", severity: "minimal", status: "accepted" },
  { messageId: 105, partnerId: 205, senderName: "Faye Ocampo", preview: "I might skip this week, feeling okay.", waitingLabel: "2 days", severity: "unknown", status: "read" },
  { messageId: 106, partnerId: 206, senderName: "Gio Ramos", preview: "Is the yoga routine okay with a sore back?", waitingLabel: "3 days", severity: "moderate", status: "rejected" },
];

/**
 * Single swap point for the real fetch later (ground rule 5) — replace with
 * GET /api/v2/psychologists/me/inbox/.
 */
export function getMockInbox(): readonly InboxRow[] {
  return MOCK_INBOX;
}
