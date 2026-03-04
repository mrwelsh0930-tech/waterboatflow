"use client";

import { useState } from "react";
import { LatLng } from "@/types/reconstruction";
import { AddressInput } from "./AddressInput";

interface EmbarkationInputProps {
  onConfirm: (address: string, location: LatLng) => void;
  locationBias?: { state: string; city: string } | null;
}

type Mode = "choice" | "address" | "gps";

export function EmbarkationInput({ onConfirm, locationBias = null }: EmbarkationInputProps) {
  const [mode, setMode] = useState<Mode>("choice");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  const isValidGps =
    lat.trim() !== "" &&
    lng.trim() !== "" &&
    !isNaN(parsedLat) &&
    !isNaN(parsedLng) &&
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    parsedLng >= -180 &&
    parsedLng <= 180;

  const handleGpsConfirm = () => {
    if (!isValidGps) return;
    onConfirm(`GPS: ${parsedLat.toFixed(6)}, ${parsedLng.toFixed(6)}`, {
      lat: parsedLat,
      lng: parsedLng,
    });
  };

  // GPS input screen
  if (mode === "gps") {
    return (
      <div className="flex flex-col items-center w-full">
        <h2 className="font-medium text-[18px] leading-[28px] tracking-[-0.26px] text-[#475569] text-center mb-[10px]">
          Enter GPS coordinates
        </h2>
        <p className="font-normal text-[14px] leading-[20px] tracking-[-0.09px] text-[#475569] text-center mb-6">
          Enter the latitude and longitude of where the incident occurred.
        </p>

        <div className="w-full space-y-4 mb-6">
          <div>
            <label className="block text-[12px] text-[#94A3B8] uppercase tracking-wide mb-1">
              Latitude
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="e.g. 25.761681"
              className="w-full h-[55px] px-4 border border-[#D4D4D4] rounded-[8px] text-[16px] text-[#475569] placeholder:text-[#94A3B8] focus:border-[#1660F4] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[12px] text-[#94A3B8] uppercase tracking-wide mb-1">
              Longitude
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="e.g. -80.191788"
              className="w-full h-[55px] px-4 border border-[#D4D4D4] rounded-[8px] text-[16px] text-[#475569] placeholder:text-[#94A3B8] focus:border-[#1660F4] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {lat.trim() !== "" && lng.trim() !== "" && !isValidGps && (
          <p className="text-[12px] text-red-500 mb-4">
            Latitude must be -90 to 90, longitude must be -180 to 180.
          </p>
        )}

        <button
          onClick={handleGpsConfirm}
          disabled={!isValidGps}
          className="w-full h-[48px] rounded-[8px] text-[14px] font-medium transition-colors disabled:bg-[#E2E8F0] disabled:text-[#94A3B8] bg-[#1660F4] text-white active:bg-[#1250D4]"
        >
          Confirm coordinates
        </button>

        <button
          onClick={() => { setMode("choice"); setLat(""); setLng(""); }}
          className="mt-4 text-[14px] text-[#94A3B8] font-medium active:text-[#475569]"
        >
          &larr; Back
        </button>
      </div>
    );
  }

  // Address input screen
  if (mode === "address") {
    return (
      <div className="flex flex-col items-center w-full">
        <AddressInput
          onConfirm={onConfirm}
          title="Where did you embark from?"
          subtitle="Enter the address or name of the marina, dock, pier, port, or nearby landmark where you embarked."
          helpText="You can search by marina name, dock name, pier, port, or any nearby landmark."
          placeholder="e.g. Marina Bay, Pier 39, or 123 Harbor Rd"
          locationBias={locationBias}
        />
        <button
          onClick={() => setMode("choice")}
          className="mt-4 text-[14px] text-[#94A3B8] font-medium active:text-[#475569]"
        >
          &larr; Back
        </button>
      </div>
    );
  }

  // Choice screen
  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-medium text-[18px] leading-[28px] tracking-[-0.26px] text-[#475569] text-center mb-8">
        How would you like to identify the location of the incident?
      </h2>

      <div className="w-full space-y-3">
        <button
          onClick={() => setMode("address")}
          className="w-full flex items-center gap-4 p-4 border border-[#D4D4D4] rounded-[8px] hover:border-[#1660F4] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-all text-left"
        >
          <span className="text-3xl">{"\u{1F4CD}"}</span>
          <div>
            <p className="font-medium text-[14px] leading-[20px] text-[#475569]">Where you embarked from</p>
            <p className="font-normal text-[14px] leading-[20px] tracking-[-0.09px] text-[#94A3B8]">Search by marina, dock, pier, or address</p>
          </div>
        </button>

        <button
          onClick={() => setMode("gps")}
          className="w-full flex items-center gap-4 p-4 border border-[#D4D4D4] rounded-[8px] hover:border-[#1660F4] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-all text-left"
        >
          <span className="text-3xl">{"\u{1F30E}"}</span>
          <div>
            <p className="font-medium text-[14px] leading-[20px] text-[#475569]">GPS coordinates</p>
            <p className="font-normal text-[14px] leading-[20px] tracking-[-0.09px] text-[#94A3B8]">Enter latitude and longitude</p>
          </div>
        </button>
      </div>
    </div>
  );
}
