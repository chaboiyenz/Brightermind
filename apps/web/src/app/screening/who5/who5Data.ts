export type AnswerValue = 0 | 1 | 2 | 3 | 4 | 5;

export interface Who5Question {
  id: string;
  number: number;
  text: string;
}

export const WHO5_QUESTIONS: readonly Who5Question[] = [
  { id: "q1", number: 1, text: "I have felt cheerful and in good spirits." },
  { id: "q2", number: 2, text: "I have felt calm and relaxed." },
  { id: "q3", number: 3, text: "I have felt active and vigorous." },
  { id: "q4", number: 4, text: "I woke up feeling fresh and rested." },
  { id: "q5", number: 5, text: "My daily life has been filled with things that interest me." },
];

export const RESPONSE_OPTIONS: readonly { value: AnswerValue; label: string }[] = [
  { value: 5, label: "All of the time" },
  { value: 4, label: "Most of the time" },
  { value: 3, label: "More than half of the time" },
  { value: 2, label: "Less than half of the time" },
  { value: 1, label: "Some of the time" },
  { value: 0, label: "At no time" },
];

export function calculateScore(answers: Record<string, AnswerValue>) {
  const rawScore = WHO5_QUESTIONS.reduce(
    (total, question) => total + (answers[question.id] ?? 0),
    0,
  );
  return { rawScore, percentage: rawScore * 4 };
}
