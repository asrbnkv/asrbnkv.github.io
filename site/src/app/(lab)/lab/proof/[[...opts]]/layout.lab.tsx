import type { Metadata } from "next";
import { LabRoot } from "@/lab/LabRoot";

/** DEV-ONLY root layout of /lab/proof/ (see lab/LabRoot.tsx). */
export const metadata: Metadata = { title: "Lab · proof", robots: { index: false } };

export default LabRoot;
