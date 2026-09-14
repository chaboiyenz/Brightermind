import { CategoryCard } from "@/components/home/CopingSection";
import { GamesSection } from "@/components/home/GamesSection";
import { COPING_CATEGORIES } from "@/components/home/homeContent";
import { CONTAINER_CLASS, Eyebrow } from "@/components/home/SectionHeading";

// Coping library hub at /coping. Previously this URL had no page at all, so
// any link that trimmed the technique slug ended in a 404. Organised by the
// four-way taxonomy that structures the whole library, then the mini-games.
export default function CopingHubPage() {
  return (
    <main>
      <section className={`${CONTAINER_CLASS} pb-8 pt-12 sm:pt-16`}>
        <Eyebrow>Coping techniques</Eyebrow>
        <h1 className="mt-4 font-display text-display-sm font-semibold text-stone-900 sm:text-display">
          Pick the kind of help today calls for
        </h1>
        <p className="mt-4 max-w-[58ch] text-lg leading-[1.65] text-stone-700">
          Some days call for doing, some for feeling, some for meaning, and some for other
          people. Every technique below is tagged by the kind of help it gives.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COPING_CATEGORIES.map((category) => (
            <li key={category.kind}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </section>
      <GamesSection />
    </main>
  );
}
