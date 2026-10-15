import type { Metadata } from "next";
import { LabRoot } from "@/lab/LabRoot";

/** DEV-ONLY root layout of /lab/about/ (see lab/LabRoot.tsx). */
export const metadata: Metadata = { title: "Lab · about", robots: { index: false } };

export default LabRoot;
