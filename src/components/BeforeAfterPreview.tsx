"use client";

import { useState } from "react";
import Link from "next/link";

type TabId = "original" | "improved";

function tabClass(isActive: boolean): string {
  return [
    "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
    isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200",
  ].join(" ");
}

/**
 * Tabbed before/after preview of the demo site, rendered live in an iframe.
 * Switching tabs is instant (just swaps the iframe src).
 */
export default function BeforeAfterPreview({
  originalUrl = "/demo-site",
  improvedUrl = "/demo-site-improved",
}: {
  originalUrl?: string;
  improvedUrl?: string;
}) {
  const [active, setActive] = useState<TabId>("original");

  const isOriginal = active === "original";
  const url = isOriginal ? originalUrl : improvedUrl;
  const caption = isOriginal
    ? "Abstract hero, generic CTA, no quickstart or trust block."
    : "Clear 10-minute hero, starter template, security block, role selector.";
  const title = isOriginal
    ? "Original demo site preview"
    : "Improved demo site preview";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setActive("original")}
            className={tabClass(isOriginal)}
          >
            Original Site
          </button>
          <button
            type="button"
            onClick={() => setActive("improved")}
            className={tabClass(!isOriginal)}
          >
            Improved Site
          </button>
        </div>

        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand-400 transition-colors hover:text-brand-50"
        >
          Open in new tab ↗
        </Link>
      </div>

      <p className="mt-3 text-sm text-slate-400">{caption}</p>

      <div className="lq-card mt-3 p-2">
        <iframe
          key={active}
          src={url}
          title={title}
          className="h-[460px] w-full rounded-xl border border-white/10 bg-white"
        />
      </div>
    </div>
  );
}
