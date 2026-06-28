"use client";

import { useState } from "react";
import type { GeneratedFix } from "@/lib/types";

/** Impact pill colors: High = rose, Medium = amber, Low = slate. */
const IMPACT_CLASS: Record<GeneratedFix["impact"], string> = {
  High: "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30",
  Medium: "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30",
  Low: "bg-white/10 text-slate-300 ring-1 ring-inset ring-white/15",
};

/**
 * A single generated fix: who it affects, the issue/evidence/recommendation,
 * and a copy-to-clipboard block of ready-to-ship copy.
 */
export default function FixCard({
  fix,
  index,
}: {
  fix: GeneratedFix;
  index?: number;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy(): void {
    void navigator.clipboard.writeText(fix.generatedCopy).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div
      className="lq-card lq-card-hover flex animate-fade-in-up flex-col p-5"
      style={
        index === undefined ? undefined : { animationDelay: `${index * 60}ms` }
      }
    >
      {/* top row: affected persona + impact */}
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300">
          {fix.affectedPersona}
        </span>
        <span className={`lq-badge ${IMPACT_CLASS[fix.impact]}`}>
          {fix.impact} impact
        </span>
      </div>

      <h3 className="mt-3 text-base font-semibold text-white">{fix.title}</h3>

      <div className="mt-3 space-y-2.5 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Issue
          </p>
          <p className="mt-0.5 text-slate-300">{fix.issue}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Evidence
          </p>
          <p className="mt-0.5 text-slate-400">{fix.evidence}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Recommendation
          </p>
          <p className="mt-0.5 text-slate-300">{fix.recommendation}</p>
        </div>
      </div>

      {/* generated copy */}
      <div className="mt-4">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Generated copy
        </p>
        <div className="relative rounded-lg border border-white/10 bg-ink-950/60 p-3">
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2 top-2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-slate-300 transition-colors hover:bg-white/10"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <p className="whitespace-pre-wrap pr-16 font-mono text-xs text-slate-200">
            {fix.generatedCopy}
          </p>
        </div>
      </div>
    </div>
  );
}
