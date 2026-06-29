"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import type {
  GeneratedFix,
  LaunchQARun,
  PersonaId,
  PersonaResult,
} from "@/lib/types";
import { DEFAULT_PERSONA_IDS, getPersona } from "@/lib/personas";
import { seedResults, seedRun } from "@/lib/seed";
import {
  loadConfig,
  saveFixes,
  saveRun,
  type SetupConfig,
} from "@/lib/clientStore";
import PersonaRunCard from "@/components/PersonaRunCard";

type RunMode = "fallback" | "ai" | "browser";

type RunResponse = {
  runId: string;
  mode: RunMode;
  results: PersonaResult[];
  run: LaunchQARun;
};

const MODE_PILL: Record<RunMode, string> = {
  fallback: "Fallback mode",
  ai: "AI mode",
  browser: "Live browser",
};

const TICK_MS = 750;

/** Build a result-shaped placeholder per persona so cards can render a mission
 * while the API is still working. We keep revealedSteps at 0 + done false so
 * nothing leaks before the real run resolves. */
function placeholderResults(personaIds: PersonaId[]): Record<PersonaId, PersonaResult> {
  const seeds = seedResults();
  const map = {} as Record<PersonaId, PersonaResult>;
  for (const id of personaIds) {
    const seed = seeds.find((r) => r.personaId === id);
    if (seed) {
      map[id] = { ...seed, journey: [] };
    } else {
      const persona = getPersona(id);
      map[id] = {
        personaId: id,
        personaName: persona.name,
        mission: persona.mission,
        outcome: "partial",
        score: 0,
        journey: [],
        confusionPoint: "",
        quote: "",
        conversionBlocker: "",
        recommendedFix: "",
      };
    }
  }
  return map;
}

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

