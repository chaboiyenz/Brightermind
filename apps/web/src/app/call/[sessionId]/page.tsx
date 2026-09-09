import { notFound } from "next/navigation";
import { getMockCallSession } from "@/lib/mock/callSessions";
import { CallRoom } from "./CallRoom";

interface VideoCallPageProps {
  params: Promise<{ sessionId: string }>;
}

// VideoCallPage (docs/frontend-migration-plan.md module 14). Server
// component — in the real implementation this validates session ownership
// and requests a meeting token server-side (POST /api/v2/video-rooms/);
// fully blocked on Ticket 4 per the plan, so here it only resolves which
// mock session/partner this shell is chrome for.
export default async function VideoCallPage({ params }: VideoCallPageProps) {
  const { sessionId } = await params;
  const session = getMockCallSession(sessionId);

  if (!session) {
    notFound();
  }

  return (
    <main className="theme-dark mx-auto my-4 flex h-[calc(100vh-2rem)] max-w-2xl flex-col overflow-hidden rounded-lg border border-stone-200 bg-stone-50 text-stone-900">
      <CallRoom partnerName={session.partnerName} />
    </main>
  );
}
