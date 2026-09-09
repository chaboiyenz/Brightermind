import { Gad7Questionnaire } from "./Gad7Questionnaire";

export default function Gad7Page() {
  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-lg font-medium text-stone-900">GAD-7 screening</h1>
      <Gad7Questionnaire />
    </main>
  );
}
