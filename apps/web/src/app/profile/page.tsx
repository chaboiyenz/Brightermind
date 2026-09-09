import { getMockProfile } from "@/lib/mock/profile";
import { MoodSnapshot } from "./MoodSnapshot";
import { ProfileHeader } from "./ProfileHeader";
import { ScoreSummaryPanel } from "./ScoreSummaryPanel";

// ProfilePage (docs/frontend-migration-plan.md module 2, REDESIGN). Server
// component fed by the mock fixture; swapping getMockProfile for the real
// profile + scores fetch is the only change needed later. The raw point
// total is intentionally never rendered here (see ScoreSummaryPanel).
// /profile/edit (EditProfileForm) is not part of this prototype slice.
export default function ProfilePage() {
  const today = new Date();
  const { user, profile, scores, recentMoods } = getMockProfile(today);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <ProfileHeader user={user} profile={profile} />
      <ScoreSummaryPanel scores={scores} />
      <MoodSnapshot recentMoods={recentMoods} today={today.toISOString().slice(0, 10)} />
    </main>
  );
}
