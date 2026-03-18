"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/ui/QuestionCard";

interface DockingAnswers {
  insuredDockingOrUndocking: "docking" | "undocking" | null;
  otherDockingOrUndocking: "docking" | "undocking" | null;
  rightOfWay: "insured" | "other" | "unknown" | null;
}

interface Props {
  onContinue: (answers: DockingAnswers) => void;
  onBack: () => void;
}

function TwoWayChoice({
  question,
  optionA,
  optionB,
  value,
  onChange,
}: {
  question: string;
  optionA: { label: string; value: string };
  optionB: { label: string; value: string };
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium text-[#1E293B]">{question}</p>
      <div className="flex gap-2">
        {[optionA, optionB].map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors
              ${
                value === opt.value
                  ? "border-[#1660F4] bg-blue-50 text-[#1660F4]"
                  : "border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]"
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Step25DockingQuestions({ onContinue, onBack }: Props) {
  const [insured, setInsured] = useState<"docking" | "undocking" | null>(null);
  const [other, setOther] = useState<"docking" | "undocking" | null>(null);
  const [row, setRow] = useState<"insured" | "other" | "unknown" | null>(null);

  const allAnswered = insured !== null && other !== null && row !== null;

  return (
    <QuestionCard
      question="Tell us about the docking incident"
      helperText="Answer each question to the best of your knowledge."
      onContinue={() =>
        onContinue({
          insuredDockingOrUndocking: insured,
          otherDockingOrUndocking: other,
          rightOfWay: row,
        })
      }
      continueDisabled={!allAnswered}
      onBack={onBack}
    >
      <TwoWayChoice
        question="Was your boat docking or undocking?"
        optionA={{ label: "Docking", value: "docking" }}
        optionB={{ label: "Undocking", value: "undocking" }}
        value={insured}
        onChange={(v) => setInsured(v as "docking" | "undocking")}
      />
      <TwoWayChoice
        question="Was the other boat docking or undocking?"
        optionA={{ label: "Docking", value: "docking" }}
        optionB={{ label: "Undocking", value: "undocking" }}
        value={other}
        onChange={(v) => setOther(v as "docking" | "undocking")}
      />
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-[#1E293B]">Which boat had the right of way?</p>
        <div className="flex flex-col gap-1.5">
          {(
            [
              { value: "insured", label: "Your boat" },
              { value: "other", label: "The other boat" },
              { value: "unknown", label: "I'm not sure" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRow(opt.value)}
              className={`
                w-full py-2.5 px-3 rounded-lg text-sm font-medium border text-left transition-colors
                ${
                  row === opt.value
                    ? "border-[#1660F4] bg-blue-50 text-[#1660F4]"
                    : "border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]"
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </QuestionCard>
  );
}
