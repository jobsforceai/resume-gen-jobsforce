"use client";

import React from "react";
import { downloadPdf } from "./ResumePDF";
import type { ResumeData } from "@/lib/schema";

export function Toolbar({ data }: { data: ResumeData | null }) {
  const canDownload = !!data;
  return (
    <div className="flex items-center gap-2">
      <button
        disabled={!canDownload}
        onClick={() => data && downloadPdf(data)}
        className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Download PDF
      </button>
    </div>
  );
}
