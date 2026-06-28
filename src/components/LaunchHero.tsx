import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { PERSONAS, PERSONA_THEME } from "@/lib/personas";

/**
 * Marketing hero for the LaunchQA homepage. Server component, no props.
 * Premium dark SaaS look with a row of floating persona chips.
 */
export default function LaunchHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Faint grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 75%)",
        }}
      />
      {/* Soft orbital glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(99,102,241,0.22), rgba(34,211,238,0.08) 60%, transparent 80%)",
        }}
      />

      <div className="lq-container flex flex-col items-center py-24 text-center sm:py-28">
        <span className="lq-eyebrow animate-fade-in-up">{BRAND.tagline}</span>

        <h1
          className="mt-6 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl animate-fade-in-up"
          style={{ animationDelay: "60ms" }}
        >
          <span className="lq-gradient-text">{BRAND.hero.headline}</span>
        </h1>

        <p
          className="mt-6 max-w-2xl text-lg text-slate-400 animate-fade-in-up"
          style={{ animationDelay: "120ms" }}
        >
          {BRAND.hero.subheadline}
        </p>

        <div
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row animate-fade-in-up"
          style={{ animationDelay: "180ms" }}
        >
          <Link href="/setup" className="lq-btn-primary">
            {BRAND.hero.cta}
          </Link>
          <Link href="/demo-site" className="lq-btn-ghost">
            {BRAND.hero.secondary}
          </Link>
        </div>

        {/* Floating persona chips */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
          {PERSONAS.map((persona, i) => {
            const theme = PERSONA_THEME[persona.id];
            return (
              <div
                key={persona.id}
                className={`flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 ring-1 ${theme.ring} backdrop-blur animate-fade-in-up`}
                style={{ animationDelay: `${260 + i * 90}ms` }}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {theme.emoji}
                </span>
                <span className="text-left leading-tight">
                  <span
                    className={`block text-sm font-medium ${theme.text}`}
                  >
                    {persona.name}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    on a mission
                  </span>
                </span>
                <span
                  className={`ml-1 h-1.5 w-1.5 rounded-full ${theme.dot} animate-pulse-ring`}
                  aria-hidden
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
