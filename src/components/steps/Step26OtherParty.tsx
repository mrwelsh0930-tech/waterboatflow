"use client";

import { useState } from "react";
import { OtherParty, OtherPartyType, OperatingState } from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";
import { ButtonMultiSelect } from "@/components/ui/ButtonMultiSelect";

interface Props {
  onContinue: (party: OtherParty) => void;
  onBack: () => void;
}

type SubScreen = "type" | "operating-state" | "color" | "insurance";

const PARTY_TYPES: { value: OtherPartyType; label: string; emoji: string }[] = [
  { value: "motorized-watercraft", label: "Motorized watercraft", emoji: "🚤" },
  { value: "non-motorized-watercraft", label: "Non-motorized watercraft", emoji: "🚣" },
  { value: "person-in-water", label: "Person in the water", emoji: "🏊" },
  { value: "something-else", label: "Something else", emoji: "🤔" },
];

const OPERATING_STATES: { value: OperatingState; label: string; emoji: string }[] = [
  { value: "under-power", label: "Under power", emoji: "⚡" },
  { value: "drifting", label: "Drifting", emoji: "🌊" },
  { value: "anchored", label: "Anchored", emoji: "⚓" },
  { value: "moored", label: "Moored (tied up)", emoji: "🪢" },
  { value: "docked", label: "Docked", emoji: "🏗️" },
];

const COLORS = [
  "White", "Black", "Blue", "Red", "Green", "Yellow", "Silver/Gray", "Brown", "Orange", "Other",
];

export function Step26OtherParty({ onContinue, onBack }: Props) {
  const [screen, setScreen] = useState<SubScreen>("type");
  const [partyType, setPartyType] = useState<OtherPartyType | null>(null);
  const [opState, setOpState] = useState<OperatingState[]>([]);
  const [color, setColor] = useState("");
  const [hasInsurance, setHasInsurance] = useState<boolean | null>(null);

  function toggleOp(v: OperatingState) {
    setOpState((prev) => prev.includes(v) ? prev.filter((s) => s !== v) : [...prev, v]);
  }

  if (screen === "type") {
    return (
      <QuestionCard
        question="How would you describe the other party?"
        onBack={onBack}
      >
        {PARTY_TYPES.map((o) => (
          <ButtonSingleSelect
            key={o.value}
            emoji={o.emoji}
            label={o.label}
            selected={false}
            onClick={() => {
              setPartyType(o.value);
              setScreen("operating-state");
            }}
          />
        ))}
      </QuestionCard>
    );
  }

  if (screen === "operating-state") {
    return (
      <QuestionCard
        question="How was the other party operating at the time?"
        helperText="Select all that apply."
        onContinue={() => setScreen("color")}
        continueDisabled={opState.length === 0}
        onBack={() => setScreen("type")}
      >
        {OPERATING_STATES.map((o) => (
          <ButtonMultiSelect
            key={o.value}
            emoji={o.emoji}
            label={o.label}
            selected={opState.includes(o.value)}
            onClick={() => toggleOp(o.value)}
          />
        ))}
      </QuestionCard>
    );
  }

  if (screen === "color") {
    return (
      <QuestionCard
        question="What color is the other watercraft?"
        onBack={() => setScreen("operating-state")}
      >
        {COLORS.map((c) => (
          <ButtonSingleSelect
            key={c}
            emoji="🎨"
            label={c}
            selected={false}
            onClick={() => {
              setColor(c);
              setScreen("insurance");
            }}
          />
        ))}
      </QuestionCard>
    );
  }

  // insurance screen
  return (
    <QuestionCard
      question="Does the other party have an insurance card?"
      onContinue={() =>
        onContinue({
          type: partyType,
          operatingState: opState,
          color,
          hasInsuranceCard: hasInsurance,
        })
      }
      continueDisabled={hasInsurance === null}
      onBack={() => setScreen("color")}
    >
      {[
        { value: true, label: "Yes — they have it", emoji: "✅" },
        { value: false, label: "No / I don't know", emoji: "❌" },
      ].map((o) => (
        <ButtonSingleSelect
          key={String(o.value)}
          emoji={o.emoji}
          label={o.label}
          selected={hasInsurance === o.value}
          onClick={() => setHasInsurance(o.value)}
        />
      ))}
    </QuestionCard>
  );
}
