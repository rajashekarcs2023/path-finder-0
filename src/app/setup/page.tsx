import type { Metadata } from "next";
import Link from "next/link";
import SetupForm from "@/components/SetupForm";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Configure your run — ${BRAND.name}`,
  description: `Configure a ${BRAND.name} run: pick your AI buyer personas and their GTM missions, then test your site before launch.`,
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

export default function SetupPage() {
  return (
    <main className="min-h-screen">
      <SiteNav />

      <section className="py-16 sm:py-20">
        <div className="lq-container">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <span className="lq-eyebrow">Configure your GTM QA run</span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-100">
                Test AgentGrid before launch
              </h1>
              <p className="mt-4 text-slate-400">
                Set your company, the launch goal, and which AI buyer personas
                run a mission through your site. {BRAND.name} replays every step
                and reports where each persona fails to convert.
              </p>
            </div>

            <div className="mt-10">
              <SetupForm />
            </div>

            <p className="mt-5 text-center text-sm text-slate-500">
              Prefilled and ready — just click Run {BRAND.name}.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
