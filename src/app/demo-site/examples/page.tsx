import Link from "next/link";
import DemoSiteLayout from "@/components/DemoSiteLayout";

type SampleAgent = {
  emoji: string;
  title: string;
  description: string;
  tags: string[];
  loc: string;
};

const SAMPLE_AGENTS: SampleAgent[] = [
  {
    emoji: "🔬",
    title: "Research agent",
    description:
      "Multi-hop retrieval over a vector store with a planner/critic loop, self-consistency voting, and citation grounding.",
    tags: ["Planner/Critic", "RAG", "Self-consistency"],
    loc: "1,240 LOC",
  },
  {
    emoji: "🎫",
    title: "Support triage agent",
    description:
      "Classifies inbound tickets, routes by severity, and drafts replies using a tool-calling graph with human-in-the-loop escalation.",
    tags: ["Tool graph", "HITL", "Classification"],
    loc: "980 LOC",
  },
  {
    emoji: "🛠️",
    title: "Data pipeline agent",
    description:
      "Orchestrates extract → transform → load steps across warehouses with retry semantics, checkpointing, and a durable execution backend.",
    tags: ["Orchestration", "Durable execution", "Checkpointing"],
    loc: "1,610 LOC",
  },
  {
    emoji: "🧭",
    title: "Browser navigation agent",
    description:
      "Drives a headless browser with a vision-grounded action space, DOM diffing, and a reflexion memory of failed selectors.",
    tags: ["Computer use", "Vision grounding", "Reflexion"],
    loc: "2,050 LOC",
  },
  {
    emoji: "📊",
    title: "Analyst agent",
    description:
      "Generates SQL, runs it against a read replica, and synthesizes charts via a constrained code-interpreter sandbox.",
    tags: ["Text-to-SQL", "Code interpreter", "Sandbox"],
    loc: "1,330 LOC",
  },
  {
    emoji: "🤝",
    title: "Multi-agent negotiation",
    description:
      "Two cooperating agents exchange structured proposals over a shared blackboard with a referee enforcing protocol invariants.",
    tags: ["Multi-agent", "Blackboard", "Protocol"],
    loc: "1,870 LOC",
  },
];

type Pattern = {
  title: string;
  description: string;
};

const PATTERNS: Pattern[] = [
  {
    title: "Planner → Executor → Critic",
    description:
      "Decompose a goal, execute tool calls, then critique and replan until a stopping condition is met.",
  },
  {
    title: "Blackboard coordination",
    description:
      "Multiple specialist agents read and write a shared state object mediated by a controller.",
  },
  {
    title: "Reflexion memory",
    description:
      "Persist failure traces across episodes so the agent avoids repeating dead-end actions.",
  },
  {
    title: "Hierarchical task graphs",
    description:
      "Compose sub-agents as nodes in a typed DAG with retry, timeout, and compensation edges.",
  },
];

export default function ExamplesPage() {
  return (
    <DemoSiteLayout active="Examples">
      <div className="animate-fade-in-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-300">
          Gallery
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Examples
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          A curated gallery of production-grade agents built on AgentGrid.
          Browse reference implementations and the architectural patterns behind
          them.
        </p>
      </div>

      {/* Sample agents grid */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-white">Sample agents</h2>
          <span className="text-sm text-emerald-300/80">
            6 reference implementations
          </span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_AGENTS.map((agent) => (
            <article
              key={agent.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-emerald-400/30 hover:bg-emerald-500/[0.04]"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl" aria-hidden>
                  {agent.emoji}
                </span>
                <span className="rounded-full border border-white/10 bg-slate-900/60 px-2 py-0.5 text-[11px] font-mono text-slate-500">
                  {agent.loc}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">
                {agent.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {agent.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-emerald-400/15 bg-emerald-500/[0.06] px-2 py-0.5 text-[11px] text-emerald-300/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-300/70">
                View source
                <span aria-hidden className="transition group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* Architectural patterns */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-white">
          Architectural patterns
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          The composable building blocks these examples are assembled from.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PATTERNS.map((pattern) => (
            <div
              key={pattern.title}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
            >
              <h3 className="text-sm font-semibold text-teal-200">
                {pattern.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                {pattern.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Docs link — the only "next step" offered */}
      <section className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/[0.07] to-teal-500/[0.04] p-8 text-center">
        <h2 className="text-lg font-semibold text-white">
          Want to understand the internals?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
          Each example links to its full source. Read the documentation to learn
          how the patterns above fit together.
        </p>
        <Link
          href="/demo-site/docs"
          className="mt-5 inline-flex rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20"
        >
          Read the docs →
        </Link>
      </section>
    </DemoSiteLayout>
  );
}
