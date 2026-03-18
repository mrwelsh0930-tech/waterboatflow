"use client";

import { useState } from "react";
import {
  CollisionEntity,
  PropertySubtype,
  AnimalSubtype,
  ObjectSubtype,
} from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";
import { TextInputField } from "@/components/ui/TextInputField";

interface Props {
  entity: CollisionEntity;
  isSaltwater: boolean; // derived from water body type or location
  onContinue: (updates: Partial<CollisionEntity>) => void;
  onBack: () => void;
}

// Property subtype step
function PropertyTypeStep({
  onSelect,
  onBack,
}: {
  onSelect: (v: PropertySubtype) => void;
  onBack: () => void;
}) {
  const options: { value: PropertySubtype; label: string; emoji: string }[] = [
    { value: "dock", label: "Dock", emoji: "🪵" },
    { value: "boat-lift", label: "Boat lift", emoji: "🔧" },
    { value: "bridge-piling", label: "Bridge piling", emoji: "🌉" },
    { value: "buoy", label: "Buoy", emoji: "🔴" },
    { value: "pier", label: "Pier", emoji: "🏗️" },
    { value: "seawall", label: "Seawall", emoji: "🧱" },
    { value: "other", label: "Other", emoji: "🤔" },
  ];
  return (
    <QuestionCard question="What type of property was it?" onBack={onBack}>
      {options.map((o) => (
        <ButtonSingleSelect
          key={o.value}
          emoji={o.emoji}
          label={o.label}
          selected={false}
          onClick={() => onSelect(o.value)}
        />
      ))}
    </QuestionCard>
  );
}

// Property owner step
function PropertyOwnerStep({
  onContinue,
  onBack,
}: {
  onContinue: (name: string, phone: string) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <QuestionCard
      question="Who owns the property?"
      helperText="Provide contact information if known. You can skip if you don't know."
      onContinue={() => onContinue(name, phone)}
      continueLabel={name || phone ? "Continue" : "I don't know — continue"}
      onBack={onBack}
    >
      <TextInputField
        label="Owner name"
        value={name}
        onChange={setName}
        placeholder="Full name"
      />
      <TextInputField
        label="Phone number"
        value={phone}
        onChange={setPhone}
        placeholder="(555) 000-0000"
      />
    </QuestionCard>
  );
}

// Animal subtype step
function AnimalTypeStep({
  isSaltwater,
  onSelect,
  onBack,
}: {
  isSaltwater: boolean;
  onSelect: (v: AnimalSubtype) => void;
  onBack: () => void;
}) {
  const saltwaterOptions: { value: AnimalSubtype; label: string; emoji: string }[] = [
    { value: "dolphin", label: "Dolphin", emoji: "🐬" },
    { value: "manatee", label: "Manatee", emoji: "🐋" },
    { value: "sea-turtle", label: "Sea turtle", emoji: "🐢" },
    { value: "other", label: "Other", emoji: "🤔" },
  ];
  const freshwaterOptions: { value: AnimalSubtype; label: string; emoji: string }[] = [
    { value: "fish", label: "Fish", emoji: "🐟" },
    { value: "duck", label: "Duck", emoji: "🦆" },
    { value: "goose", label: "Goose", emoji: "🪿" },
    { value: "turtle", label: "Turtle", emoji: "🐢" },
    { value: "other", label: "Other", emoji: "🤔" },
  ];
  const options = isSaltwater ? saltwaterOptions : freshwaterOptions;
  return (
    <QuestionCard question="What type of animal was it?" onBack={onBack}>
      {options.map((o) => (
        <ButtonSingleSelect
          key={o.value}
          emoji={o.emoji}
          label={o.label}
          selected={false}
          onClick={() => onSelect(o.value)}
        />
      ))}
    </QuestionCard>
  );
}

// Object subtype step
function ObjectTypeStep({
  isSaltwater,
  onSelect,
  onBack,
}: {
  isSaltwater: boolean;
  onSelect: (v: ObjectSubtype) => void;
  onBack: () => void;
}) {
  const saltwaterOptions: { value: ObjectSubtype; label: string; emoji: string }[] = [
    { value: "sandbar", label: "Sandbar", emoji: "🏖️" },
    { value: "floating-debris", label: "Floating debris", emoji: "🗑️" },
    { value: "reef", label: "Reef", emoji: "🪸" },
    { value: "submerged-object", label: "Submerged object", emoji: "⬇️" },
    { value: "other", label: "Other", emoji: "🤔" },
  ];
  const freshwaterOptions: { value: ObjectSubtype; label: string; emoji: string }[] = [
    { value: "rock", label: "Rock", emoji: "🪨" },
    { value: "log", label: "Log", emoji: "🪵" },
    { value: "stump", label: "Stump", emoji: "🌲" },
    { value: "other", label: "Other", emoji: "🤔" },
  ];
  const options = isSaltwater ? saltwaterOptions : freshwaterOptions;
  return (
    <QuestionCard question="What type of object was it?" onBack={onBack}>
      {options.map((o) => (
        <ButtonSingleSelect
          key={o.value}
          emoji={o.emoji}
          label={o.label}
          selected={false}
          onClick={() => onSelect(o.value)}
        />
      ))}
    </QuestionCard>
  );
}

// Main component — renders the correct follow-up for the entity type
// For property: shows two sub-screens (type → owner)
export function Step20EntityFollowup({ entity, isSaltwater, onContinue, onBack }: Props) {
  const [subScreen, setSubScreen] = useState<"type" | "owner">("type");
  const [propertySubtype, setPropertySubtype] = useState<PropertySubtype | null>(null);

  if (entity.type === "fixed-property") {
    if (subScreen === "type") {
      return (
        <PropertyTypeStep
          onSelect={(v) => {
            setPropertySubtype(v);
            setSubScreen("owner");
          }}
          onBack={onBack}
        />
      );
    }
    return (
      <PropertyOwnerStep
        onContinue={(name, phone) =>
          onContinue({
            propertySubtype: propertySubtype ?? undefined,
            propertyOwnerName: name || undefined,
            propertyOwnerPhone: phone || undefined,
          })
        }
        onBack={() => setSubScreen("type")}
      />
    );
  }

  if (entity.type === "animal") {
    return (
      <AnimalTypeStep
        isSaltwater={isSaltwater}
        onSelect={(v) => onContinue({ animalSubtype: v })}
        onBack={onBack}
      />
    );
  }

  if (entity.type === "object") {
    return (
      <ObjectTypeStep
        isSaltwater={isSaltwater}
        onSelect={(v) => onContinue({ objectSubtype: v })}
        onBack={onBack}
      />
    );
  }

  // boat and swimmer have no follow-up — caller should not render this component
  return null;
}
