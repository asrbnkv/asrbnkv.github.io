import type { Metadata } from "next";
import { LabRoot } from "@/lab/LabRoot";

/** DEV-ONLY root layout of /lab/footer/ (see lab/LabRoot.tsx). */
export const metadata: Metadata = { title: "Lab · footer", robots: { index: false } };

export default LabRoot;
