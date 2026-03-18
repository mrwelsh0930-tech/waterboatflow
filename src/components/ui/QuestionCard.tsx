"use client";

interface Props {
  question: string;
  helperText?: string;
  children: React.ReactNode;
  onContinue?: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function QuestionCard({
  question,
  helperText,
  children,
  onContinue,
  continueDisabled = false,
  continueLabel = "Continue",
  onBack,
  showBack = true,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] w-full max-w-[393px] overflow-hidden">
      {/* Header area */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-[17px] font-semibold text-[#1E293B] leading-snug">
          {question}
        </h2>
        {helperText && (
          <p className="text-sm text-[#64748B] mt-1.5 leading-relaxed">
            {helperText}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="px-6 pb-4 flex flex-col gap-2">{children}</div>

      {/* Footer */}
      {onContinue && (
        <div className="px-6 pb-6 pt-2 flex flex-col gap-2">
          <button
            onClick={onContinue}
            disabled={continueDisabled}
            className={`
              w-full py-3.5 rounded-lg text-sm font-semibold transition-colors
              ${
                continueDisabled
                  ? "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                  : "bg-[#1660F4] text-white hover:bg-[#1250D4] active:bg-[#0F44C0]"
              }
            `}
          >
            {continueLabel}
          </button>
          {showBack && onBack && (
            <button
              onClick={onBack}
              className="w-full py-2.5 text-sm font-medium text-[#64748B] hover:text-[#475569] transition-colors"
            >
              Back
            </button>
          )}
        </div>
      )}
    </div>
  );
}
