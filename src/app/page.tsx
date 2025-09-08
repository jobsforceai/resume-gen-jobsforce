"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { JsonEditor } from "@/components/JsonEditor";
import { Toolbar } from "@/components/ToolBar";
import { SAMPLE_JSON } from "@/lib/sample";
import { ResumeZ, type ResumeData } from "@/lib/schema";
import { ZodError } from "zod";
import { FileText, Code } from "lucide-react";

const ResumePreview = dynamic(
  () => import("@/components/ResumePDF").then((mod) => mod.ResumePreview),
  {
    ssr: false,
    loading: () => <div className="p-4 text-slate-400">Loading Preview...</div>,
  }
);

export default function HomePage() {
  return (
    <main className="mx-auto grid h-dvh max-w-7xl grid-rows-[auto,1fr] gap-6 p-6">
      {/* HEADER */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="flex items-center justify-between rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950/80 to-slate-900/60 p-5 shadow-lg backdrop-blur"
      >
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Jobsforce{" "}
          <span className="font-light text-slate-400">
            — JSON ➜ Resume PDF
          </span>
        </h1>
        <span className="rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-xs font-medium text-slate-300">
          Frontend-only • Paste JSON • Preview • Download
        </span>
      </motion.header>

      {/* WORKSPACE */}
      <Workspace />
    </main>
  );
}

function Workspace() {
  const [raw, setRaw] = React.useState<string>(SAMPLE_JSON);
  const [data, setData] = React.useState<ResumeData | null>(null);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [previewKey, setPreviewKey] = React.useState(0);

  const handleApply = React.useCallback(() => {
    try {
      const parsed = JSON.parse(raw);
      const result = ResumeZ.parse(parsed);
      setData(result);
      setErrors([]);
      setPreviewKey((k) => k + 1); // Force re-render
    } catch (e: unknown) {
      const msgs: string[] = [];
      if (e instanceof ZodError) {
        for (const issue of e.issues) {
          const path = issue.path.map(String).join(".");
          msgs.push(`${path}: ${issue.message}`);
        }
      } else if (e instanceof Error) {
        msgs.push(e.message || "Invalid JSON");
      } else {
        msgs.push("Invalid JSON");
      }
      setData(null);
      setErrors(msgs);
    }
  }, [raw]);

  // Parse once on initial load
  React.useEffect(() => {
    handleApply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* JSON EDITOR */}
      <motion.section
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-md backdrop-blur-sm"
      >
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-slate-100">
            <Code className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold">Step 1: Paste JSON</h2>
          </div>
          <Toolbar data={data} onApply={handleApply} />
        </div>

        <JsonEditor value={raw} onChange={setRaw} errors={errors} />
      </motion.section>

      {/* PDF PREVIEW */}
      <motion.section
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-md backdrop-blur-sm"
      >
        <div className="mb-3 flex items-center gap-2 border-b border-slate-800 pb-2 text-slate-100">
          <FileText className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-semibold">Step 2: Live PDF Preview</h2>
        </div>

        <div className="relative flex h-full min-h-[70vh] items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
          {data && errors.length === 0 ? (
            <div className="h-full w-full">
              <ResumePreview data={data} key={previewKey} />
            </div>
          ) : (
            <div className="flex flex-col items-center text-center text-slate-500">
              <FileText className="mb-2 h-10 w-10 opacity-60" />
              <p className="text-sm">
                Provide valid JSON to render the PDF preview.
              </p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
