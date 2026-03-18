"use client";

import { useState } from "react";

interface Props {
  incidentDate: string;
  incidentTime: string;
  onContinue: (date: string, time: string) => void;
  onBack: () => void;
}

function todayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function currentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function Step93IncidentDate({ incidentDate: initialDate, incidentTime: initialTime, onContinue, onBack }: Props) {
  const [date, setDate] = useState(initialDate || todayDate());
  const [time, setTime] = useState(initialTime || currentTime());

  const isValid = date.length > 0 && time.length > 0;

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-medium text-[18px] leading-[28px] tracking-[-0.26px] text-[#475569] text-center mb-8">
        When did the incident occur?
      </h2>

      <div className="w-full space-y-3 mb-8">
        <input
          type="date"
          value={date}
          max={todayDate()}
          onChange={(e) => setDate(e.target.value)}
          className="w-full h-[55px] px-4 border border-[#D4D4D4] rounded-[8px] text-[16px] text-[#475569] focus:border-[#1660F4] focus:outline-none transition-colors"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full h-[55px] px-4 border border-[#D4D4D4] rounded-[8px] text-[16px] text-[#475569] focus:border-[#1660F4] focus:outline-none transition-colors"
        />
      </div>

      <button
        onClick={() => isValid && onContinue(date, time)}
        disabled={!isValid}
        className="w-full h-[55px] bg-[#1660F4] rounded-[8px] text-white text-[16px] font-medium active:bg-[#1250D4] transition-colors disabled:bg-[#94A3B8] disabled:cursor-not-allowed"
      >
        Continue
      </button>

      <button
        onClick={onBack}
        className="mt-4 text-[14px] text-[#94A3B8] font-medium active:text-[#475569]"
      >
        ← Back
      </button>
    </div>
  );
}
