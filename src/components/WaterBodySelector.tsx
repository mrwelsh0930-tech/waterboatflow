"use client";

import { WaterBodyType } from "@/types/reconstruction";

interface WaterBodySelectorProps {
  onSelect: (type: WaterBodyType) => void;
}

const OPTIONS: { type: WaterBodyType; label: string; icon: string }[] = [
  { type: "ocean", label: "Ocean", icon: "\uD83C\uDF0A" },
  { type: "lake", label: "Lake / Pond", icon: "\uD83C\uDFDE\uFE0F" },
  { type: "river", label: "River / Stream", icon: "\uD83C\uDFDE\uFE0F" },
  { type: "other", label: "Other", icon: "\uD83D\uDCA7" },
];

export function WaterBodySelector({ onSelect }: WaterBodySelectorProps) {
  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-medium text-[18px] leading-[28px] tracking-[-0.26px] text-[#475569] text-center mb-[10px]">
        What type of body of water?
      </h2>
      <p className="font-normal text-[14px] leading-[20px] tracking-[-0.09px] text-[#475569] text-center mb-8">
        Where did the incident occur?
      </p>

      <div className="w-full space-y-3">
        {OPTIONS.map((option) => (
          <button
            key={option.type}
            onClick={() => onSelect(option.type)}
            className="w-full flex items-center gap-4 p-4 border border-[#D4D4D4] rounded-[8px] hover:border-[#1660F4] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-all text-left"
          >
            <span className="text-3xl">{option.icon}</span>
            <p className="font-medium text-[14px] leading-[20px] text-[#475569]">{option.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
