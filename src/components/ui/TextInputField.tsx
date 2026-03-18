"use client";

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  type?: "text" | "tel" | "number";
  optional?: boolean;
}

export function TextInputField({
  label,
  placeholder,
  value,
  onChange,
  multiline = false,
  rows = 4,
  type = "text",
  optional = false,
}: Props) {
  const baseClass = `
    w-full px-3.5 py-3 rounded-lg border border-[#D4D4D4] text-sm text-[#1E293B]
    placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1660F4] focus:ring-1
    focus:ring-[#1660F4] transition-colors bg-white
  `;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#475569]">
          {label}
          {optional && (
            <span className="text-[#94A3B8] font-normal ml-1">(optional)</span>
          )}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
    </div>
  );
}
