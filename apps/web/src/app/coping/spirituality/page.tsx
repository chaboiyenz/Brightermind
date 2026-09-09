import { SpiritualityContentCard } from "./SpiritualityContentCard";
import { SPIRITUALITY_CONTENT } from "./spiritualityData";

// SpiritualityFeedPage (docs/frontend-migration-plan.md module 9). v1's
// staff-only add/delete branch does NOT carry over — this student-facing
// page has zero admin UI in it, per the migration plan's explicit note;
// content editing (once real) becomes a separate admin-gated route.
export default function SpiritualityPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-lg font-medium text-stone-900">Reflections</h1>
      <div className="flex flex-col gap-8">
        {SPIRITUALITY_CONTENT.map((content) => (
          <SpiritualityContentCard key={content.id} content={content} />
        ))}
      </div>
    </main>
  );
}
