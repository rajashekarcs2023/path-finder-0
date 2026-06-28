import Link from "next/link";
import DemoSiteLayout from "@/components/DemoSiteLayout";

type Method = "GET" | "POST" | "DELETE";

type Endpoint = {
  method: Method;
  path: string;
  description: string;
};

const METHOD_TONE: Record<Method, string> = {
  GET: "text-sky-300 border-sky-400/30 bg-sky-500/10",
  POST: "text-emerald-300 border-emerald-400/30 bg-emerald-500/10",
  DELETE: "text-rose-300 border-rose-400/30 bg-rose-500/10",
};

const AGENT_ENDPOINTS: Endpoint[] = [
  { method: "POST", path: "/v1/agents", description: "Register a new agent manifest." },
  { method: "GET", path: "/v1/agents", description: "List agents in the registry." },
  { method: "GET", path: "/v1/agents/{id}", description: "Retrieve an agent by id." },
  { method: "DELETE", path: "/v1/agents/{id}", description: "Deregister an agent." },
];

const RUN_ENDPOINTS: Endpoint[] = [
  { method: "POST", path: "/v1/runs", description: "Dispatch a run for an agent." },
  { method: "GET", path: "/v1/runs/{id}", description: "Fetch run status and event log." },
  { method: "POST", path: "/v1/runs/{id}/cancel", description: "Cancel an in-flight run." },
];

const WEBHOOK_ENDPOINTS: Endpoint[] = [
  { method: "POST", path: "/v1/webhooks", description: "Create a webhook subscription." },
  { method: "GET", path: "/v1/webhooks", description: "List webhook subscriptions." },
  { method: "DELETE", path: "/v1/webhooks/{id}", description: "Delete a subscription." },
];

function EndpointRow({ endpoint }: { endpoint: Endpoint }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-white/5 py-3 first:border-t-0">
      <span
        className={`inline-block w-16 shrink-0 rounded border px-2 py-0.5 text-center text-[11px] font-semibold ${
          METHOD_TONE[endpoint.method]
        }`}
      >
        {endpoint.method}
      </span>
      <code className="font-mono text-sm text-slate-200">{endpoint.path}</code>
      <span className="text-sm text-slate-500">{endpoint.description}</span>
    </div>
  );
}

function EndpointGroup({
  title,
  endpoints,
}: {
  title: string;
  endpoints: Endpoint[];
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <div className="mt-3">
        {endpoints.map((endpoint) => (
          <EndpointRow key={endpoint.method + endpoint.path} endpoint={endpoint} />
        ))}
      </div>
    </div>
  );
}

export default function AgentGridApiReference() {
  return (
    <DemoSiteLayout active="docs">
      <div className="mb-6 text-sm text-slate-500">
        <Link href="/demo-site/docs" className="hover:text-slate-300">
          ← Back to Docs
        </Link>
      </div>

      <header className="border-b border-white/10 pb-8">
        <span className="text-xs font-medium uppercase tracking-wide text-emerald-300">
          API
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
          API Reference
        </h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          The AgentGrid HTTP API is organized around resources and uses standard
          verbs, JSON-encoded bodies, and bearer-token authentication. The base
          URL is{" "}
          <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-slate-200">
            https://api.agentgrid.dev
          </code>
          .
        </p>
      </header>

      {/* Authentication */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">Authentication</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          Authenticate by passing a bearer token in the{" "}
          <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-slate-200">
            Authorization
          </code>{" "}
          header. Tokens are scoped per workspace and may be rotated from the
          control plane. All requests must be made over HTTPS.
        </p>
        <pre className="mt-4 overflow-x-auto rounded bg-slate-900 p-3 text-xs leading-relaxed text-slate-200">
          <code>{`curl https://api.agentgrid.dev/v1/agents \\
  -H "Authorization: Bearer $AGENTGRID_TOKEN" \\
  -H "Content-Type: application/json"`}</code>
        </pre>
      </section>

      {/* Agents */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">Agents</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          Agents are versioned, signed manifests in the registry. Registration is
          idempotent on the manifest digest.
        </p>
        <div className="mt-4">
          <EndpointGroup title="Agent endpoints" endpoints={AGENT_ENDPOINTS} />
        </div>
        <pre className="mt-4 overflow-x-auto rounded bg-slate-900 p-3 text-xs leading-relaxed text-slate-200">
          <code>{`POST /v1/agents
{
  "name": "reconciler",
  "runtime": "composable@2",
  "capabilities": ["tools.read", "memory.write"],
  "manifest_digest": "sha256:9f2c…"
}

200 OK
{
  "id": "agt_3hK9",
  "version": 7,
  "status": "registered"
}`}</code>
        </pre>
      </section>

      {/* Runs */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">Runs</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          A run is a single durable execution of an agent. Runs emit an ordered
          event log that supports deterministic replay.
        </p>
        <div className="mt-4">
          <EndpointGroup title="Run endpoints" endpoints={RUN_ENDPOINTS} />
        </div>
        <pre className="mt-4 overflow-x-auto rounded bg-slate-900 p-3 text-xs leading-relaxed text-slate-200">
          <code>{`POST /v1/runs
{
  "agent_id": "agt_3hK9",
  "input": { "topic": "reconcile" },
  "idempotency_key": "run-2026-06-28-001"
}

202 Accepted
{
  "id": "run_8Qd1",
  "status": "queued",
  "event_log_url": "/v1/runs/run_8Qd1/events"
}`}</code>
        </pre>
      </section>

      {/* Webhooks */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">Webhooks</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          Subscribe to run lifecycle events. Payloads are signed with an HMAC
          over the raw body; verify the{" "}
          <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-slate-200">
            X-AgentGrid-Signature
          </code>{" "}
          header before processing.
        </p>
        <div className="mt-4">
          <EndpointGroup title="Webhook endpoints" endpoints={WEBHOOK_ENDPOINTS} />
        </div>
        <pre className="mt-4 overflow-x-auto rounded bg-slate-900 p-3 text-xs leading-relaxed text-slate-200">
          <code>{`POST /v1/webhooks
{
  "url": "https://example.com/hooks/agentgrid",
  "events": ["run.completed", "run.failed"]
}

201 Created
{
  "id": "whk_1Az7",
  "secret": "whsec_…",
  "active": true
}`}</code>
        </pre>
      </section>

      <p className="mt-12 text-sm text-slate-500">
        Looking for conceptual material?{" "}
        <Link href="/demo-site/docs" className="text-emerald-300 hover:text-emerald-200">
          Return to the documentation index
        </Link>
        .
      </p>
    </DemoSiteLayout>
  );
}
