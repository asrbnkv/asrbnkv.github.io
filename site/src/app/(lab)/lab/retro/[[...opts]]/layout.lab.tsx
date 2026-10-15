import type { Metadata } from "next";
import { LabRoot } from "@/lab/LabRoot";

/** DEV-ONLY root layout of /lab/retro/ (see lab/LabRoot.tsx). */
export const metadata: Metadata = { title: "Lab · retro", robots: { index: false } };

export default LabRoot;
