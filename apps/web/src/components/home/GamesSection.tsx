import Link from "next/link";
import { GAME_SLUGS, GAME_TITLES, type GameSlug } from "@/app/coping/[game]/gameData";
import { cn } from "@/components/ui";
import { GameArt } from "./GameArt";
import { GAME_HIGHLIGHTS } from "./homeContent";
import { CONTAINER_CLASS, SECTION_CLASS, SectionHeading } from "./SectionHeading";

export function GamesSection() {
  return (
    <section id="games" aria-labelledby="games-heading" className={SECTION_CLASS}>
      <div className={CONTAINER_CLASS}>
        <SectionHeading
          id="games-heading"
          eyebrow="Mini-games"
          title="Two quiet minutes that teach a skill while they distract"
          lede="Each game practises one technique from the library. Scores count toward your coping progress, which you can choose to share with your psychologist."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GAME_SLUGS.map((slug) => (
            <li key={slug}>
              <GameCard slug={slug} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function GameCard({ slug }: { slug: GameSlug }) {
  const game = GAME_HIGHLIGHTS[slug];
  const available = game.status === "available";
  return (
    <Link
      href={`/coping/${slug}`}
      className="grid h-full grid-rows-[150px_auto] overflow-hidden rounded-2xl border border-stone-200 bg-stone-25 transition-[border-color,box-shadow,transform] duration-200 ease-gentle hover:border-brand-300 hover:shadow-soft motion-safe:hover:-translate-y-0.5"
    >
      <div aria-hidden="true" className="grid place-items-center border-b border-stone-200 bg-stone-100">
        <GameArt slug={slug} />
      </div>
      <div className="grid content-start gap-2 px-5 pb-5 pt-4">
        <span
          className={cn(
            "mb-1 justify-self-start rounded-sm px-2 py-0.5 font-display text-label-sm uppercase",
            available ? "bg-sage-100 text-sage-600" : "bg-stone-100 text-stone-600"
          )}
        >
          {available ? "Available" : "In design"}
        </span>
        <h3 className="font-display text-[19px] font-medium text-stone-900">{GAME_TITLES[slug]}</h3>
        <p className="text-sm leading-relaxed text-stone-700">{game.description}</p>
      </div>
    </Link>
  );
}
