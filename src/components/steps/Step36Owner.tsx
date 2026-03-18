"use client";

import { QuestionCard } from "@/components/ui/QuestionCard";

interface Props {
  fullName: string;
  boatLabel: string;
  onContinue: (isOwner: boolean) => void;
  onBack: () => void;
}

export function Step36Owner({ fullName, boatLabel, onContinue, onBack }: Props) {
  const firstName = fullName.trim().split(" ")[0] || "you";
  const question = firstName === "you"
    ? `Are you the owner of your ${boatLabel}?`
    : `Are you (${firstName}) the owner of your ${boatLabel}?`;

  return (
    <QuestionCard question={question} onBack={onBack}>
      <div className="flex gap-3 w-full">
        <button
          onClick={() => onContinue(true)}
          className="flex-1 h-[80px] flex flex-col items-center justify-center rounded-[8px] border border-[#D4D4D4] text-[#475569] hover:border-[#1660F4] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-all"
        >
          <span className="text-[28px]">👍</span>
          <span className="text-[14px] font-medium mt-1">Yes</span>
        </button>
        <button
          onClick={() => onContinue(false)}
          className="flex-1 h-[80px] flex flex-col items-center justify-center rounded-[8px] border border-[#D4D4D4] text-[#475569] hover:border-[#1660F4] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-all"
        >
          <span className="text-[28px]">👎</span>
          <span className="text-[14px] font-medium mt-1">No</span>
        </button>
      </div>
    </QuestionCard>
  );
}
