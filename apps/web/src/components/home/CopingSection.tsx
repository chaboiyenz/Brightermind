import Link from "next/link";
import { cn } from "@/components/ui";
import { COPING_CATEGORIES, type CopingCategory } from "./homeContent";
import { CONTAINER_CLASS, SECTION_CLASS, SectionHeading, TONE_CHIP_CLASSES } from "./SectionHeading";

export function CopingSection() {
  return (
    <section
      id="coping"
      aria-labelledby="coping-heading"
      className={cn(SECTION_CLASS, "bg-stone-100")}
    >
      <div className={CONTAINER_CLASS}>
        <SectionHeading
          id="coping-heading"
          eyebrow="Coping techniques"
          title="Four ways to cope, so you can pick the one that fits today"
          lede="Not every hard day needs the same tool. Some days call for doing, some for feeling, some for meaning, and some for other people. Every technique is tagged by the kind of help it gives."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COPING_CATEGORIES.map((category) => (
            <li key={category.kind}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Also used by the /coping hub page, so the library reads the same in both places.
export function CategoryCard({ category }: { category: CopingCategory }) {
  const Icon = category.icon;
  return (
    <article className="grid h-full content-start gap-4 rounded-2xl border border-stone-200 bg-stone-25 p-6">
      <span
        aria-hidden="true"
        className={cn("grid h-10 w-10 place-items-center rounded-md", TONE_CHIP_CLASSES[category.tone])}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-label-sm uppercase text-stone-600">{category.kind}</p>
        <h3 className="mt-1 font-display text-[22px] font-medium leading-tight text-stone-900">
          {category.title}
        </h3>
      </div>
      <p className="text-[14.5px] leading-relaxed text-stone-700">{category.when}</p>
      <ul className="grid gap-2 border-t border-stone-200 pt-3.5">
        {category.techniques.map((technique) => (
          <li key={technique.name} className="flex items-center justify-between gap-2.5 text-[14.5px]">
            <Link href={technique.href} className="text-stone-800 hover:text-brand-700 hover:underline underline-offset-4">
              {technique.name}
            </Link>
            <span
              className={cn(
                "rounded-sm px-1.5 py-0.5 font-display text-[10.5px] font-semibold uppercase tracking-[0.06em]",
                technique.available && technique.format === "Game"
                  ? "bg-sage-100 text-sage-600"
                  : "bg-stone-100 text-stone-600"
              )}
            >
              {technique.format}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
