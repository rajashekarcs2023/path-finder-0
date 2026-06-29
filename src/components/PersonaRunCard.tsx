import type { Persona, PersonaResult } from "@/lib/types";
import { PERSONA_THEME } from "@/lib/personas";
import { OUTCOME_LABEL, OUTCOME_TONE, scoreTone } from "@/lib/score";
import JourneyTimeline from "@/components/JourneyTimeline";

type Tone = "success" | "partial" | "failure";

const SCORE_TEXT: Record<Tone, string> = {
  success: "text-emerald-300",
  partial: "text-amber-300",
  failure: "text-rose-300",
};

const BADGE_CLASS: Record<Tone, string> = {
  success: "lq-badge-success",
  partial: "lq-badge-partial",
  failure: "lq-badge-failure",
};

/**
 * One persona's live run. The parent drives the reveal: while `done` is false a
 * "Running" badge + pulse ring show, and only `revealedSteps` journey steps are
 * shown; when `done`, the outcome badge and final score footer appear.
 */
export default function PersonaRunCard({
  persona,
  result,
  revealedSteps,
  done,
  loading = false,
}: {
  persona: Persona;
  result: PersonaResult;
  revealedSteps: number;
  done: boolean;
  /** True while the run is still executing server-side (no journey yet). */
  loading?: boolean;
}) {
  const theme = PERSONA_THEME[persona.id];
  const tone = OUTCOME_TONE[result.outcome];

  return (
    <div className="lq-card p-5 sm:p-6">
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-lg ring-1",
              theme.ring,
              done ? "" : "animate-pulse-ring",
            ].join(" ")}
          >
            <span aria-hidden>{theme.emoji}</span>
          </div>
          <div>
            <p className="font-semibold text-white">{persona.name}</p>
            <p className="text-xs text-slate-400">{persona.role}</p>
          </div>
        </div>

        {done ? (
          <span className={`lq-badge ${BADGE_CLASS[tone]}`}>
            {OUTCOME_LABEL[result.outcome]}
          </span>
        ) : (
          <span className="lq-badge lq-badge-running">
            <span
              aria-hidden
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400"
            />
            {loading ? "Thinking" : "Running"}
          </span>
        )}
      </div>

      {/* mission */}
      <p className="mt-4 text-sm text-slate-400">
        <span className={`font-semibold ${theme.text}`}>Mission</span>
        <span className="mx-1.5 text-slate-600">·</span>
        {persona.mission}
      </p>

      {/* journey (or a live "thinking" state while the agent works server-side) */}
      <div className="mt-4">
        {loading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span aria-hidden className="flex items-end gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:300ms]" />
              </span>
              <span>Navigating AgentGrid and deciding where to click…</span>
            </div>
            <div className="space-y-2">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="relative h-12 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                >
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <JourneyTimeline steps={result.journey} revealed={revealedSteps} />
        )}
      </div>

      {/* final score footer */}
      {done && (
        <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
          <p className="text-sm text-slate-400">{result.confusionPoint}</p>
          <div className="shrink-0 text-right">
            <p className="leading-none">
              <span
                className={`text-3xl font-bold ${SCORE_TEXT[scoreTone(result.score)]}`}
              >
                {result.score}
              </span>
              <span className="text-sm text-slate-500">/100</span>
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
              Launch clarity
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
