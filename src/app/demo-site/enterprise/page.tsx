import Link from "next/link";
import DemoSiteLayout from "@/components/DemoSiteLayout";

type Capability = {
  emoji: string;
  title: string;
  description: string;
};

const CAPABILITIES: Capability[] = [
  {
    emoji: "⚙️",
    title: "Autonomous workflows",
    description:
      "Replace brittle scripts with agents that plan, act, and adapt across your internal tools.",
  },
  {
    emoji: "📈",
    title: "Scale on demand",
    description:
      "Run thousands of concurrent agent executions with elastic, queue-backed orchestration.",
  },
  {
    emoji: "🔁",
    title: "Human-in-the-loop",
    description:
      "Insert approvals and review gates anywhere in a workflow without rewriting it.",
  },
  {
    emoji: "🧩",
    title: "Composable steps",
    description:
      "Assemble reusable building blocks into long-running, durable business processes.",
  },
];

const OUTCOMES: string[] = [
  "Cut manual back-office processing time",
  "Automate repetitive operations end to end",
  "Free up teams to focus on higher-value work",
];

export default function EnterprisePage() {
  return (
    <DemoSiteLayout active="Enterprise">
      {/* Hero with prominent CTA */}
      <section className="animate-fade-in-up text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-teal-300">
          For Enterprise
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Workflow automation at scale
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
          Automate your most repetitive business workflows with autonomous
          agents. AgentGrid orchestrates long-running processes across your
          stack so your teams can move faster.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/demo-site/enterprise/request-demo"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-400 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-300"
          >
            Request demo
          </Link>
          <Link
            href="/demo-site/pricing"
            className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.03] px-6 py-3 text-base font-medium text-slate-200 transition hover:bg-white/[0.07]"
          >
            View pricing
          </Link>
        </div>

        {/* Vague, unsubstantiated trust line */}
        <p className="mt-8 text-sm text-slate-500">
          Trusted by fast-moving teams to automate the work that slows them
          down.
        </p>
      </section>

      {/* Capabilities */}
      <section className="mt-16">
        <div className="grid gap-5 sm:grid-cols-2">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-teal-400/30"
            >
              <span className="text-3xl" aria-hidden>
                {cap.emoji}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {cap.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Outcomes — still vague, no proof */}
      <section className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-br from-teal-500/[0.06] to-emerald-500/[0.03] p-8">
        <h2 className="text-xl font-semibold text-white">
          Built for operational scale
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Teams across operations, finance, and support use AgentGrid to take
          work off their plate.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {OUTCOMES.map((outcome) => (
            <li
              key={outcome}
              className="flex items-start gap-2 text-sm text-slate-300"
            >
              <span className="mt-0.5 text-teal-300" aria-hidden>
                ✓
              </span>
              {outcome}
            </li>
          ))}
        </ul>
      </section>

      {/* Second CTA */}
      <section className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-white">
          See it on your own workflows
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
          Book a walkthrough and we&apos;ll map AgentGrid to a process your team
          runs today.
        </p>
        <Link
          href="/demo-site/enterprise/request-demo"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-emerald-400 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-300"
        >
          Request demo
        </Link>
        <p className="mt-4 text-sm text-slate-500">
          Curious about cost?{" "}
          <Link
            href="/demo-site/pricing"
            className="text-teal-300 underline-offset-2 hover:underline"
          >
            See pricing
          </Link>
          .
        </p>
      </section>

      {/* Tiny, easy-to-miss footnote — security details buried far from the CTA */}
      <p className="mt-20 text-center text-[11px] text-slate-600">
        Security &amp; compliance information available on request.
      </p>
    </DemoSiteLayout>
  );
}
