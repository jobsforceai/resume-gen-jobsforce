"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function JsonEditor({
  value,
  onChange,
  errors,
}: {
  value: string;
  onChange: (v: string) => void;
  errors: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid gap-2"
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={cn(
          "min-h-[320px] w-full rounded-xl border p-4 font-mono text-sm leading-6 outline-none",
          "bg-slate-950 text-slate-100 border-slate-800 focus:ring-2 focus:ring-indigo-500",
          "scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
        )}
        aria-label="Resume JSON"
      />
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-rose-900 bg-rose-950/50 p-3 text-rose-200"
        >
          <p className="mb-1 font-medium">
            Fix {errors.length} error(s) to render the PDF:
          </p>
          <ul className="list-disc pl-5 text-sm">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}