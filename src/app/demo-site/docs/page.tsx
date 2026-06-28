import Link from "next/link";
import DemoSiteLayout from "@/components/DemoSiteLayout";

type Topic = {
  title: string;
  blurb: string;
};

const TOPICS: Topic[] = [
  {
    title: "Concepts",
    blurb:
      "The agent execution model: graphs, nodes, capabilities, and the reconciliation loop that drives convergence.",
  },
  {
    title: "Architecture",
    blurb:
      "Control plane vs. data plane separation, the scheduler, durable state stores, and the manifest resolver.",
  },
  {
    title: "Runtime model",
    blurb:
      "Lifecycle of a run, supervision trees, retry/backoff semantics, and deterministic replay from the event log.",
  },
  {
    title: "Deployment",
    blurb:
      "Deployment topology across regions: control-plane quorum, worker pools, sharded queues, and gateway ingress.",
  },
  {
    title: "Orchestration internals",
    blurb:
      "How the dispatcher fans out work, applies backpressure, and reconciles desired vs. observed fleet state.",
  },
  {
    title: "Observability",
    blurb:
      "Structured traces, span propagation across agent hops, and exporting metrics to your existing collectors.",
  },
];

export default function AgentGridDocs() {
  return (
    <DemoSiteLayout active="docs">
      <div className="mb-6 text-sm text-slate-500">
        <Link href="/demo-site" className="hover:text-slate-300">
          ← Back to AgentGrid
        </Link>
      </div>

      <header className="border-b border-white/10 pb-8">
        <span className="text-xs font-medium uppercase tracking-wide text-emerald-300">
          Reference
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
          Documentation
        </h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          Technical reference for the AgentGrid control plane, runtime, and
          orchestration layer. These docs assume familiarity with distributed
          systems and the agent execution model.
        </p>
      </header>

      {/* Prominent API reference link */}
      <Link
        href="/demo-site/docs/api"
        className="mt-8 flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-6 transition hover:bg-emerald-500/15"
      >
        <div>
          <div className="text-base font-semibold text-white">
            API Reference
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Complete endpoint reference for Agents, Runs, and Webhooks.
          </p>
        </div>
        <span className="text-emerald-300" aria-hidden>
          →
        </span>
      </Link>

      {/* Topic grid */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-white">Topics</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {TOPICS.map((topic) => (
            <div
              key={topic.title}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-base font-semibold text-white">
                {topic.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {topic.blurb}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Deep-dive callout (still reference-first, no quickstart) */}
      <section className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-base font-semibold text-white">
          Deployment topology
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          AgentGrid runs as a quorum-based control plane fronting horizontally
          sharded worker pools. Each region maintains an independent dispatcher
          that reconciles fleet state against the manifest registry; cross-region
          coordination is handled through the orchestration internals layer.
          Refer to the Architecture and Runtime model sections for the underlying
          guarantees.
        </p>
      </section>
    </DemoSiteLayout>
  );
}
