"use client";

import React from "react";
import { motion } from "framer-motion";
import { downloadPdf } from "./ResumePDF";
import type { ResumeData } from "@/lib/schema";

export function Toolbar({
  data,
  onApply,
}: {
  data: ResumeData | null;
  onApply: () => void;
}) {
  const canDownload = !!data;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2"
    >
      <button
        onClick={onApply}
        className="rounded-xl bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-500"
      >
        Apply Changes
      </button>
      <button
        disabled={!canDownload}
        onClick={() => data && downloadPdf(data)}
        className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Download PDF
      </button>
    </motion.div>
  );
}