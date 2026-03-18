"use client";

import { QuestionCard } from "@/components/ui/QuestionCard";

interface Props {
  onContinue: () => void;
  onBack: () => void;
}

export function Step61CoastGuardPhoto({ onContinue, onBack }: Props) {
  return (
    <QuestionCard
      question="Upload the Coast Guard or marine patrol report"
      helperText="Take a photo or upload an image of the report."
      onContinue={onContinue}
      continueLabel="Skip for now — continue"
      onBack={onBack}
    >
      <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center bg-[#F8FAFC]">
        <span className="text-3xl">📄</span>
        <p className="text-sm font-medium text-[#475569]">Tap to upload report</p>
        <p className="text-xs text-[#94A3B8]">Photo, PDF, or image file</p>
        <button className="mt-1 px-4 py-2 rounded-lg bg-[#1660F4] text-white text-xs font-semibold hover:bg-[#1250D4] transition-colors">
          Choose file
        </button>
      </div>
    </QuestionCard>
  );
}
