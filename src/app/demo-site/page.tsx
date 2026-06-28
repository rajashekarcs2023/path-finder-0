import Link from "next/link";
import DemoSiteLayout from "@/components/DemoSiteLayout";

type Feature = {
  title: string;
  blurb: string;
  icon: string;
};

const FEATURES: Feature[] = [
  {
    title: "Composable Runtime",
    blurb:
      "A primitive-first execution layer for long-running, stateful agents. Compose tools, memory, and policies into a single deterministic graph.",
    icon: "▦",
  },
  {
    title: "Orchestration",
    blurb:
      "Schedule, fan-out, and reconcile multi-agent workloads across your fleet with backpressure-aware control planes and durable queues.",
    icon: "⇄",
  },
  {
    title: "Agent Registry",
    blurb:
      "A versioned catalog of agents, capabilities, and signed manifests. Promote artifacts across environments with policy-gated rollouts.",
    icon: "◈",
  },
];

type Benefit = {
  title: string;
  blurb: string;
};

const BENEFITS: Benefit[] = [
  {
    title: "Infrastructure-grade reliability",
    blurb:
      "Built for teams operating agents as a tier-1 service. Multi-region, self-healing, and observable by default.",
  },
  {
    title: "Open by design",
    blurb:
      "Bring your own models, tools, and runtimes. AgentGrid stays unopinionated so your platform team stays in control.",
  },
  {
    title: "Scales to your fleet",
    blurb:
      "From a single workflow to thousands of concurrent agents, the control plane elastically absorbs load without re-architecture.",
  },
];

export default function AgentGridHome() {
  return (
    <DemoSiteLayout active="home">
      {/* Hero */}
      <section className="py-10 text-center sm:py-16">
        <span className="inline-block rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-300">
          Agent infrastructure
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Autonomous agent infrastructure for intelligent workflows
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
          Build, deploy, and discover agents at scale.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/demo-site/pricing"
            className="rounded-lg bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:opacity-90"
          >
            Get Started
          </Link>
          <Link
            href="/demo-site/enterprise"
            className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"
          >
            Talk to us
          </Link>
        </div>
      </section>

      {/* Feature trio */}
      <section className="mt-12">
        <h2 className="text-center text-2xl font-semibold text-white">
          Build, deploy, and discover agents
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
          A unified substrate for the full agent lifecycle — from runtime to
          registry.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-lg text-emerald-300"
                aria-hidden
              >
                {feature.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {feature.blurb}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why teams choose AgentGrid */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-white">
          Why teams choose AgentGrid
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <div className="text-sm font-semibold text-emerald-300">
                {benefit.title}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {benefit.blurb}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing band */}
      <section className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-10 text-center">
        <h2 className="text-2xl font-semibold text-white">
          The substrate for agentic systems
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-400">
          Operate agents the way you operate the rest of your platform —
          declaratively, observably, and at scale.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/demo-site/pricing"
            className="rounded-lg bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </section>
    </DemoSiteLayout>
  );
}
