import type { Metadata } from "next";
import { LabRoot } from "@/lab/LabRoot";

/** DEV-ONLY root layout of /lab/work/ (see lab/LabRoot.tsx). */
export const metadata: Metadata = { title: "Lab · work", robots: { index: false } };

export default LabRoot;
