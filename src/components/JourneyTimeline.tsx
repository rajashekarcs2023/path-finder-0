import type { JourneyStep } from "@/lib/types";

/** A terminal/failure step gets a rose dot instead of the brand indigo dot. */
function isEndStep(action: string): boolean {
  return action.startsWith("Stopped") || action.includes("Could not");
}

/**
 * Vertical agent-journey timeline. Each step is a numbered dot on a connecting
 * line plus a compact card. When `revealed` is provided, only the first
 * `revealed` steps render (used to animate live runs); otherwise all render.
 */
export default function JourneyTimeline({
  steps,
  revealed,
}: {
  steps: JourneyStep[];
  revealed?: number;
}) {
  const shown = typeof revealed === "number" ? steps.slice(0, revealed) : steps;

  if (shown.length === 0) {
    return (
      <p className="py-2 text-sm text-slate-500">
        Waiting for the agent to take its first step…
      </p>
    );
  }

  return (
    <ol className="relative">
      {shown.map((step, i) => {
        const end = isEndStep(step.action);
        const isLast = i === shown.length - 1;

        return (
          <li
            key={step.stepNumber}
            className="relative flex animate-fade-in-up gap-3 pb-5 last:pb-0"
          >
            {/* dot + connecting line */}
            <div className="relative flex w-6 shrink-0 justify-center">
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-6 -ml-px h-[calc(100%-1.25rem)] w-px bg-white/10"
                />
              )}
              <span
                className={[
                  "z-10 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ring-1 ring-inset",
                  end
                    ? "bg-rose-500/20 text-rose-200 ring-rose-500/40"
                    : "bg-brand-500/20 text-brand-400 ring-brand-500/40",
                ].join(" ")}
              >
                {step.stepNumber}
              </span>
            </div>

            {/* step card */}
            <div className="-mt-0.5 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="font-semibold text-white">{step.action}</p>
              <p className="mt-0.5 truncate font-mono text-xs text-slate-500">
                {step.url}
              </p>
              <p className="mt-1.5 text-sm text-slate-400">
                {step.observationSummary}
              </p>
              <p className="mt-2 border-l border-white/10 pl-2.5 text-sm italic text-slate-400">
                <span aria-hidden className="mr-1 text-slate-600">
                  &ldquo;
                </span>
                {step.reasoning}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
