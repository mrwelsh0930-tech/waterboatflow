"use client";

interface Props {
  onRestart: () => void;
  onBack: () => void;
}

export function Step7bInternationalWaters({ onRestart, onBack }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] w-full max-w-[393px] p-6 flex flex-col gap-5 items-center text-center">
      <span className="text-5xl">🌎</span>
      <div>
        <h2 className="text-[17px] font-semibold text-[#1E293B] mb-2">
          International waters incident
        </h2>
        <p className="text-sm text-[#64748B] leading-relaxed">
          For incidents that occurred in international waters, please contact
          our specialized marine claims team directly.
        </p>
      </div>
      <div className="bg-[#F1F5F9] rounded-lg px-5 py-4 w-full">
        <p className="text-xs text-[#64748B] mb-1 font-medium uppercase tracking-wide">
          Marine Claims Line
        </p>
        <a
          href="tel:1-800-555-0199"
          className="text-lg font-semibold text-[#1660F4]"
        >
          1-800-555-0199
        </a>
        <p className="text-xs text-[#94A3B8] mt-1">Available 24/7</p>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={onBack}
          className="w-full py-3 rounded-lg border border-[#D4D4D4] text-sm font-medium text-[#475569] hover:bg-[#F1F5F9] transition-colors"
        >
          Back
        </button>
        <button
          onClick={onRestart}
          className="w-full py-2.5 text-sm text-[#94A3B8] hover:text-[#475569] transition-colors"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
