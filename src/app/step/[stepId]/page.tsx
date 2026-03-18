"use client";

import { use } from "react";
import { FNOLFlow } from "@/components/FNOLFlow";

interface Props {
  params: Promise<{ stepId: string }>;
}

export default function StepPage({ params }: Props) {
  const { stepId } = use(params);
  const stepIdNum = parseInt(stepId, 10);
  return <FNOLFlow stepId={stepIdNum} />;
}
