"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import type { GeneratedFix, LaunchQARun } from "@/lib/types";
import { seedFixes, seedRun } from "@/lib/seed";
import { loadFixes, loadRun, saveFixes } from "@/lib/clientStore";
import ResultsDashboard from "@/components/ResultsDashboard";

function StickyNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/70 backdrop-blur">
      <div className="lq-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-violet text-sm"
          >
            ◆
          </span>
          {BRAND.name}
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/setup"
            className="rounded-lg px-3 py-1.5 text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Setup
          </Link>
          <Link
            href="/results"
            className="rounded-lg px-3 py-1.5 text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Results
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function ResultsPage() {
  const [run, setRun] = useState<LaunchQARun | null>(null);
  const [fixes, setFixes] = useState<GeneratedFix[]>([]);

  useEffect(() => {
    const loadedRun = loadRun() ?? seedRun();
    setRun(loadedRun);

    const storedFixes = loadFixes();
    if (storedFixes && storedFixes.length) {
      setFixes(storedFixes);
    } else {
      const seeded = seedFixes();
      setFixes(seeded);
      // Best-effort: try to upgrade the seeded fixes with a fresh generation.
      void (async () => {
        try {
          const res = await fetch("/api/generate-fixes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ results: loadedRun.results }),
          });
          if (!res.ok) return;
          const data = (await res.json()) as { fixes?: GeneratedFix[] };
          if (data.fixes && data.fixes.length) {
            setFixes(data.fixes);
            saveFixes(data.fixes);
          }
        } catch {
          /* keep seeded fixes */
        }
      })();
    }
  }, []);

  // Seed covers the empty-storage case, so this only shows for the first paint.
  const safeRun = run ?? seedRun();
  const safeFixes = fixes.length ? fixes : seedFixes();

  return (
    <div className="min-h-screen">
      <StickyNav />

      <main className="lq-container pt-10">
        {/* header band + actions */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="lq-eyebrow">Launch readiness report</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="lq-gradient-text">AgentGrid GTM QA results</span>
            </h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
              <span className="font-medium text-slate-300">
                {safeRun.companyName}
              </span>
              <span className="text-slate-600">·</span>
              <span>{safeRun.launchGoal}</span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link href="/setup" className="lq-btn-ghost text-sm">
              Run again
            </Link>
            <Link href="/demo-site-improved" className="lq-btn-primary text-sm">
              Open improved site →
            </Link>
          </div>
        </div>
      </main>

      {/* ResultsDashboard owns its own lq-container + vertical rhythm. */}
      <ResultsDashboard run={safeRun} fixes={safeFixes} />
    </div>
  );
}