export default function RunPage() {
  const [personaIds, setPersonaIds] = useState<PersonaId[]>(DEFAULT_PERSONA_IDS);
  const [config, setConfig] = useState<SetupConfig | null>(null);
  const [results, setResults] = useState<Record<PersonaId, PersonaResult> | null>(
    null,
  );
  const [mode, setMode] = useState<RunMode | null>(null);
  const [revealed, setRevealed] = useState<Record<PersonaId, number>>(
    {} as Record<PersonaId, number>,
  );
  const [done, setDone] = useState<Record<PersonaId, boolean>>(
    {} as Record<PersonaId, boolean>,
  );

  // Guards so the run is kicked off exactly once even under StrictMode.
  const startedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1) Read config + kick off the run once on mount.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const cfg = loadConfig();
    setConfig(cfg);
    const ids =
      cfg?.personas && cfg.personas.length ? cfg.personas : DEFAULT_PERSONA_IDS;
    setPersonaIds(ids);

    // Initialise reveal/done maps so cards render in a running state immediately.
    const initReveal = {} as Record<PersonaId, number>;
    const initDone = {} as Record<PersonaId, boolean>;
    for (const id of ids) {
      initReveal[id] = 0;
      initDone[id] = false;
    }
    setRevealed(initReveal);
    setDone(initDone);

    const body = {
      companyName: cfg?.companyName ?? "AgentGrid",
      websiteUrl: cfg?.websiteUrl ?? "/demo-site",
      launchGoal:
        cfg?.launchGoal ?? "Convert developers and enterprise buyers before launch",
      personas: ids,
    };

    // A real AI-mode run takes ~10-15s; never let a hung/slow call leave the
    // demo stuck on the loading screen — abort after 35s and seed-fallback.
    const isLive =
      /^https?:\/\//i.test(body.websiteUrl) &&
      !/localhost|127\.0\.0\.1/i.test(body.websiteUrl);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      isLive ? 90000 : 35000,
    );

    (async () => {
      try {
        const res = await fetch("/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`run failed: ${res.status}`);
        const data = (await res.json()) as RunResponse;

        const map = {} as Record<PersonaId, PersonaResult>;
        for (const id of ids) {
          const r = data.results.find((x) => x.personaId === id);
          if (r) map[id] = r;
        }
        setResults(map);
        setMode(data.mode);
        saveRun(data.run);

        // Best-effort: upgrade fixes in the background; never block the demo.
        void (async () => {
          try {
            const fixRes = await fetch("/api/generate-fixes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ results: data.results }),
            });
            if (!fixRes.ok) return;
            const fixData = (await fixRes.json()) as {
              fixes?: GeneratedFix[];
            };
            if (fixData.fixes && fixData.fixes.length) saveFixes(fixData.fixes);
          } catch {
            /* ignore — results page seeds fixes if missing */
          }
        })();
      } catch {
        // Fall back to seeded data so the demo still animates convincingly.
        const fallback = seedRun();
        const map = {} as Record<PersonaId, PersonaResult>;
        for (const id of ids) {
          const r = fallback.results.find((x) => x.personaId === id);
          if (r) map[id] = r;
        }
        setResults(map);
        setMode("fallback");
        saveRun({ ...fallback, personas: ids, results: Object.values(map) });
      } finally {
        window.clearTimeout(timeoutId);
      }
    })();
    // No cleanup-cancel here: `startedRef` guarantees this block runs exactly
    // once, so we must NOT abort the single in-flight run during StrictMode's
    // dev-only mount→unmount→mount cycle (that would drop the only fetch and
    // leave the animation stuck). setState on an unmounted component is a safe
    // no-op in React 19.
  }, []);

  // 2) Once results are available, progressively reveal each journey. A single
  // interval drives every persona; persona i only starts revealing after i
  // ticks so the four agents stagger instead of marching in lockstep.
  useEffect(() => {
    if (!results) return;
    const snapshot = results;
    const ids = personaIds;
    let tick = 0;

    intervalRef.current = setInterval(() => {
      tick += 1;
      setRevealed((prev) => {
        const next = { ...prev };
        let active = false;
        ids.forEach((id, i) => {
          const journeyLen = snapshot[id]?.journey.length ?? 0;
          const current = prev[id] ?? 0;
          if (current < journeyLen) {
            active = true;
            // Gate the first increment on the persona's stagger offset.
            if (tick > i) next[id] = current + 1;
          }
        });
        if (!active && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return next;
      });
    }, TICK_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  // 3) Flip done=true for a persona when its journey is fully revealed.
  useEffect(() => {
    if (!results) return;
    setDone((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const id of personaIds) {
        const journeyLen = results[id]?.journey.length ?? 0;
        const isDone = journeyLen > 0 && (revealed[id] ?? 0) >= journeyLen;
        if (isDone && !prev[id]) {
          next[id] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [revealed, results, personaIds]);

  const skip = () => {
    if (!results) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const fullReveal = {} as Record<PersonaId, number>;
    const allDone = {} as Record<PersonaId, boolean>;
    for (const id of personaIds) {
      fullReveal[id] = results[id]?.journey.length ?? 0;
      allDone[id] = true;
    }
    setRevealed(fullReveal);
    setDone(allDone);
  };

  const placeholders = useMemo(
    () => placeholderResults(personaIds),
    [personaIds],
  );

  const resultFor = (id: PersonaId): PersonaResult =>
    results?.[id] ?? placeholders[id];

  const completeCount = personaIds.filter((id) => done[id]).length;
  const allDone = personaIds.length > 0 && completeCount === personaIds.length;
  const websiteUrl = config?.websiteUrl ?? "/demo-site";
  const targetName = config?.companyName?.trim() || "AgentGrid";

  return (
    <div className="min-h-screen">
      <StickyNav />

      <main className="lq-container py-10">
        {/* header band */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="lq-eyebrow flex items-center gap-2">
              <span
                aria-hidden
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400"
              />
              Live run
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="lq-gradient-text">
                AI personas are testing {targetName}
              </span>
            </h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
              <span>Website under test</span>
              <span className="text-slate-600">·</span>
              <code className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-xs text-slate-300 ring-1 ring-inset ring-white/10">
                {websiteUrl}
              </code>
              {results && mode ? (
                <span className="lq-badge lq-badge-running">{MODE_PILL[mode]}</span>
              ) : (
                <span className="lq-badge lq-badge-running">
                  <span aria-hidden className="flex items-end gap-0.5">
                    <span className="h-1 w-1 animate-bounce rounded-full bg-brand-400 [animation-delay:0ms]" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-brand-400 [animation-delay:150ms]" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-brand-400 [animation-delay:300ms]" />
                  </span>
                  Agents working
                </span>
              )}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button type="button" onClick={skip} className="lq-btn-ghost text-sm">
              Skip animation
            </button>
          </div>
        </div>

        {/* progress + view results */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-violet transition-all duration-500"
                style={{
                  width: `${
                    personaIds.length
                      ? (completeCount / personaIds.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <p className="text-sm text-slate-400">
              {completeCount} of {personaIds.length} personas complete
            </p>
          </div>

          <Link
            href="/results"
            className={[
              "lq-btn-primary text-sm transition",
              allDone ? "" : "pointer-events-none opacity-40",
            ].join(" ")}
            aria-disabled={!allDone}
            tabIndex={allDone ? 0 : -1}
          >
            View full results →
          </Link>
        </div>

        {/* persona cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {personaIds.map((id) => (
            <div key={id} className="animate-fade-in-up">
              <PersonaRunCard
                persona={getPersona(id)}
                result={resultFor(id)}
                revealedSteps={revealed[id] ?? 0}
                done={done[id] ?? false}
                loading={!results}
              />
            </div>
          ))}
        </div>

        {/* all-done banner */}
        {allDone && (
          <div className="mt-10 animate-fade-in-up rounded-2xl border border-brand-500/30 bg-gradient-to-r from-brand-500/10 to-accent-violet/10 p-6 text-center">
            <p className="text-lg font-semibold text-white">
              All {personaIds.length} personas finished their runs.
            </p>
            <p className="mt-1 text-sm text-slate-400">
              See where each persona stalled and the generated fixes.
            </p>
            <div className="mt-4 flex justify-center">
              <Link href="/results" className="lq-btn-primary">
                View full results →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
