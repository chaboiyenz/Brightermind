import Link from "next/link";
import { Avatar, Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { PsychologistAvailability, PsychologistSummary } from "@/lib/mock/psychologists";

const AVAILABILITY_LABEL: Record<PsychologistAvailability, string> = {
  available: "Available",
  unavailable: "Unavailable",
  unknown: "Availability unknown",
};

const AVAILABILITY_TONE: Record<PsychologistAvailability, "success" | "neutral"> = {
  available: "success",
  unavailable: "neutral",
  unknown: "neutral",
};

// Server component — no interactivity on the card itself (module 11). The
// "message" call-to-action will point at module 13's /messages/[partnerId]
// once that route exists under Phase C; until then it's a plain link so the
// card layout can be reviewed with a CTA in place.
export function PsychologistCard({ psychologist }: { psychologist: PsychologistSummary }) {
  const { name, imageUrl, areaOfExpertise, availability } = psychologist;
  return (
    <Card className="flex flex-col gap-3">
      <CardHeader className="mb-0 items-center">
        <div className="flex items-center gap-3">
          <Avatar name={name} imageUrl={imageUrl} size="lg" />
          <div>
            <CardTitle>{name}</CardTitle>
            <p className="text-sm text-stone-600">{areaOfExpertise}</p>
          </div>
        </div>
        <Badge tone={AVAILABILITY_TONE[availability]}>{AVAILABILITY_LABEL[availability]}</Badge>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between gap-3">
        <p className="text-xs text-stone-600">Registered psychologist</p>
        <Link
          href={`/messages/${psychologist.id}`}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Send a message
        </Link>
      </CardContent>
    </Card>
  );
}
