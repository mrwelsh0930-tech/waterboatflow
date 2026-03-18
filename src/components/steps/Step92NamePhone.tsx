"use client";

import { useState } from "react";

interface Props {
  fullName: string;
  phone: string;
  onContinue: (fullName: string, phone: string) => void;
  onBack: () => void;
}

export function Step92NamePhone({ fullName: initialName, phone: initialPhone, onContinue, onBack }: Props) {
  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);

  const isValid = fullName.trim().length >= 2 && phone.trim().length >= 10;

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-medium text-[18px] leading-[28px] tracking-[-0.26px] text-[#475569] text-center mb-[10px]">
        So we can get in touch, let&apos;s begin with your name and phone number.
      </h2>

      <div className="w-full space-y-3 mb-6">
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          className="w-full h-[55px] px-4 border border-[#D4D4D4] rounded-[8px] text-[16px] text-[#475569] placeholder:text-[#94A3B8] focus:border-[#1660F4] focus:outline-none transition-colors"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="w-full h-[55px] px-4 border border-[#D4D4D4] rounded-[8px] text-[16px] text-[#475569] placeholder:text-[#94A3B8] focus:border-[#1660F4] focus:outline-none transition-colors"
        />
      </div>

      <p className="text-[11px] leading-[16px] text-[#94A3B8] text-center mb-6">
        By clicking &ldquo;I Agree and Continue,&rdquo; you agree to the Assured{" "}
        <span className="underline">Privacy Policy</span> and{" "}
        <span className="underline">Terms of Service</span>. You also agree to receive automated texts about your claim status from or on behalf of Progressive.
      </p>

      <button
        onClick={() => isValid && onContinue(fullName.trim(), phone.trim())}
        disabled={!isValid}
        className="w-full h-[55px] bg-[#1660F4] rounded-[8px] text-white text-[16px] font-medium active:bg-[#1250D4] transition-colors disabled:bg-[#94A3B8] disabled:cursor-not-allowed"
      >
        I Agree and Continue
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
