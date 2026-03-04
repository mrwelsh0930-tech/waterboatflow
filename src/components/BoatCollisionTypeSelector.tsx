"use client";

import { useState } from "react";
import { BoatCollisionEntityType, WaterBodyType } from "@/types/reconstruction";

interface BoatCollisionTypeSelectorProps {
  onSelect: (type: BoatCollisionEntityType, subType: string | null) => void;
  waterBodyType?: WaterBodyType | null;
}

const MAIN_OPTIONS: { type: BoatCollisionEntityType; label: string; icon: string; description: string }[] = [
  { type: "boat", label: "Another boat", icon: "\u26F5", description: "Motorboat, sailboat, kayak, etc." },
  { type: "fixed-property", label: "Fixed property", icon: "\u2693", description: "Dock, buoy, pier, seawall, etc." },
  { type: "animal", label: "An animal", icon: "\uD83D\uDC1F", description: "Marine animal or wildlife" },
  { type: "object", label: "An object", icon: "\uD83E\uDEA8", description: "Debris, log, rock, etc." },
  { type: "swimmer", label: "A swimmer", icon: "\uD83C\uDFCA", description: "Person in the water" },
];

const PROPERTY_OPTIONS = [
  { value: "dock", label: "Dock", icon: "\u2693" },
  { value: "boat-lift", label: "Boat lift", icon: "\uD83C\uDFD7\uFE0F" },
  { value: "bridge-piling", label: "Bridge piling", icon: "\uD83C\uDF09" },
  { value: "buoy", label: "Buoy", icon: "\uD83D\uDD34" },
  { value: "pier", label: "Pier", icon: "\uD83C\uDF09" },
  { value: "seawall", label: "Seawall", icon: "\uD83E\uDDF1" },
  { value: "other", label: "Other property", icon: "\uD83C\uDFD7\uFE0F" },
];

const ANIMAL_SALTWATER = [
  { value: "dolphin", label: "Dolphin", icon: "\uD83D\uDC2C" },
  { value: "manatee", label: "Manatee", icon: "\uD83D\uDC0B" },
  { value: "sea-turtle", label: "Sea turtle", icon: "\uD83D\uDC22" },
  { value: "other", label: "Other animal", icon: "\uD83D\uDC3E" },
];

const ANIMAL_FRESHWATER = [
  { value: "fish", label: "Fish", icon: "\uD83D\uDC1F" },
  { value: "duck", label: "Duck", icon: "\uD83E\uDD86" },
  { value: "goose", label: "Goose", icon: "\uD83E\uDEB3" },
  { value: "turtle", label: "Turtle", icon: "\uD83D\uDC22" },
  { value: "other", label: "Other animal", icon: "\uD83D\uDC3E" },
];

const OBJECT_SALTWATER = [
  { value: "sandbar", label: "Sandbar", icon: "\uD83C\uDFD6\uFE0F" },
  { value: "floating-debris", label: "Floating debris", icon: "\uD83D\uDDD1\uFE0F" },
  { value: "reef", label: "Reef", icon: "\uD83E\uDEB8" },
  { value: "submerged-object", label: "Submerged object", icon: "\uD83D\uDCE6" },
  { value: "other", label: "Other object", icon: "\uD83D\uDCE6" },
];

const OBJECT_FRESHWATER = [
  { value: "rock", label: "Rock", icon: "\uD83E\uDEA8" },
  { value: "log", label: "Log", icon: "\uD83E\uDEB5" },
  { value: "stump", label: "Stump", icon: "\uD83E\uDEB5" },
  { value: "other", label: "Other object", icon: "\uD83D\uDCE6" },
];

const SUB_TYPE_HEADINGS: Record<string, string> = {
  "fixed-property": "What type of property?",
  animal: "What kind of animal?",
  object: "What kind of object?",
};

export function BoatCollisionTypeSelector({ onSelect, waterBodyType = null }: BoatCollisionTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<BoatCollisionEntityType | null>(null);

  const isSaltwater = waterBodyType === "ocean" || waterBodyType === "other" || waterBodyType === null;

  const getSubOptions = (type: string) => {
    if (type === "fixed-property") return PROPERTY_OPTIONS;
    if (type === "animal") return isSaltwater ? ANIMAL_SALTWATER : ANIMAL_FRESHWATER;
    if (type === "object") return isSaltwater ? OBJECT_SALTWATER : OBJECT_FRESHWATER;
    return [];
  };

  // Sub-type selection
  if (selectedType && selectedType !== "boat" && selectedType !== "swimmer") {
    const subOptions = getSubOptions(selectedType);
    return (
      <div className="flex flex-col items-center w-full">
        <h2 className="font-medium text-[18px] leading-[28px] tracking-[-0.26px] text-[#475569] text-center mb-[10px]">
          {SUB_TYPE_HEADINGS[selectedType]}
        </h2>
        <p className="font-normal text-[14px] leading-[20px] tracking-[-0.09px] text-[#475569] text-center mb-8">
          This helps us understand the incident better.
        </p>

        <div className="w-full space-y-3">
          {subOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(selectedType, option.value)}
              className="w-full flex items-center gap-4 p-4 border border-[#D4D4D4] rounded-[8px] hover:border-[#1660F4] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-all text-left"
            >
              <span className="text-3xl">{option.icon}</span>
              <p className="font-medium text-[14px] leading-[20px] text-[#475569]">{option.label}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => setSelectedType(null)}
          className="mt-4 text-[14px] text-[#94A3B8] font-medium active:text-[#475569]"
        >
          &larr; Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-medium text-[18px] leading-[28px] tracking-[-0.26px] text-[#475569] text-center mb-[10px]">
        What did your boat collide with?
      </h2>
      <p className="font-normal text-[14px] leading-[20px] tracking-[-0.09px] text-[#475569] text-center mb-8">
        Select what your boat made contact with.
      </p>

      <div className="w-full space-y-3">
        {MAIN_OPTIONS.map((option) => (
          <button
            key={option.type}
            onClick={() => {
              if (option.type === "boat" || option.type === "swimmer") {
                onSelect(option.type, null);
              } else {
                setSelectedType(option.type);
              }
            }}
            className="w-full flex items-center gap-4 p-4 border border-[#D4D4D4] rounded-[8px] hover:border-[#1660F4] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-all text-left"
          >
            <span className="text-3xl">{option.icon}</span>
            <div>
              <p className="font-medium text-[14px] leading-[20px] text-[#475569]">{option.label}</p>
              <p className="font-normal text-[14px] leading-[20px] tracking-[-0.09px] text-[#94A3B8]">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
