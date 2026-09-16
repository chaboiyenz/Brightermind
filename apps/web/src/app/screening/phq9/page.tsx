import { Phq9Questionnaire } from "./Phq9Questionnaire";

export default function Phq9Page() {
  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-lg font-medium text-stone-900">PHQ-9 screening</h1>
      <Phq9Questionnaire />
    </main>
  );
}
