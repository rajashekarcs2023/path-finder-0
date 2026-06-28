import Link from "next/link";
import DemoSiteLayout from "@/components/DemoSiteLayout";
import { PERSONAS, PERSONA_THEME } from "@/lib/personas";
import type { PersonaId } from "@/lib/types";
import { BRAND } from "@/lib/brand";

/** A monospace command block — selectable and copyable. */
function CommandBlock({ command }: { command: string }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto rounded-lg border border-white/10 bg-slate-900/80 px-4 py-2.5 font-mono text-sm">
      <span className="select-none text-indigo-400" aria-hidden>
        $
      </span>
      <code className="whitespace-nowrap text-slate-200">{command}</code>
    </div>
  );
}

type QuickstartStep = {
  step: number;
  title: string;
  blurb: string;
  command: string;
};

const QUICKSTART: QuickstartStep[] = [
  {
    step: 1,
    title: "Install",
    blurb: "Scaffold a new project with everything wired up.",
    command: "npm create agentgrid@latest my-agent",
  },
  {
    step: 2,
    title: "Run",
    blurb: "Start the local dev loop and watch your agent think.",
    command: "cd my-agent && npm run dev",
  },
  {
    step: 3,
    title: "Deploy",
    blurb: "Ship to a managed runtime with one command.",
    command: "npx agentgrid deploy",
  },
];

type Template = {
  emoji: string;
  title: string;
  description: string;
  command: string;
};

const TEMPLATES: Template[] = [
  {
    emoji: "⚡",
    title: "Starter agent",
    description:
      "A minimal tool-calling agent you can run in under a minute — perfect first build.",
    command: "npx degit agentgrid/starter my-agent",
  },
  {
    emoji: "🎓",
    title: "Hackathon kit",
    description:
      "Batteries-included template with auth, a UI, and three example tools for a weekend build.",
    command: "npx degit agentgrid/hackathon-kit my-hack",
  },
  {
    emoji: "🏢",
    title: "Workflow starter",
    description:
      "A durable business-workflow agent with approvals and integrations pre-wired.",
    command: "npx degit agentgrid/workflow my-workflow",
  },
];

type UseCase = {
  emoji: string;
  title: string;
  outcome: string;
};

const USE_CASES: UseCase[] = [
  {
    emoji: "📥",
    title: "Inbound lead qualification",
    outcome:
      "Auto-qualify and route inbound leads in seconds so founders never miss a hot prospect.",
  },
  {
    emoji: "🎫",
    title: "Support deflection",
    outcome:
      "Resolve common tickets end to end and cut first-response time from hours to minutes.",
  },
  {
    emoji: "📊",
    title: "Ops reporting",
    outcome:
      "Turn raw operational data into a daily summary your team actually reads.",
  },
];

type SecurityItem = {
  emoji: string;
  title: string;
  detail: string;
};

const SECURITY: SecurityItem[] = [
  {
    emoji: "🛡️",
    title: "SOC 2 Type II",
    detail: "Independently audited controls, report available under NDA.",
  },
  {
    emoji: "🔑",
    title: "SSO / SAML",
    detail: "Okta, Azure AD, and Google Workspace single sign-on.",
  },
  {
    emoji: "🔒",
    title: "Encryption",
    detail: "Encrypted in transit (TLS 1.2+) and at rest (AES-256).",
  },
  {
    emoji: "👥",
    title: "Role-based access",
    detail: "Granular RBAC with per-workspace roles and audit logs.",
  },
];

const INTEGRATIONS: string[] = [
  "Slack",
  "Salesforce",
  "Snowflake",
  "GitHub",
  "Zendesk",
  "Notion",
  "PostgreSQL",
  "Webhooks",
];

const ROLE_HREF: Record<PersonaId, string> = {
  developer: "#quickstart",
  founder: "#use-cases",
  enterprise: "#security",
  student: "#starter-templates",
};

const ROLE_BLURB: Record<PersonaId, string> = {
  developer: "Get from zero to a running agent with the quickstart.",
  founder: "See concrete startup use cases and pick a pilot.",
  enterprise: "Review security, compliance, and integrations.",
  student: "Clone a hackathon-ready starter and build today.",
};

const GET_STARTED_HREF = "/demo-site-improved/get-started";

