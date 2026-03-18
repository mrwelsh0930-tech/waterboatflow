"use client";

interface Props {
  title: string;
  message: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  emoji?: string;
}

export function ModalOverlay({
  title,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  emoji,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-[340px] p-6 flex flex-col gap-4 shadow-xl">
        {emoji && (
          <div className="text-4xl text-center">{emoji}</div>
        )}
        <div className="text-center">
          <h3 className="text-base font-semibold text-[#1E293B] mb-1">{title}</h3>
          <p className="text-sm text-[#64748B] leading-relaxed">{message}</p>
        </div>
        <div className="flex flex-col gap-2 mt-1">
          {onPrimary && primaryLabel && (
            <button
              onClick={onPrimary}
              className="w-full py-3 rounded-lg bg-[#1660F4] text-white text-sm font-semibold hover:bg-[#1250D4] transition-colors"
            >
              {primaryLabel}
            </button>
          )}
          {onSecondary && secondaryLabel && (
            <button
              onClick={onSecondary}
              className="w-full py-2.5 text-sm font-medium text-[#64748B] hover:text-[#475569] transition-colors"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
