import type { Metadata } from "next";
import { LabRoot } from "@/lab/LabRoot";

/** DEV-ONLY root layout of /lab/contact/ (see lab/LabRoot.tsx). */
export const metadata: Metadata = { title: "Lab · contact", robots: { index: false } };

export default LabRoot;
