import { cn } from "@/components/ui";
import { TRACK_ITEMS } from "./homeContent";
import { MoodCalendarPreview } from "./MoodCalendarPreview";
import { CONTAINER_CLASS, Eyebrow, SECTION_CLASS, TONE_CHIP_CLASSES } from "./SectionHeading";

export function TrackSection() {
  return (
    <section
      id="track"
      aria-labelledby="track-heading"
      className={cn(SECTION_CLASS, "bg-stone-100")}
    >
      <div className={cn(CONTAINER_CLASS, "grid items-center gap-10 lg:grid-cols-2 lg:gap-16")}>
        <MoodCalendarPreview />
        <div>
          <Eyebrow>Mood tracker &amp; journal</Eyebrow>
          <h2
            id="track-heading"
            className="mt-3.5 font-display text-[30px] font-semibold leading-[1.12] tracking-[-0.01em] text-stone-900 sm:text-headline-lg lg:text-[40px] lg:leading-[1.1]"
          >
            See the week, not just the worst hour of it
          </h2>
          <p className="mt-4 max-w-[58ch] text-lg leading-[1.65] text-stone-700">
            One tap a day builds a calendar you can look back on. Patterns show up in colour
            before they show up in words, and the journal is there when the words come.
          </p>
          <ul className="mt-7 grid gap-5">
            {TRACK_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="grid grid-cols-[40px_1fr] items-start gap-3.5 py-1">
                  <span
                    aria-hidden="true"
                    className={cn("grid h-10 w-10 place-items-center rounded-md", TONE_CHIP_CLASSES[item.tone])}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-stone-900">{item.title}</p>
                    <p className="text-[15px] text-stone-700">{item.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
