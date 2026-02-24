"use client";

import { useState } from "react";

interface StateCityInputProps {
  onConfirm: (state: string, city: string) => void;
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

export function StateCityInput({ onConfirm }: StateCityInputProps) {
  const [selectedState, setSelectedState] = useState("");
  const [city, setCity] = useState("");

  const handleContinue = () => {
    if (selectedState && city.trim()) {
      onConfirm(selectedState, city.trim());
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-medium text-[18px] leading-[28px] tracking-[-0.26px] text-[#475569] text-center mb-[10px]">
        Where did the incident happen?
      </h2>
      <p className="font-normal text-[14px] leading-[20px] tracking-[-0.09px] text-[#475569] text-center mb-8">
        Select the state and city.
      </p>

      <div className="w-full space-y-4">
        <div>
          <label className="block font-medium text-[14px] leading-[20px] text-[#475569] mb-2">
            State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full h-[55px] px-4 border border-[#D4D4D4] rounded-[8px] text-[16px] text-[#475569] bg-white focus:border-[#1660F4] focus:outline-none transition-colors appearance-none"
          >
            <option value="">Select a state</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-[14px] leading-[20px] text-[#475569] mb-2">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Miami Beach"
            className="w-full h-[55px] px-4 border border-[#D4D4D4] rounded-[8px] text-[16px] text-[#475569] placeholder:text-[#94A3B8] focus:border-[#1660F4] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {selectedState && city.trim() && (
        <button
          onClick={handleContinue}
          className="w-full h-[55px] bg-[#1660F4] rounded-[8px] text-white text-[16px] font-normal leading-[24px] active:bg-[#1250D4] transition-colors mt-8"
        >
          Continue
        </button>
      )}
    </div>
  );
}
