import type { Metadata } from "next";
import Link from "next/link";
import LaunchHero from "@/components/LaunchHero";
import { BRAND } from "@/lib/brand";
import { PERSONAS, PERSONA_THEME } from "@/lib/personas";

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: BRAND.hero.subheadline,
};

/** Sticky marketing/app nav shared across LaunchQA pages. */
function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 backdrop-blur supports-[backdrop-filter]:bg-ink-950/60">
      <div className="lq-container flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-violet text-sm font-bold text-white shadow-lg shadow-brand-500/25"
          >
            {BRAND.monogram}
          </span>
          <span className="text-base font-semibold tracking-tight text-slate-100">
            {BRAND.name}
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-5">
          <Link
            href="/#how"
            className="hidden text-sm text-slate-400 transition hover:text-slate-100 sm:inline"
          >
            How it works
          </Link>
          <Link
            href="/demo-site"
            className="hidden text-sm text-slate-400 transition hover:text-slate-100 sm:inline"
          >
            Demo Site
          </Link>
          <Link href="/setup" className="lq-btn-primary">
            Run GTM QA
          </Link>
        </nav>
      </div>
    </header>
  );
}

const HOW_STEPS: ReadonlyArray<{
  emoji: string;
  title: string;
  description: string;
}> = [
  {
    emoji: "🎯",
    title: "Define personas & missions",
    description:
      "Pick the buyers you actually want to convert and the job each one is trying to get done.",
  },
  {
    emoji: "🧭",
    title: "AI personas navigate your site",
    description:
      "Autonomous agents crawl your real pages, click, read, and make decisions like the buyer would.",
  },
  {
    emoji: "🔎",
    title: "See where they get confused",
    description:
      "Every mission is replayed step by step so you see the exact moment a persona stalls or bounces.",
  },
  {
    emoji: "🛠️",
    title: "Get the exact fixes",
    description:
      "Each conversion blocker ships with evidence and ready-to-paste copy to unblock the next buyer.",
  },
];

const FINDINGS: ReadonlyArray<{
  emoji: string;
  title: string;
  description: string;
}> = [
  {
    emoji: "🧑‍💻",
    title: "AI buyer personas",
    description:
      "Developers, founders, and enterprise buyers that reason about your site, not scripted bots.",
  },
  {
    emoji: "🎯",
    title: "GTM missions",
    description:
      "Each persona runs a real conversion mission — activate, evaluate, request a demo.",
  },
  {
    emoji: "🚧",
    title: "Conversion blockers",
    description:
      "Pinpoint the headline, CTA, or missing page where a buyer gives up on you.",
  },
  {
    emoji: "✍️",
    title: "Generated fixes",
    description:
      "Specific, paste-ready copy and layout changes tied to the persona that failed.",
  },
  {
    emoji: "🚀",
    title: "Before launch",
    description:
      "Catch the leaks before you spend a dollar on outbound, ads, or your launch-day spike.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <SiteNav />

      <LaunchHero />

      {/* How it works */}
      <section id="how" className="scroll-mt-24 py-20 sm:py-24">
        <div className="lq-container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="lq-eyebrow">How it works</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              Autonomous agents run real GTM missions
            </h2>
            <p className="mt-4 text-slate-400">
              Not a chatbot. {BRAND.name} sends AI buyer personas through your
              site on a mission and reports back where each one fails to convert.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-4">
            {HOW_STEPS.map((step, i) => (
              <div
                key={step.title}
                className="lq-card lq-card-hover relative flex h-full flex-col p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl" aria-hidden>
                    {step.emoji}
                  </span>
                  <span className="text-sm font-mono font-semibold text-brand-400">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-100">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet your AI buyer personas */}
      <section className="py-20 sm:py-24">
        <div className="lq-container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="lq-eyebrow">The agents</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              Meet your AI buyer personas
            </h2>
            <p className="mt-4 text-slate-400">
              Four autonomous agents, each with a distinct mission, test whether
              real buyers can understand your product and convert.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PERSONAS.map((persona) => {
              const theme = PERSONA_THEME[persona.id];
              return (
                <div
                  key={persona.id}
                  className={`lq-card lq-card-hover flex h-full flex-col p-6 ring-1 ${theme.ring}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-xl"
                      aria-hidden
                    >
                      {theme.emoji}
                    </span>
                    <div>
                      <h3 className={`text-sm font-semibold ${theme.text}`}>
                        {persona.name}
                      </h3>
                      <span
                        className={`mt-1 inline-block h-1.5 w-1.5 rounded-full ${theme.dot}`}
                        aria-hidden
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                    {persona.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {persona.mission}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What LaunchQA finds */}
      <section className="py-20 sm:py-24">
        <div className="lq-container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="lq-eyebrow">What you get</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              What {BRAND.name} finds
            </h2>
            <p className="mt-4 text-slate-400">
              Mission-based testing surfaces the conversion leaks analytics only
              show you after you have already paid for the traffic.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FINDINGS.map((item, i) => (
              <div
                key={item.title}
                className={`lq-card lq-card-hover flex h-full flex-col p-6${
                  i === FINDINGS.length - 1 ? " sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {item.emoji}
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Killer-line band */}
      <section className="py-12 sm:py-16">
        <div className="lq-container">
          <div className="lq-card relative overflow-hidden px-6 py-16 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[360px] w-[680px] -translate-x-1/2 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(99,102,241,0.20), rgba(34,211,238,0.06) 60%, transparent 80%)",
              }}
            />
            <p className="mx-auto max-w-4xl text-2xl font-bold leading-snug sm:text-4xl">
              <span className="lq-gradient-text">{BRAND.killerLine}</span>
            </p>
            <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Pre-launch GTM QA for startups.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA band */}
      <section className="py-20 sm:py-24">
        <div className="lq-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              Run GTM QA before you send traffic
            </h2>
            <p className="mt-4 text-slate-400">
              Launch a full run in one click. Watch every persona navigate your
              site and read the fixes before your buyers ever see a broken path.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/setup" className="lq-btn-primary">
                Run GTM QA
              </Link>
              <Link href="/demo-site" className="lq-btn-ghost">
                {BRAND.hero.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="lq-container flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-violet text-xs font-bold text-white"
            >
              {BRAND.monogram}
            </span>
            <span className="text-sm font-semibold text-slate-200">
              {BRAND.name}
            </span>
          </div>
          <p className="text-sm text-slate-400">{BRAND.tagline}</p>
          <p className="text-xs text-slate-600">
            Not a chatbot. Not fake analytics. Mission-based AI website testing.
          </p>
        </div>
      </footer>
    </main>
  );
}
