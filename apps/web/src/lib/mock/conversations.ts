import { getMockPsychologists } from "./psychologists";

// Prototype pivot (.references/roadmap/prototype-roadmap.MD) — static data,
// no call to GET /api/v2/conversations/:partnerId/messages/. Shape is
// docs/frontend-migration-plan.md module 13's Message, unchanged. Content is
// invented placeholder conversation text for design review only (ground
// rule 3) — none of this is a real exchange.

export const CURRENT_USER_ID = 0;

export type MessageDeliveryStatus = "pending" | "read";
export type ConversationRequestStatus = "pending" | "accepted" | "rejected";

export interface Message {
  id: number;
  senderId: number; // CURRENT_USER_ID ("you"), or the partner's psychologist id
  content: string;
  timestamp: string;
  status: MessageDeliveryStatus;
}

export interface Conversation {
  partnerId: number;
  requestStatus: ConversationRequestStatus;
  messages: readonly Message[];
}

// Only partnerId 1 has a seeded conversation, so the default "message a
// psychologist" link (PsychologistCard → /messages/1) lands on the
// in-progress state design was reviewed against. Every other valid partner
// id resolves to a real, empty conversation — that's how the empty state
// stays reachable without a special-cased route.
const MOCK_CONVERSATIONS: Record<number, Conversation> = {
  1: {
    partnerId: 1,
    requestStatus: "accepted",
    messages: [
      {
        id: 1,
        senderId: CURRENT_USER_ID,
        content:
          "Hi Dr. Villanueva, I wanted to follow up on last week's check-in.",
        timestamp: "2026-09-08T09:12:00Z",
        status: "read",
      },
      {
        id: 2,
        senderId: 1,
        content: "Of course — thanks for reaching out. How has your week been?",
        timestamp: "2026-09-08T09:20:00Z",
        status: "read",
      },
      {
        id: 3,
        senderId: CURRENT_USER_ID,
        content:
          "A bit better, actually. The breathing exercises helped before exams.",
        timestamp: "2026-09-08T09:24:00Z",
        status: "read",
      },
      {
        id: 4,
        senderId: 1,
        content:
          "That's great to hear. Let's keep building on that in our next session.",
        timestamp: "2026-09-08T09:31:00Z",
        status: "read",
      },
      {
        id: 5,
        senderId: CURRENT_USER_ID,
        content: "Sounds good — same time next week?",
        timestamp: "2026-09-08T09:33:00Z",
        status: "pending",
      },
    ],
  },
};

/**
 * Single swap point for the real fetch later (ground rule 5) — replace the
 * body with GET /api/v2/conversations/:partnerId/messages/. Returns a real,
 * empty conversation (not undefined) for any partner without seeded
 * messages, so the empty state renders the same way a genuinely new
 * conversation would.
 */
export function getMockConversation(partnerId: number): Conversation {
  return (
    MOCK_CONVERSATIONS[partnerId] ?? {
      partnerId,
      requestStatus: "pending",
      messages: [],
    }
  );
}

export function getMockConversationPartnerName(partnerId: number): string | null {
  return getMockPsychologists().find((p) => p.id === partnerId)?.name ?? null;
}
