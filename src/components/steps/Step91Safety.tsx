"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/ui/QuestionCard";

interface Props {
  onContinue: () => void;
}

export function Step91Safety({ onContinue }: Props) {
  const [showSafetyFirst, setShowSafetyFirst] = useState(false);

  if (showSafetyFirst) {
    return (
      <QuestionCard question="Safety comes first" showBack={false}>
        <p className="text-[14px] leading-[20px] text-[#475569] text-center -mt-4 mb-2">
          An insurance claim can wait. Call 911. File a claim once everyone is safe.
        </p>
        <div className="flex gap-3 w-full mt-2">
          <a
            href="tel:911"
            className="flex-1 h-[55px] flex items-center justify-center rounded-[8px] bg-[#FEE2E2] text-[#EF4444] text-[16px] font-medium active:bg-[#FECACA] transition-colors"
          >
            Call 911
          </a>
          <button
            onClick={onContinue}
            className="flex-1 h-[55px] rounded-[8px] border border-[#D4D4D4] text-[#475569] text-[16px] font-medium active:bg-[#F1F5F9] transition-colors"
          >
            I&apos;m ready to continue
          </button>
        </div>
      </QuestionCard>
    );
  }

  return (
    <QuestionCard question="Is everyone currently safe?" showBack={false}>
      <div className="flex gap-3 w-full">
        <button
          onClick={onContinue}
          className="flex-1 h-[80px] flex flex-col items-center justify-center rounded-[8px] bg-[#DCFCE7] text-[#16A34A] text-[16px] font-medium active:bg-[#BBF7D0] transition-colors"
        >
          <span className="text-[22px] font-semibold">Yes</span>
          <span className="text-[13px] font-normal">Everyone&apos;s OK</span>
        </button>
        <button
          onClick={() => setShowSafetyFirst(true)}
          className="flex-1 h-[80px] flex flex-col items-center justify-center rounded-[8px] bg-[#FEE2E2] text-[#EF4444] text-[16px] font-medium active:bg-[#FECACA] transition-colors"
        >
          <span className="text-[22px] font-semibold">No</span>
          <span className="text-[13px] font-normal">Someone&apos;s hurt</span>
        </button>
      </div>
    </QuestionCard>
  );
}
