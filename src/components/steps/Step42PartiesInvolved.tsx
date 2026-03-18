"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/ui/QuestionCard";

interface Props {
  onContinue: (parties: number) => void;
  onBack: () => void;
}

export function Step42PartiesInvolved({ onContinue, onBack }: Props) {
  const [count, setCount] = useState<number | null>(null);

  const options = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <QuestionCard
      question="How many parties were involved in the incident?"
      helperText="Include yourself and any other people involved."
      onContinue={() => count !== null && onContinue(count)}
      continueDisabled={count === null}
      onBack={onBack}
    >
      <div className="grid grid-cols-4 gap-2">
        {options.map((n) => (
          <button
            key={n}
            onClick={() => setCount(n)}
            className={`
              py-3 rounded-lg text-sm font-semibold border transition-colors
              ${
                count === n
                  ? "border-[#1660F4] bg-blue-50 text-[#1660F4]"
                  : "border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]"
              }
            `}
          >
            {n}
          </button>
        ))}
      </div>
      <button
        onClick={() => setCount(9)}
        className={`
          w-full py-2.5 rounded-lg text-sm font-medium border transition-colors
          ${
            count === 9
              ? "border-[#1660F4] bg-blue-50 text-[#1660F4]"
              : "border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]"
          }
        `}
      >
        9 or more
      </button>
    </QuestionCard>
  );
}
