import type { Metadata } from "next";
import { LabRoot } from "@/lab/LabRoot";

/** DEV-ONLY root layout of /lab/edge/ (see lab/LabRoot.tsx). */
export const metadata: Metadata = { title: "Lab · edge", robots: { index: false } };

export default LabRoot;
