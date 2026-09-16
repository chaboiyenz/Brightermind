"use client";

import { useState } from "react";
import { Button, Card, CardContent } from "@/components/ui";
import { Dass21ProgressIndicator } from "../dass21/Dass21ProgressIndicator";
import { Who5ResultCard } from "./Who5ResultCard";
import { calculateScore, RESPONSE_OPTIONS, WHO5_QUESTIONS, type AnswerValue } from "./who5Data";

export function Who5Questionnaire() {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const question = WHO5_QUESTIONS[currentStep];
  const isLastQuestion = currentStep === WHO5_QUESTIONS.length - 1;
  const hasAnsweredCurrent = answers[question.id] !== undefined;

  function selectAnswer(value: AnswerValue) {
    setAnswers((current) => ({ ...current, [question.id]: value }));
  }

  function goNext() {
    if (isLastQuestion) setSubmitted(true);
    else setCurrentStep((step) => step + 1);
  }

  if (submitted) return <Who5ResultCard {...calculateScore(answers)} />;

  return (
    <div className="flex flex-col gap-4">
      <Dass21ProgressIndicator step={currentStep} total={WHO5_QUESTIONS.length} />
      <Card key={question.id} className="motion-safe:animate-in">
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-stone-600">Please respond to each statement based on how you have felt in the last two weeks.</p>
          <p className="text-[15px] font-medium leading-relaxed text-stone-900">{question.text}</p>
          <div className="flex flex-col gap-2">
            {RESPONSE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                size="sm"
                className="h-auto min-h-9 justify-start px-4 py-2 text-left text-[13px] leading-snug"
                variant={answers[question.id] === option.value ? "primary" : "outline"}
                onClick={() => selectAnswer(option.value)}
              >
                {option.value}: {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))} disabled={currentStep === 0}>← Back</Button>
        <Button onClick={goNext} disabled={!hasAnsweredCurrent}>{isLastQuestion ? "See results" : "Next"}</Button>
      </div>
    </div>
  );
}
