export type AnswerValue = 0 | 1 | 2 | 3;

export interface Dass21Question {
  id: string;
  number: number;
  text: string;
}

export const DASS21_QUESTIONS: readonly Dass21Question[] = [
  { id: "q1", number: 1, text: "I found it hard to wind down" },
  { id: "q2", number: 2, text: "I was aware of dryness of my mouth" },
  { id: "q3", number: 3, text: "I could not seem to experience any positive feeling at all" },
  { id: "q4", number: 4, text: "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)" },
  { id: "q5", number: 5, text: "I found it difficult to work up the initiative to do things" },
  { id: "q6", number: 6, text: "I tended to over-react to situations" },
  { id: "q7", number: 7, text: "I experienced trembling (e.g. in the hands)" },
  { id: "q8", number: 8, text: "I felt that I was using a lot of nervous energy" },
  { id: "q9", number: 9, text: "I was worried about situations in which I might panic and make a fool of myself" },
  { id: "q10", number: 10, text: "I felt that I had nothing to look forward to" },
  { id: "q11", number: 11, text: "I found myself getting agitated" },
  { id: "q12", number: 12, text: "I found it difficult to relax" },
  { id: "q13", number: 13, text: "I felt down-hearted and blue" },
  { id: "q14", number: 14, text: "I was intolerant of anything that kept me from getting on with what I was doing" },
  { id: "q15", number: 15, text: "I felt I was close to panic" },
  { id: "q16", number: 16, text: "I was unable to become enthusiastic about anything" },
  { id: "q17", number: 17, text: "I felt I was not worth much as a person" },
  { id: "q18", number: 18, text: "I felt that I was rather touchy" },
  { id: "q19", number: 19, text: "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)" },
  { id: "q20", number: 20, text: "I felt scared without any good reason" },
  { id: "q21", number: 21, text: "I felt that life was meaningless" },
];

export const RESPONSE_OPTIONS: readonly { value: AnswerValue; label: string }[] = [
  { value: 0, label: "Did not apply to me at all" },
  { value: 1, label: "Applied to me to some degree, or some of the time" },
  { value: 2, label: "Applied to me to a considerable degree, or a good part of time" },
  { value: 3, label: "Applied to me very much, or most of the time" },
];

export type Dass21Scale = "depression" | "anxiety" | "stress";
export type Dass21Severity = "normal" | "mild" | "moderate" | "severe" | "extremely severe";

const SCALE_ITEMS: Record<Dass21Scale, readonly number[]> = {
  depression: [3, 5, 10, 13, 16, 17, 21],
  anxiety: [2, 4, 7, 9, 15, 19, 20],
  stress: [1, 6, 8, 11, 12, 14, 18],
};

export function scoreAnswers(answers: Record<string, AnswerValue>) {
  return (Object.entries(SCALE_ITEMS) as [Dass21Scale, readonly number[]][]).reduce(
    (scores, [scale, items]) => {
      scores[scale] = items.reduce((total, item) => total + (answers[`q${item}`] ?? 0), 0) * 2;
      return scores;
    },
    { depression: 0, anxiety: 0, stress: 0 } as Record<Dass21Scale, number>,
  );
}

export function scoreToSeverity(scale: Dass21Scale, score: number): Dass21Severity {
  const bands: Record<Dass21Scale, readonly [number, Dass21Severity][]> = {
    depression: [[9, "normal"], [13, "mild"], [20, "moderate"], [27, "severe"]],
    anxiety: [[7, "normal"], [9, "mild"], [14, "moderate"], [19, "severe"]],
    stress: [[14, "normal"], [18, "mild"], [25, "moderate"], [33, "severe"]],
  };
  return bands[scale].find(([maximum]) => score <= maximum)?.[1] ?? "extremely severe";
}
