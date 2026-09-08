import type { ContentBlock } from "@/lib/api";

// Shared between Home and About only (per docs/frontend-migration-plan.md
// module 17) — not part of the generic components/ui design-system library.
export function ContentBlockSection({ block }: { block: ContentBlock }) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-4 text-2xl font-medium text-stone-900">{block.title}</h1>
      <p className="whitespace-pre-line text-stone-700">{block.content}</p>
    </article>
  );
}
