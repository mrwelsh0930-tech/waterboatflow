"use client";

interface Props {
  label: string;
  emoji?: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function ButtonMultiSelect({
  label,
  emoji,
  description,
  selected = false,
  onClick,
  disabled = false,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border text-left transition-colors
        ${
          selected
            ? "border-[#1660F4] bg-blue-50"
            : "border-[#D4D4D4] bg-white hover:border-[#1660F4] hover:bg-blue-50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {/* Checkbox */}
      <div
        className={`
          w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors
          ${selected ? "border-[#1660F4] bg-[#1660F4]" : "border-[#D4D4D4] bg-white"}
        `}
      >
        {selected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {emoji && (
        <span className="text-xl flex-shrink-0 w-7 text-center">{emoji}</span>
      )}

      <div className="flex flex-col min-w-0">
        <span
          className={`font-medium text-sm leading-snug ${
            selected ? "text-[#1660F4]" : "text-[#475569]"
          }`}
        >
          {label}
        </span>
        {description && (
          <span className="text-xs text-[#94A3B8] mt-0.5 leading-snug">
            {description}
          </span>
        )}
      </div>
    </button>
  );
}
