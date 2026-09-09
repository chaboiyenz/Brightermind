import { cn } from "@/components/ui";
import { TRUST_FACTS } from "./homeContent";
import { CONTAINER_CLASS } from "./SectionHeading";

export function TrustStrip() {
  return (
    <section aria-label="Trust and evidence" className="border-y border-stone-200 bg-stone-100">
      <ul className={cn(CONTAINER_CLASS, "grid gap-6 py-9 sm:grid-cols-2 lg:grid-cols-4")}>
        {TRUST_FACTS.map((fact) => (
          <li key={fact.figure}>
            <p className="font-display text-[30px] font-medium leading-[1.1] tracking-[-0.02em] tabular-nums text-brand-700">
              {fact.figure}
            </p>
            <p className="mt-1.5 max-w-[28ch] text-sm text-stone-700">{fact.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
