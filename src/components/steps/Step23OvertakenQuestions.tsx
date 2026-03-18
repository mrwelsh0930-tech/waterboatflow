"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface OvertakenAnswers {
  otherBoatFollowedRules: boolean | null;
  insuredFollowedRules: boolean | null;
  insuredUnderPowerAtImpact: boolean | null;
  otherUnderPowerAtImpact: boolean | null;
}

interface Props {
  boatLabel: string;
  onContinue: (answers: OvertakenAnswers) => void;
  onBack: () => void;
}

const YES_NO: { value: boolean; label: string; emoji: string }[] = [
  { value: true, label: "Yes", emoji: "✅" },
  { value: false, label: "No", emoji: "❌" },
];

type QuestionKey = keyof OvertakenAnswers;

const QUESTIONS: { key: QuestionKey; question: string; getQuestion?: (label: string) => string }[] = [
  {
    key: "otherBoatFollowedRules",
    question: "Did you think the other boat was following navigational rules?",
  },
  {
    key: "insuredFollowedRules",
    question: "Did you think your boat was following navigational rules?",
  },
  {
    key: "insuredUnderPowerAtImpact",
    question: "Was your boat under power at impact?",
  },
  {
    key: "otherUnderPowerAtImpact",
    question: "Was the other boat under power at impact?",
  },
];

export function Step23OvertakenQuestions({ boatLabel, onContinue, onBack }: Props) {
  const [answers, setAnswers] = useState<OvertakenAnswers>({
    otherBoatFollowedRules: null,
    insuredFollowedRules: null,
    insuredUnderPowerAtImpact: null,
    otherUnderPowerAtImpact: null,
  });

  const answeredCount = Object.values(answers).filter((v) => v !== null).length;
  const allAnswered = answeredCount === 4;

  function setAnswer(key: QuestionKey, value: boolean) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <QuestionCard
      question="A few questions about the overtake"
      helperText="Answer each question to the best of your knowledge."
      onContinue={() => onContinue(answers)}
      continueDisabled={!allAnswered}
      onBack={onBack}
    >
      {QUESTIONS.map(({ key, question }) => (
        <div key={key} className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-[#1E293B]">{question}</p>
          <div className="flex gap-2">
            {YES_NO.map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setAnswer(key, opt.value)}
                className={`
                  flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors
                  ${
                    answers[key] === opt.value
                      ? "border-[#1660F4] bg-blue-50 text-[#1660F4]"
                      : "border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]"
                  }
                `}
              >
                {opt.emoji} {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </QuestionCard>
  );
}
