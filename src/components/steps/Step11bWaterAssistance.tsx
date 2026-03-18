"use client";

import { AssuredHeader } from "@/components/AssuredHeader";

interface Props {
  onRestart: () => void;
}

export function Step11bWaterAssistance({ onRestart }: Props) {
  return (
    <div className="w-full max-w-[393px] flex flex-col">
      <AssuredHeader showBack={false} />

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col items-center text-center gap-4">
        <div className="text-5xl">🆘</div>
        <h2 className="text-[17px] font-semibold text-[#1E293B]">
          We'll connect you with water assistance
        </h2>
        <p className="text-sm text-[#64748B] leading-relaxed">
          For immediate on-water assistance, please call our marine claims line. An agent is
          standing by to help.
        </p>

        <a
          href="tel:18005550199"
          className="w-full py-3.5 rounded-lg text-sm font-semibold bg-[#1660F4] text-white hover:bg-[#1250D4] transition-colors text-center"
        >
          📞 Call 1-800-555-0199
        </a>

        <button
          onClick={onRestart}
          className="w-full py-2.5 text-sm font-medium text-[#64748B] hover:text-[#475569] transition-colors"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
