"use client";

import { useState } from "react";

interface Props {
  value: string;
  onContinue: (color: string) => void;
  onBack: () => void;
}

const COLORS: { label: string; hex?: string; rainbow?: boolean }[] = [
  { label: "White", hex: "#FFFFFF" },
  { label: "Black", hex: "#1E293B" },
  { label: "Dark gray", hex: "#64748B" },
  { label: "Light gray", hex: "#CBD5E1" },
  { label: "Red", hex: "#EF4444" },
  { label: "Blue", hex: "#3B82F6" },
  { label: "Brown", hex: "#92400E" },
  { label: "Yellow", hex: "#EAB308" },
  { label: "Dark green", hex: "#15803D" },
  { label: "Two-tone / Other", rainbow: true },
];

export function Step2Color({ value, onContinue, onBack }: Props) {
  const [selected, setSelected] = useState<string | null>(value || null);

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-medium text-[18px] leading-[28px] tracking-[-0.26px] text-[#475569] text-center mb-2">
        What color best matches your Boat?
      </h2>
      <p className="text-[14px] text-[#94A3B8] mb-6">Choose a color</p>

      <div className="grid grid-cols-4 gap-x-4 gap-y-5 mb-8">
        {COLORS.map((c) => (
          <button
            key={c.label}
            onClick={() => setSelected(c.label)}
            title={c.label}
            className={`w-14 h-14 rounded-full transition-all ${
              selected === c.label
                ? "ring-4 ring-[#1660F4] ring-offset-2"
                : "ring-2 ring-[#E2E8F0]"
            }`}
            style={
              c.rainbow
                ? {
                    background:
                      "conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)",
                  }
                : { backgroundColor: c.hex }
            }
          />
        ))}
      </div>

      <div className="flex gap-3 w-full">
        <button
          onClick={() => onContinue("Unknown")}
          className="flex-1 h-[48px] rounded-[8px] border border-[#D4D4D4] text-[#475569] text-[15px] font-medium active:bg-[#F1F5F9] transition-colors"
        >
          I don&apos;t know
        </button>
        <button
          onClick={() => selected && onContinue(selected)}
          disabled={!selected}
          className="flex-1 h-[48px] rounded-[8px] bg-[#1660F4] text-white text-[15px] font-medium active:bg-[#1250D4] transition-colors disabled:bg-[#94A3B8] disabled:cursor-not-allowed"
        >
          That&apos;s right
        </button>
      </div>

      <button
        onClick={onBack}
        className="mt-4 text-[14px] text-[#94A3B8] font-medium active:text-[#475569]"
      >
        ← Back
      </button>
    </div>
  );
}
