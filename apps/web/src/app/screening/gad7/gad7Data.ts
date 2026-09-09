// Prototype pivot (.references/roadmap/prototype-roadmap.MD) — static data,
// no backend call. Content note per ground rule 3: this is the standard,
// widely-used GAD-7 instrument text (Spitzer et al., 2006) — not invented
// placeholder copy, since the GAD-7 name specifies exactly which questions
// this screening tool asks. Flagging anyway per the doc's own rule: confirm
// licensing/attribution and appropriateness for the general (non-CvSU,
// non-anxiety-only) scope before this goes anywhere near a real user —
// that's a sign-off question, not a content-authoring one.

export type AnswerValue = 0 | 1 | 2 | 3;

export interface Gad7Question {
  id: string;
  text: string;
}

export const GAD7_QUESTIONS: Gad7Question[] = [
  { id: "q1", text: "Feeling nervous, anxious, or on edge" },
  { id: "q2", text: "Not being able to stop or control worrying" },
  { id: "q3", text: "Worrying too much about different things" },
  { id: "q4", text: "Trouble relaxing" },
  { id: "q5", text: "Being so restless that it's hard to sit still" },
  { id: "q6", text: "Becoming easily annoyed or irritable" },
  { id: "q7", text: "Feeling afraid, as if something awful might happen" },
];

export const RESPONSE_OPTIONS: { value: AnswerValue; label: string }[] = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

export type Severity = "minimal" | "mild" | "moderate" | "severe";

// Standard GAD-7 bands, matching docs/audit-findings.md's note on the
// severity ladder (≤4 minimal, ≤9 mild, ≤14 moderate, >14 severe) — the one
// place this rule should live, per docs/frontend-migration-plan.md module 4's
// note on the client/server scoring duplication that must NOT recur here.
export function scoreToSeverity(totalScore: number): Severity {
  if (totalScore <= 4) return "minimal";
  if (totalScore <= 9) return "mild";
  if (totalScore <= 14) return "moderate";
  return "severe";
}

export function sumAnswers(answers: Record<string, AnswerValue>): number {
  return GAD7_QUESTIONS.reduce((total, question) => total + (answers[question.id] ?? 0), 0);
}
