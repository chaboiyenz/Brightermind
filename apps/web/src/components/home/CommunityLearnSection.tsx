import Link from "next/link";
import { cn } from "@/components/ui";
import { COMMUNITY_ROOMS, LEARN_HREF, LEARN_TOPICS } from "./homeContent";
import { CONTAINER_CLASS, Eyebrow, SECTION_CLASS } from "./SectionHeading";

const H2_CLASS =
  "mt-3.5 font-display text-[30px] font-semibold leading-[1.12] tracking-[-0.01em] text-stone-900 sm:text-headline-lg";
const LEDE_CLASS = "mt-4 max-w-[58ch] text-lg leading-[1.65] text-stone-700";

export function CommunityLearnSection() {
  return (
    <section id="community" aria-labelledby="community-heading" className={SECTION_CLASS}>
      <div className={cn(CONTAINER_CLASS, "grid items-start gap-12 lg:grid-cols-2 lg:gap-16")}>
        <div>
          <Eyebrow>Community</Eyebrow>
          <h2 id="community-heading" className={H2_CLASS}>
            You are not the only one awake at 2 a.m.
          </h2>
          <p className={LEDE_CLASS}>
            Moderated rooms where students cope together. Post, reply and upvote under a
            handle, not your name. Psychologists keep an eye on the rooms and step in gently
            when someone needs more.
          </p>
          <ul className="mt-6 grid gap-2.5">
            {COMMUNITY_ROOMS.map((room) => (
              <li key={room.name}>
                <Link
                  href="/community"
                  className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-stone-200 bg-stone-25 px-4 py-3.5 transition-colors hover:border-brand-300"
                >
                  <span>
                    <span className="block text-[15px] font-semibold text-stone-900">{room.name}</span>
                    <span className="block text-[13.5px] text-stone-600">{room.description}</span>
                  </span>
                  <span className="whitespace-nowrap text-[13px] text-stone-600">Open room</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div id="learn">
          <Eyebrow>Learn</Eyebrow>
          <h2 className={H2_CLASS}>Understand what you are feeling</h2>
          <p className={LEDE_CLASS}>
            Short, plain-language explainers reviewed by psychologists. What it is, what it is
            not, and what tends to help.
          </p>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {LEARN_TOPICS.map((topic) => (
              <li key={topic.title} className={topic.wide ? "sm:col-span-2" : undefined}>
                <Link
                  href={LEARN_HREF}
                  className="grid gap-1 rounded-lg border border-stone-200 bg-stone-25 px-4 py-4 transition-colors hover:border-brand-300"
                >
                  <span className="text-[15px] font-semibold text-stone-900">{topic.title}</span>
                  <span className="text-[13.5px] text-stone-700">{topic.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
