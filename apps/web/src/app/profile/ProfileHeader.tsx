import { Avatar, Badge, Card } from "@/components/ui";
import type { Profile, UserSummary } from "@/lib/mock/profile";

interface ProfileHeaderProps {
  user: UserSummary;
  profile: Profile;
}

// Server component (docs/frontend-migration-plan.md module 2): avatar, name,
// grade. Contact/social fields stay out of the header on purpose — this view
// is about how the student is doing, not a data dump of their profile row.
export function ProfileHeader({ user, profile }: ProfileHeaderProps) {
  return (
    <Card className="flex items-center gap-4">
      <Avatar name={user.name} imageUrl={profile.image} size="lg" />
      <div className="min-w-0">
        <h1 className="truncate text-lg font-medium text-stone-900">{user.name}</h1>
        <p className="text-sm text-stone-600">@{user.username}</p>
      </div>
      {profile.grade && (
        <Badge tone="brand" className="ml-auto shrink-0">
          {profile.grade}
        </Badge>
      )}
    </Card>
  );
}
