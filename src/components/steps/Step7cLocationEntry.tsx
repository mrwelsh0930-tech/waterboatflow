"use client";

import { useState } from "react";
import { LatLng, LocationMethod } from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { TextInputField } from "@/components/ui/TextInputField";
import { AddressInput } from "@/components/AddressInput";

interface Props {
  method: LocationMethod;
  addressValue: string;
  locationValue: LatLng | null;
  city: string;
  stateProvince: string;
  onContinue: (address: string, location: LatLng) => void;
  onBack: () => void;
}

function parseGPS(input: string): LatLng | null {
  const parts = input.split(",").map((s) => parseFloat(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { lat: parts[0], lng: parts[1] };
  }
  return null;
}

export function Step7cLocationEntry({
  method,
  addressValue,
  locationValue,
  city,
  stateProvince,
  onContinue,
  onBack,
}: Props) {
  const [address, setAddress] = useState(addressValue);
  const [location, setLocation] = useState<LatLng | null>(locationValue);
  const [gpsInput, setGpsInput] = useState(
    locationValue ? `${locationValue.lat}, ${locationValue.lng}` : ""
  );
  const [gpsError, setGpsError] = useState("");

  if (method === "gps") {
    function handleGpsContinue() {
      const parsed = parseGPS(gpsInput);
      if (!parsed) {
        setGpsError("Please enter valid coordinates, e.g. 25.7617, -80.1918");
        return;
      }
      onContinue(`GPS: ${gpsInput}`, parsed);
    }

    return (
      <QuestionCard
        question="Enter GPS coordinates"
        helperText="Enter the latitude and longitude of the incident location."
        onContinue={handleGpsContinue}
        continueDisabled={gpsInput.trim().length === 0}
        onBack={onBack}
      >
        <TextInputField
          label="Coordinates"
          placeholder="25.7617, -80.1918"
          value={gpsInput}
          onChange={(v) => {
            setGpsInput(v);
            setGpsError("");
          }}
        />
        {gpsError && (
          <p className="text-xs text-red-500 mt-1">{gpsError}</p>
        )}
        <p className="text-xs text-[#94A3B8]">
          Format: latitude, longitude (decimal degrees)
        </p>
      </QuestionCard>
    );
  }

  // Starting location — AddressInput manages its own confirm button
  return (
    <div className="w-full max-w-[393px]">
      <AddressInput
        onConfirm={onContinue}
        title="Where did you depart from?"
        subtitle="Search for a marina, dock, pier, ramp, or address near the incident."
        placeholder="e.g. Marina Bay, Pier 39, or 123 Harbor Rd"
        locationBias={{ state: stateProvince, city }}
      />
    </div>
  );
}
