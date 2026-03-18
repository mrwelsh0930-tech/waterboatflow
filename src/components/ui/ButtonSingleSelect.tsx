"use client";

interface Props {
  label: string;
  emoji?: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function ButtonSingleSelect({
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
            ? "border-[#1660F4] bg-blue-50 text-[#1660F4]"
            : "border-[#D4D4D4] bg-white text-[#475569] hover:border-[#1660F4] hover:bg-blue-50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {emoji && (
        <span className="text-xl flex-shrink-0 w-7 text-center">{emoji}</span>
      )}
      <div className="flex flex-col min-w-0">
        <span className="font-medium text-sm leading-snug">{label}</span>
        {description && (
          <span className="text-xs text-[#94A3B8] mt-0.5 leading-snug">
            {description}
          </span>
        )}
      </div>
    </button>
  );
}
