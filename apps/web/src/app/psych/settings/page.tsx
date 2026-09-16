import { Avatar, Badge, Card } from "@/components/ui";
import { AvailabilitySwitch } from "@/components/psych/AvailabilitySwitch";
import { SectionCard, WorkspaceHeading, WorkspacePage } from "@/components/psych/WorkspacePage";
import { getMockPsychologists } from "@/lib/mock/psychologists";

// The signed-in psychologist in the prototype (lib/mock/psychologists.ts).
const ME_ID = 1;

const HOURS: readonly { day: string; hours: string }[] = [
  { day: "Monday", hours: "1:00 to 6:00 PM" },
  { day: "Tuesday", hours: "1:00 to 6:00 PM" },
  { day: "Wednesday", hours: "Not available" },
  { day: "Thursday", hours: "1:00 to 6:00 PM" },
  { day: "Friday", hours: "9:00 AM to 12:00 PM" },
];

// Settings (docs/role-based-system-plan.md §3, new): the psychologist's
// public profile as students see it, availability, and weekly hours. Static
// placeholder details (ground rule 3); editing lands with real auth.
export default function PsychSettingsPage() {
  const me = getMockPsychologists().find((p) => p.id === ME_ID) ?? getMockPsychologists()[0];

  return (
    <WorkspacePage>
      <WorkspaceHeading title="Settings" description="How students see you, and when you are taking conversations." />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-6">
          <Card className="flex flex-wrap items-center gap-4">
            <Avatar name={me.name} imageUrl={me.imageUrl} size="lg" />
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-headline-sm text-stone-900">{me.name}</h3>
              <p className="text-sm text-stone-600">{me.areaOfExpertise}</p>
            </div>
            <Badge tone="brand">Registered psychologist</Badge>
          </Card>

          <SectionCard title="Public profile">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-stone-600">Area of expertise</dt>
                <dd className="font-medium text-stone-900">{me.areaOfExpertise}</dd>
              </div>
              <div>
                <dt className="text-stone-600">Languages</dt>
                <dd className="font-medium text-stone-900">Filipino, English</dd>
              </div>
              <div>
                <dt className="text-stone-600">Session formats</dt>
                <dd className="font-medium text-stone-900">Video call, chat</dd>
              </div>
              <div>
                <dt className="text-stone-600">Typical reply time</dt>
                <dd className="font-medium text-stone-900">Within a day</dd>
              </div>
            </dl>
            <p className="text-xs text-stone-600">Editing your profile arrives with real sign-in.</p>
          </SectionCard>
        </div>

        <div className="grid gap-6">
          <SectionCard title="Availability">
            <AvailabilitySwitch />
            <p className="text-xs text-stone-600">
              Shown on the psychologist directory. Turn it off when your caseload is full.
            </p>
          </SectionCard>

          <SectionCard title="Weekly hours">
            <ul className="divide-y divide-stone-200 text-sm">
              {HOURS.map((slot) => (
                <li key={slot.day} className="flex items-center justify-between py-2.5">
                  <span className="text-stone-700">{slot.day}</span>
                  <span className={slot.hours === "Not available" ? "text-stone-600" : "font-medium text-stone-900"}>
                    {slot.hours}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </WorkspacePage>
  );
}
