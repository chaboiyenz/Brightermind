export type AnswerValue = 0 | 1 | 2 | 3;

export interface Phq9Question {
  id: string;
  text: string;
}

export const PHQ9_QUESTIONS: Phq9Question[] = [
  { id: "q1", text: "Little interest or pleasure in doing things" },
  { id: "q2", text: "Feeling down, depressed, or hopeless" },
  { id: "q3", text: "Trouble falling or staying asleep, or sleeping too much" },
  { id: "q4", text: "Feeling tired or having little energy" },
  { id: "q5", text: "Poor appetite or overeating" },
  {
    id: "q6",
    text: "Feeling bad about yourself, or that you are a failure, or have let yourself or your family down",
  },
  {
    id: "q7",
    text: "Trouble concentrating on things, such as reading the newspaper or watching television",
  },
  {
    id: "q8",
    text: "Moving or speaking so slowly that other people could have noticed, or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  },
  {
    id: "q9",
    text: "Thoughts that you would be better off dead or of hurting yourself in some way",
  },
];

export const RESPONSE_OPTIONS: { value: AnswerValue; label: string }[] = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

export type Severity = "minimal" | "mild" | "moderate" | "moderately-severe" | "severe";

export function scoreToSeverity(totalScore: number): Severity {
  if (totalScore <= 4) return "minimal";
  if (totalScore <= 9) return "mild";
  if (totalScore <= 14) return "moderate";
  if (totalScore <= 19) return "moderately-severe";
  return "severe";
}

export function sumAnswers(answers: Record<string, AnswerValue>): number {
  return PHQ9_QUESTIONS.reduce((total, question) => total + (answers[question.id] ?? 0), 0);
}
