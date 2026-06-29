"use client";

import { useRef, useState } from "react";
import type { Outcome, PersonaResult } from "@/lib/types";
import { getPersona, PERSONA_THEME } from "@/lib/personas";
import { DEVELOPER_IMPROVED_RESULT, getFallbackResult } from "@/lib/fallbackAgent";
import { OUTCOME_LABEL, scoreTone } from "@/lib/score";
import PersonaRunCard from "@/components/PersonaRunCard";

const SCORE_TEXT: Record<"success" | "partial" | "failure", string> = {
  success: "text-emerald-300",
  partial: "text-amber-300",
  failure: "text-rose-300",
};

const BADGE_CLASS: Record<Outcome, string> = {
  success: "lq-badge-success",
  partial: "lq-badge-partial",
  failure: "lq-badge-failure",
};

/**
 * The "wow" payoff: re-run the Developer persona on the improved site and watch
 * it go from blocked to activated. The improved journey is deterministic
 * (DEVELOPER_IMPROVED_RESULT) so the moment lands the same every demo.
 */
export default function ReRunMoment({ before }: { before?: PersonaResult }) {
  const developer = getPersona("developer");
  const theme = PERSONA_THEME.developer;
  const original = before ?? getFallbackResult("developer");
  const improved = DEVELOPER_IMPROVED_RESULT;

  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function rerun() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStarted(true);
    setRevealed(0);
    setDone(false);
    const total = improved.journey.length;
    let step = 0;
    intervalRef.current = setInterval(() => {
      step += 1;
      setRevealed(step);
      if (step >= total) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDone(true);
      }
    }, 700);
  }

  const delta = improved.score - original.score;
  const improvedWins = improved.score > original.score;

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold text-white">
        The payoff — re-run after the fixes ship
      </h2>
      <p className="mb-4 text-sm text-slate-400">
        Same persona, same mission — now pointed at{" "}
        <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-slate-300 ring-1 ring-inset ring-white/10">
          /demo-site-improved
        </code>
        . Watch the Developer go from blocked to activated.
      </p>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        {/* BEFORE — compact summary of the original run */}
        <div className="lq-card p-5 sm:p-6">
          <p className="lq-eyebrow mb-3 text-slate-500">Before · Original site</p>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-lg ring-1 ${theme.ring}`}
              >
                <span aria-hidden>{theme.emoji}</span>
              </div>
              <div>
                <p className="font-semibold text-white">{developer.name}</p>
                <p className="text-xs text-slate-400">{developer.role}</p>
              </div>
            </div>
            <span className={`lq-badge ${BADGE_CLASS[original.outcome]}`}>
              {OUTCOME_LABEL[original.outcome]}
            </span>
          </div>
          <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
            <p className="text-sm text-slate-400">{original.confusionPoint}</p>
            <div className="shrink-0 text-right">
              <p className="leading-none">
                <span
                  className={`text-3xl font-bold ${SCORE_TEXT[scoreTone(original.score)]}`}
                >
                  {original.score}
                </span>
                <span className="text-sm text-slate-500">/100</span>
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                Launch clarity
              </p>
            </div>
          </div>
        </div>

        {/* AFTER — trigger, then the animated successful re-run */}
        {!started ? (
          <button
            type="button"
            onClick={rerun}
            className="group flex min-h-[200px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-emerald-400/30 bg-emerald-500/[0.04] p-6 text-center transition-colors hover:border-emerald-400/60 hover:bg-emerald-500/[0.08] focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
          >
            <span className="lq-eyebrow text-emerald-300/80">
              After · Improved site
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-[1.02]">
              <span aria-hidden>▶</span> Re-run Developer on improved site
            </span>
            <span className="max-w-xs text-xs text-slate-400">
              Runs the same mission against the fixed page to verify the blocker
              is gone.
            </span>
          </button>
        ) : (
          <div className="animate-fade-in-up">
            <p className="lq-eyebrow mb-3 text-emerald-300/80">
              After · Improved site
            </p>
            <PersonaRunCard
              persona={developer}
              result={improved}
              revealedSteps={revealed}
              done={done}
            />
          </div>
        )}
      </div>

      {/* delta banner */}
      {done && (
        <div className="mt-5 animate-fade-in-up rounded-2xl border border-emerald-400/30 bg-gradient-to-r from-emerald-500/10 to-teal-400/10 p-5 text-center">
          <p className="text-lg font-semibold text-white">
            {improvedWins ? (
              <>
                ✅ The Developer now activates on the improved site.
              </>
            ) : (
              <>✅ The Developer completes its mission on the improved site.</>
            )}
          </p>
          {improvedWins && (
            <p className="mt-1 text-sm text-slate-300">
              Launch clarity{" "}
              <span className="font-semibold text-rose-300">{original.score}</span>{" "}
              <span className="text-slate-500">→</span>{" "}
              <span className="font-semibold text-emerald-300">
                {improved.score}
              </span>{" "}
              <span className="ml-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
                ▲ +{delta}
              </span>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
