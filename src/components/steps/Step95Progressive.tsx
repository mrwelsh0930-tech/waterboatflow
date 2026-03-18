"use client";

import { QuestionCard } from "@/components/ui/QuestionCard";

interface Props {
  fullName: string;
  onContinue: (isInsured: boolean) => void;
  onBack: () => void;
}

export function Step95Progressive({ fullName, onContinue, onBack }: Props) {
  const displayName = fullName.trim().split(" ")[0] || "you";

  return (
    <QuestionCard
      question={`Are ${displayName === "you" ? "you" : displayName} insured by Progressive?`}
      onBack={onBack}
    >
      <div className="flex gap-3 w-full">
        <button
          onClick={() => onContinue(true)}
          className="flex-1 h-[55px] rounded-[8px] border border-[#D4D4D4] text-[#475569] text-[16px] font-medium hover:border-[#1660F4] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-all"
        >
          Yes
        </button>
        <button
          onClick={() => onContinue(false)}
          className="flex-1 h-[55px] rounded-[8px] border border-[#D4D4D4] text-[#475569] text-[16px] font-medium hover:border-[#1660F4] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-all"
        >
          No
        </button>
      </div>
    </QuestionCard>
  );
}
