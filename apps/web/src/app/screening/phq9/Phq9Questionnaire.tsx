"use client";

import { useState } from "react";
import { Button, Card, CardContent } from "@/components/ui";
import { Phq9ProgressIndicator } from "./Phq9ProgressIndicator";
import { Phq9ResultCard } from "./Phq9ResultCard";
import {
  PHQ9_QUESTIONS,
  RESPONSE_OPTIONS,
  scoreToSeverity,
  sumAnswers,
  type AnswerValue,
} from "./phq9Data";

export function Phq9Questionnaire() {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const question = PHQ9_QUESTIONS[currentStep];
  const isLastQuestion = currentStep === PHQ9_QUESTIONS.length - 1;
  const hasAnsweredCurrent = answers[question?.id] !== undefined;

  function selectAnswer(value: AnswerValue) {
    setAnswers((current) => ({ ...current, [question.id]: value }));
  }

  function goNext() {
    if (isLastQuestion) {
      setSubmitted(true);
    } else {
      setCurrentStep((step) => step + 1);
    }
  }

  function goBack() {
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  if (submitted) {
    const totalScore = sumAnswers(answers);
    return <Phq9ResultCard totalScore={totalScore} severity={scoreToSeverity(totalScore)} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Phq9ProgressIndicator step={currentStep} total={PHQ9_QUESTIONS.length} />

      <Card>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-stone-600">
            Over the last 2 weeks, how often have you been bothered by the following problem?
          </p>
          <p className="text-base font-medium text-stone-900">{question.text}</p>

          <div className="flex flex-col gap-2">
            {RESPONSE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={answers[question.id] === option.value ? "primary" : "outline"}
                onClick={() => selectAnswer(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={goBack} disabled={currentStep === 0}>
          ← Back
        </Button>
        <Button onClick={goNext} disabled={!hasAnsweredCurrent}>
          {isLastQuestion ? "See result" : "Next"}
        </Button>
      </div>
    </div>
  );
}
