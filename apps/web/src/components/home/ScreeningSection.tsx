import Link from "next/link";
import { cn } from "@/components/ui";
import { Gad7Preview } from "./Gad7Preview";
import { SCREENING_TOOLS, type ScreeningTool } from "./homeContent";
import { CONTAINER_CLASS, SECTION_CLASS, SectionHeading } from "./SectionHeading";

export function ScreeningSection() {
  return (
    <section id="screening" aria-labelledby="screening-heading" className={SECTION_CLASS}>
      <div className={CONTAINER_CLASS}>
        <SectionHeading
          id="screening-heading"
          eyebrow="Start where you are"
          title="Short, validated check-ins that name what you are feeling"
          lede="Each one takes a few minutes and shows a plain-language indicator, never a label. Your result stays with you, and you choose whether to share it with a psychologist."
        />
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <ul className="grid gap-2.5">
            {SCREENING_TOOLS.map((tool) => (
              <li key={tool.code}>
                <ToolRow tool={tool} />
              </li>
            ))}
          </ul>
          <Gad7Preview />
        </div>
      </div>
    </section>
  );
}

function ToolRow({ tool }: { tool: ScreeningTool }) {
  const planned = tool.status === "planned";
  return (
    <Link
      href={tool.href}
      className={cn(
        "grid grid-cols-[64px_1fr] items-center gap-4 rounded-lg border border-stone-200 bg-stone-25 px-4 py-4 transition-[border-color,box-shadow,transform] duration-200 ease-gentle hover:border-brand-300 hover:shadow-soft motion-safe:hover:-translate-y-0.5 sm:grid-cols-[64px_1fr_auto]",
        planned && "opacity-80"
      )}
    >
      <span className="font-display text-[17px] font-semibold tracking-tight text-brand-700">{tool.code}</span>
      <span>
        <span className="block text-[15.5px] font-medium text-stone-900">{tool.name}</span>
        <span className="block text-[13.5px] text-stone-600">{tool.meta}</span>
      </span>
      <span className="col-start-2 flex items-center gap-2 whitespace-nowrap text-[13px] tabular-nums text-stone-600 sm:col-start-3">
        ~{tool.minutes} min
        <span
          className={cn(
            "rounded-sm px-2 py-0.5 font-display text-label-sm uppercase",
            planned ? "bg-stone-100 text-stone-600" : "bg-sage-100 text-sage-600"
          )}
        >
          {planned ? "2.0" : "Available"}
        </span>
      </span>
    </Link>
  );
}
