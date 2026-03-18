"use client";

import { AssuredHeader } from "@/components/AssuredHeader";
import { StateCityInput } from "@/components/StateCityInput";

interface Props {
  onContinue: (state: string, city: string) => void;
  onBack: () => void;
}

// StateCityInput manages its own internal state and continue button
export function Step5StateCity({ onContinue, onBack }: Props) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[393px]">
      <AssuredHeader onBack={onBack} showBack />
      <StateCityInput onConfirm={onContinue} />
    </div>
  );
}
