"use client";

import React from "react";
import { ResumeZ, type ResumeData } from "@/lib/schema";
import { ZodError } from "zod";
import { cn } from "@/lib/utils";

export function JsonEditor({
  value,
  onChange,
  onValidParse,
}: {
  value: string;
  onChange: (v: string) => void;
  onValidParse: (obj: ResumeData | null, errors?: string[]) => void;
}) {
  const [errors, setErrors] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      const parsed = JSON.parse(value);
      const data = ResumeZ.parse(parsed);
      setErrors([]);
      onValidParse(data);
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

      setErrors(msgs);
      onValidParse(null, msgs);
    }
  }, [value, onValidParse]); // only re-run when the textarea value changes

  return (
    <div className="grid gap-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={cn(
          "min-h-[320px] w-full rounded-xl border p-4 font-mono text-sm leading-6 outline-none",
          "bg-neutral-950 text-neutral-100 border-neutral-800 focus:ring-2 focus:ring-indigo-500",
          "scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900"
        )}
        aria-label="Resume JSON"
      />
      {errors.length > 0 && (
        <div className="rounded-lg border border-rose-900 bg-rose-950/50 p-3 text-rose-200">
          <p className="mb-1 font-medium">
            Fix {errors.length} error(s) to render the PDF:
          </p>
          <ul className="list-disc pl-5 text-sm">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
