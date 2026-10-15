import type { Metadata } from "next";
import { LabRoot } from "@/lab/LabRoot";

/** DEV-ONLY root layout of /lab/builder/ (see lab/LabRoot.tsx). */
export const metadata: Metadata = { title: "Lab · builder", robots: { index: false } };

export default LabRoot;
