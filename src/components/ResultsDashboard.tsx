import type { GeneratedFix, LaunchQARun } from "@/lib/types";
import { PERSONA_THEME } from "@/lib/personas";
import {
  OUTCOME_LABEL,
  OUTCOME_TONE,
  overallReadiness,
  readinessLabel,
  scoreTone,
} from "@/lib/score";
import JourneyTimeline from "@/components/JourneyTimeline";
import FixCard from "@/components/FixCard";
import BeforeAfterPreview from "@/components/BeforeAfterPreview";
import ReRunMoment from "@/components/ReRunMoment";

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

const RING_STROKE: Record<Tone, string> = {
  success: "#6ee7b7", // emerald-300
  partial: "#fcd34d", // amber-300
  failure: "#fda4af", // rose-300
};

/**
 * The payoff screen: overall launch-readiness, per-persona scores, expandable
 * journeys, generated fixes, and a live before/after of the demo site.
 */
export default function ResultsDashboard({
  run,
  fixes,
}: {
  run: LaunchQARun;
  fixes: GeneratedFix[];
}) {
  const results = run.results;
  const score = overallReadiness(results);
  const tone = scoreTone(score);
  // The before/after + re-run sections are specific to the controlled AgentGrid
  // demo; a real external site has no "improved" version to compare against.
  const isLive =
    /^https?:\/\//i.test(run.websiteUrl) &&
    !/localhost|127\.0\.0\.1/i.test(run.websiteUrl);

  const counts = {
    success: results.filter((r) => r.outcome === "success").length,
    partial: results.filter((r) => r.outcome === "partial").length,
    failure: results.filter((r) => r.outcome === "failure").length,
  };

  // Gauge geometry.
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - Math.min(Math.max(score, 0), 100) / 100);

  return (
    <div className="lq-container space-y-10 py-10">
      {/* (a) Readiness header */}
      <section className="lq-card p-6 sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            {/* gauge */}
            <div className="relative h-40 w-40 shrink-0">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={RING_STROKE[tone]}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-6xl font-bold leading-none ${SCORE_TEXT[tone]}`}>
                  {score}
                </span>
                <span className="mt-1 text-xs text-slate-500">/100</span>
              </div>
            </div>

            <div>
              <p className="lq-eyebrow">Launch readiness</p>
              <p className={`mt-1 text-2xl font-bold ${SCORE_TEXT[tone]}`}>
                {readinessLabel(score)}
              </p>
              <p className="mt-2 text-sm text-slate-300">{run.companyName}</p>
              <p className="text-sm text-slate-500">{run.launchGoal}</p>
            </div>
          </div>

          {/* outcome breakdown */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <Stat label="Success" value={counts.success} className="text-emerald-300" />
            <Stat label="Partial" value={counts.partial} className="text-amber-300" />
            <Stat label="Failed" value={counts.failure} className="text-rose-300" />
          </div>
        </div>
      </section>

      {/* (b) Persona scores grid */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Persona scores</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((r) => {
            const theme = PERSONA_THEME[r.personaId];
            const rTone = scoreTone(r.score);
            return (
              <div key={r.personaId} className="lq-card lq-card-hover p-5">
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-base ring-1 ${theme.ring}`}
                  >
                    <span aria-hidden>{theme.emoji}</span>
                  </div>
                  <span className={`lq-badge ${BADGE_CLASS[OUTCOME_TONE[r.outcome]]}`}>
                    {OUTCOME_LABEL[r.outcome]}
                  </span>
                </div>
                <p className="mt-3 font-semibold text-white">{r.personaName}</p>
                <p className="mt-1">
                  <span className={`text-2xl font-bold ${SCORE_TEXT[rTone]}`}>
                    {r.score}
                  </span>
                  <span className="text-xs text-slate-500">/100</span>
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                  {r.confusionPoint}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* (c) Persona journeys */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Persona journeys</h2>
        <div className="space-y-3">
          {results.map((r, i) => {
            const theme = PERSONA_THEME[r.personaId];
            const rTone = scoreTone(r.score);
            return (
              <details
                key={r.personaId}
                open={i === 0}
                className="lq-card group overflow-hidden p-0"
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 p-5 [&::-webkit-details-marker]:hidden">
                  <span
                    aria-hidden
                    className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-base ring-1 ${theme.ring}`}
                  >
                    {theme.emoji}
                  </span>
                  <span className="font-semibold text-white">{r.personaName}</span>
                  <span className={`lq-badge ${BADGE_CLASS[OUTCOME_TONE[r.outcome]]}`}>
                    {OUTCOME_LABEL[r.outcome]}
                  </span>
                  <span className="ml-auto flex items-center gap-2">
                    <span className={`text-lg font-bold ${SCORE_TEXT[rTone]}`}>
                      {r.score}
                      <span className="text-xs text-slate-500">/100</span>
                    </span>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden
                      className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180"
                    >
                      <path
                        d="M5 7.5 10 12.5 15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </summary>

                <div className="space-y-4 border-t border-white/10 p-5">
                  <p className="text-sm text-slate-400">
                    <span className={`font-semibold ${theme.text}`}>Mission</span>
                    <span className="mx-1.5 text-slate-600">·</span>
                    {r.mission}
                  </p>

                  <blockquote className="border-l-2 border-brand-500/60 pl-3 text-sm italic text-slate-300">
                    “{r.quote}”
                  </blockquote>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Conversion blocker
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {r.conversionBlocker}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Recommended fix
                      </p>
                      <p className="mt-1 text-sm text-slate-400">{r.recommendedFix}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <JourneyTimeline steps={r.journey} />
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {/* (d) Generated fixes */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          Generated fixes
          <span className="lq-badge bg-white/10 text-slate-300 ring-1 ring-inset ring-white/15">
            {fixes.length}
          </span>
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fixes.map((f, i) => (
            <FixCard key={f.id} fix={f} index={i} />
          ))}
        </div>
      </section>

      {/* (e) Before / after + (f) the re-run payoff — controlled-demo only */}
      {!isLive && (
        <>
          <section>
            <h2 className="mb-4 text-lg font-semibold text-white">
              See the fixes live
            </h2>
            <BeforeAfterPreview />
          </section>

          {/* Developer goes from blocked to activated on the improved site */}
          <ReRunMoment before={results.find((r) => r.personaId === "developer")} />
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center">
      <p className={`text-2xl font-bold ${className}`}>{value}</p>
      <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}
