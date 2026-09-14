import { GAD7_QUESTIONS, RESPONSE_OPTIONS, type Severity } from "@/app/screening/gad7/gad7Data";
import { cn } from "@/components/ui";
import { Eyebrow } from "./SectionHeading";

// Static preview of the real instrument (question text and options are
// imported from the screening page's data, so this can never drift from it).
// Shows question 4 with "Several days" pre-selected as an illustration.
const PREVIEW_QUESTION_INDEX = 3;
const PREVIEW_ANSWER = 1;

interface Band {
  readonly range: string;
  readonly label: string;
  readonly severity: Severity;
}

// Standard GAD-7 bands; must agree with scoreToSeverity() in gad7Data.ts.
const BANDS: readonly Band[] = [
  { range: "0 – 4", label: "Minimal", severity: "minimal" },
  { range: "5 – 9", label: "Mild", severity: "mild" },
  { range: "10 – 14", label: "Moderate", severity: "moderate" },
  { range: "15 – 21", label: "Severe", severity: "severe" },
];

// Muted tones on purpose; even "severe" is terracotta, not alarm red.
const BAND_CLASSES: Record<Severity, string> = {
  minimal: "bg-sage-100 text-sage-600",
  mild: "bg-brand-100 text-brand-700",
  moderate: "bg-clay-100 text-clay-600",
  severe: "bg-brick-100 text-brick-600",
};

export function Gad7Preview() {
  const question = GAD7_QUESTIONS[PREVIEW_QUESTION_INDEX];

  return (
    <div
      aria-label="GAD-7 preview"
      className="grid gap-5 rounded-2xl border border-stone-200 bg-stone-25 p-6 shadow-soft sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1.5">
          <Eyebrow>GAD-7 · Question {PREVIEW_QUESTION_INDEX + 1} of {GAD7_QUESTIONS.length}</Eyebrow>
          <h3 className="font-display text-headline-sm text-stone-900">
            Over the last two weeks, how often have you been bothered by…
          </h3>
        </div>
        <span className="rounded-sm bg-sage-100 px-2 py-0.5 font-display text-label-sm uppercase text-sage-600">
          Preview
        </span>
      </div>

      <div className="grid gap-3">
        <p className="text-[16.5px] font-medium text-stone-900">{question.text}</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="presentation">
          {RESPONSE_OPTIONS.map((option) => (
            <li
              key={option.value}
              className={cn(
                "rounded-md border px-2 py-2.5 text-center text-[13px]",
                option.value === PREVIEW_ANSWER
                  ? "border-brand-300 bg-brand-300/20 font-semibold text-stone-900"
                  : "border-stone-200 text-stone-700"
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
        <p className="text-[13.5px] text-stone-600">
          Spitzer et al., 2006. Scored 0 to 3 per question, 0 to 21 in total.
        </p>
      </div>

      <div className="grid gap-2.5">
        <div className="flex justify-between text-[13px] text-stone-600">
          <span>How your total is described</span>
          <span className="tabular-nums">0 – 21</span>
        </div>
        <ul className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          {BANDS.map((band) => (
            <li
              key={band.severity}
              className={cn("grid gap-0.5 rounded-md px-2.5 pb-2 pt-2.5 text-[12.5px] tabular-nums", BAND_CLASSES[band.severity])}
            >
              <b className="text-[13px] font-semibold">{band.range}</b>
              <span>{band.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="border-t border-stone-200 pt-3.5 text-[13.5px] leading-relaxed text-stone-600">
        A score is an indicator, not a diagnosis. Any result in the top two bands shows a
        gentle path to a registered psychologist and to crisis lines.
      </p>
    </div>
  );
}
