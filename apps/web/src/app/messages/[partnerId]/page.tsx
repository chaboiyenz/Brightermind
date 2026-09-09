import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui";
import {
  getMockConversation,
  getMockConversationPartnerName,
} from "@/lib/mock/conversations";
import { MessageStatusControls } from "./MessageStatusControls";
import { MessageThread } from "./MessageThread";

interface ConversationPageProps {
  params: Promise<{ partnerId: string }>;
}

// ConversationPage (docs/frontend-migration-plan.md module 13). Server
// component — resolves the partner and initial message history; per the
// plan's note, this one page/tree serves the student↔psych, psych↔patient,
// and admin↔user contexts alike, varying only by which partner resolves and
// whether MessageStatusControls renders (RoleGate, psychologist-only).
export default async function ConversationPage({ params }: ConversationPageProps) {
  const { partnerId: partnerIdParam } = await params;
  const partnerId = Number(partnerIdParam);

  if (!Number.isInteger(partnerId)) {
    notFound();
  }

  const partnerName = getMockConversationPartnerName(partnerId);
  if (!partnerName) {
    notFound();
  }

  const conversation = getMockConversation(partnerId);

  return (
    <main className="mx-auto flex h-[calc(100vh-2rem)] max-w-2xl flex-col overflow-hidden rounded-lg border border-stone-200 my-4">
      <header className="flex items-center gap-3 border-b border-stone-200 p-4">
        <Avatar name={partnerName} />
        <h1 className="text-base font-medium text-stone-900">{partnerName}</h1>
      </header>

      <MessageStatusControls initialStatus={conversation.requestStatus} />

      <MessageThread partnerName={partnerName} initialMessages={conversation.messages} />
    </main>
  );
}
