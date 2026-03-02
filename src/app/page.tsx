import { Suspense } from "react";
import { BoatReconstructionFlow } from "@/components/BoatReconstructionFlow";

export default function Home() {
  return (
    <Suspense>
      <BoatReconstructionFlow />
    </Suspense>
  );
}
