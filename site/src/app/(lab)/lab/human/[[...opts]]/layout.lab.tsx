import type { Metadata } from "next";
import { LabRoot } from "@/lab/LabRoot";

/** DEV-ONLY root layout of /lab/human/ (see lab/LabRoot.tsx). */
export const metadata: Metadata = { title: "Lab · human", robots: { index: false } };

export default LabRoot;
