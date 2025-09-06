"use client";

import React, { Suspense } from "react";
import { JsonEditor } from "@/components/JsonEditor";
import { ResumePreview } from "@/components/ResumePDF";
import { Toolbar } from "@/components/ToolBar";
import { SAMPLE_JSON } from "@/lib/sample";
import type { ResumeData } from "@/lib/schema";
import { FileText, Code } from "lucide-react";

export default function HomePage() {
  return (
    <main className="mx-auto grid h-dvh max-w-7xl grid-rows-[auto,1fr] gap-6 p-6">
      {/* HEADER */}
      <header className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-950/80 to-neutral-900/60 backdrop-blur p-5 shadow-lg">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Jobsforce{" "}
          <span className="font-light text-neutral-400">
            — JSON ➜ Resume PDF
          </span>
        </h1>
        <span className="rounded-full border border-neutral-700 bg-neutral-800/50 px-3 py-1 text-xs font-medium text-neutral-300">
          Frontend-only • Paste JSON • Preview • Download
        </span>
      </header>

      {/* WORKSPACE */}
      <Workspace />
    </main>
  );
}

function Workspace() {
  const [raw, setRaw] = React.useState<string>(SAMPLE_JSON);
  const [data, setData] = React.useState<ResumeData | null>(null);
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleValidParse = React.useCallback(
    (obj: ResumeData | null, errs?: string[]) => {
      setData(obj);
      setErrors(errs ?? []);
    },
    []
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* JSON EDITOR */}
      <section className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 shadow-md backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-2 text-neutral-100">
            <Code className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold">Step 1: Paste JSON</h2>
          </div>
          <Toolbar data={data} />
        </div>

        <JsonEditor
          value={raw}
          onChange={setRaw}
          onValidParse={handleValidParse}
        />
      </section>

      {/* PDF PREVIEW */}
      <section className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 shadow-md backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-2 border-b border-neutral-800 pb-2 text-neutral-100">
          <FileText className="h-5 w-5 text-sky-400" />
          <h2 className="text-lg font-semibold">Step 2: Live PDF Preview</h2>
        </div>

        <div className="relative flex h-full min-h-[70vh] items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/40">
          {data && errors.length === 0 ? (
            <Suspense
              fallback={
                <div className="p-4 text-neutral-400">Rendering PDF…</div>
              }
            >
              <div className="h-full w-full">
                <ResumePreview data={data} />
              </div>
            </Suspense>
          ) : (
            <div className="flex flex-col items-center text-center text-neutral-500">
              <FileText className="mb-2 h-10 w-10 opacity-60" />
              <p className="text-sm">
                Provide valid JSON to render the PDF preview.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