export default function ImprovedHomePage() {
  return (
    <DemoSiteLayout improved active="home">
      {/* Hero */}
      <section className="animate-fade-in-up text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-300">
          ✨ Improved by {BRAND.name}
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Build and deploy your first AI agent in 10 minutes
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
          Start from a working template, run it locally, and ship to a managed
          runtime — no agent-infrastructure expertise required.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="#starter-templates"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
          >
            Open Starter Template
          </Link>
          <Link
            href="#quickstart"
            className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-6 py-3 text-base font-medium text-slate-200 transition hover:bg-white/[0.08]"
          >
            See the quickstart
          </Link>
        </div>
      </section>

      {/* Quickstart */}
      <section id="quickstart" className="mt-20 scroll-mt-24">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
          Quickstart
        </span>
        <h2 className="mt-2 text-2xl font-bold text-white">
          Three steps to your first agent
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {QUICKSTART.map((s) => (
            <div
              key={s.step}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-bold text-indigo-300">
                  {s.step}
                </span>
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm text-slate-400">{s.blurb}</p>
              <div className="mt-4">
                <CommandBlock command={s.command} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Starter templates */}
      <section id="starter-templates" className="mt-20 scroll-mt-24">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
          Starter templates
        </span>
        <h2 className="mt-2 text-2xl font-bold text-white">
          Clone, run, and customize
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Every template runs out of the box. Copy a command, run it, and you
          have a working agent to build on.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <article
              key={t.title}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-indigo-400/30"
            >
              <span className="text-3xl" aria-hidden>
                {t.emoji}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {t.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-slate-400">
                {t.description}
              </p>
              <div className="mt-4">
                <CommandBlock command={t.command} />
              </div>
              <Link
                href="#quickstart"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-500/15 px-4 py-2 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/25"
              >
                Use template →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Startup use cases */}
      <section id="use-cases" className="mt-20 scroll-mt-24">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
          Startup use cases
        </span>
        <h2 className="mt-2 text-2xl font-bold text-white">
          Outcomes you can ship this quarter
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {USE_CASES.map((u) => (
            <div
              key={u.title}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/[0.08] to-violet-500/[0.04] p-6"
            >
              <span className="text-3xl" aria-hidden>
                {u.emoji}
              </span>
              <h3 className="mt-4 text-base font-semibold text-white">
                {u.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {u.outcome}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href={GET_STARTED_HREF}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
          >
            Generate Startup Use Case
          </Link>
        </div>
      </section>

      {/* Security & integrations */}
      <section id="security" className="mt-20 scroll-mt-24">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
          Security &amp; integrations
        </span>
        <h2 className="mt-2 text-2xl font-bold text-white">
          Enterprise-ready from day one
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          The trust signals an enterprise buyer needs — surfaced before you ever
          book a call.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECURITY.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <span className="text-2xl" aria-hidden>
                {item.emoji}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Native integrations
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {INTEGRATIONS.map((name) => (
              <span
                key={name}
                className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-200"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href={GET_STARTED_HREF}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
          >
            Request Workflow Pilot
          </Link>
        </div>
      </section>

      {/* Which path are you? — mirrors the LaunchQA personas */}
      <section className="mt-20">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
            Find your path
          </span>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Which path are you?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
            Jump straight to what matters for your role.
          </p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONAS.map((persona) => {
            const theme = PERSONA_THEME[persona.id];
            return (
              <Link
                key={persona.id}
                href={ROLE_HREF[persona.id]}
                className={`group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 ring-1 ring-inset ${theme.ring} transition hover:bg-white/[0.06]`}
              >
                <span className="text-3xl" aria-hidden>
                  {theme.emoji}
                </span>
                <h3 className={`mt-4 text-base font-semibold ${theme.text}`}>
                  {persona.name}
                </h3>
                <p className="mt-2 flex-1 text-sm text-slate-400">
                  {ROLE_BLURB[persona.id]}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-slate-300">
                  Go
                  <span
                    aria-hidden
                    className="transition group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Improved-by-LaunchQA note */}
      <p className="mt-16 text-center text-sm text-indigo-300/80">
        ✨ Improved by {BRAND.name} — every gap a buyer persona hit on the
        original site is now resolved above.
      </p>
    </DemoSiteLayout>
  );
}
