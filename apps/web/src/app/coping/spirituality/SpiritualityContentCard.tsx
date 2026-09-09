import type { SpiritualityContent } from "./spiritualityData";

// Calm single-column read, deliberately not a card grid — per the REDESIGN
// note this is reflective content, not a scannable list of items.
export function SpiritualityContentCard({ content }: { content: SpiritualityContent }) {
  return (
    <article className="border-b border-stone-200 pb-8 last:border-b-0">
      <h2 className="mb-2 text-base font-medium text-stone-900">{content.title}</h2>
      <p className="leading-relaxed text-stone-700">{content.content}</p>
    </article>
  );
}
