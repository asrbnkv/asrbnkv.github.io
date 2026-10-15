import type { Metadata } from "next";
import { LabRoot } from "@/lab/LabRoot";

/** DEV-ONLY root layout of /lab/method/ (see lab/LabRoot.tsx). */
export const metadata: Metadata = { title: "Lab · method", robots: { index: false } };

export default LabRoot;
