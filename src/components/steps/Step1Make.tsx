"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { TextInputField } from "@/components/ui/TextInputField";

interface Props {
  value: string;
  onContinue: (make: string) => void;
}

// Common boat manufacturers for quick selection
const COMMON_MAKES = [
  "Bayliner", "Sea Ray", "Boston Whaler", "Grady-White", "Malibu",
  "MasterCraft", "Yamaha", "Sea-Doo", "Tracker", "Lund",
  "Ranger", "Skeeter", "Chaparral", "Chris-Craft", "Cobalt",
];

export function Step1Make({ value, onContinue }: Props) {
  const [make, setMake] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = make.length >= 1
    ? COMMON_MAKES.filter((m) =>
        m.toLowerCase().startsWith(make.toLowerCase())
      )
    : [];

  return (
    <QuestionCard
      question="What make is your watercraft?"
      helperText="Enter the manufacturer name, e.g. Bayliner, Sea Ray, Yamaha."
      onContinue={() => onContinue(make.trim())}
      continueDisabled={make.trim().length === 0}
    >
      <div className="relative">
        <TextInputField
          placeholder="Search manufacturer..."
          value={make}
          onChange={(v) => {
            setMake(v);
            setShowSuggestions(true);
          }}
        />
        {showSuggestions && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-[#D4D4D4] rounded-lg shadow-md overflow-hidden">
            {filtered.slice(0, 6).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMake(m);
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-[#475569] hover:bg-blue-50 hover:text-[#1660F4] transition-colors"
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-[#94A3B8] mt-1">
        Don&apos;t see your manufacturer? Type it in directly.
      </p>
    </QuestionCard>
  );
}
