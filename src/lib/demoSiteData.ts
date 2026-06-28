import type { PageObservation } from "./types";

/**
 * Static snapshots of the intentionally-flawed AgentGrid demo site.
 *
 * These let the AI agent reason about the funnel WITHOUT a live browser (used
 * when USE_BROWSER_AGENT is off but an OPENAI_API_KEY is present). They mirror
 * what Playwright would extract from the real /demo-site pages.
 */
export const DEMO_SITE_PAGES: Record<string, PageObservation> = {
  "/demo-site": {
    url: "/demo-site",
    title: "AgentGrid — Autonomous agent infrastructure",
    headings: [
      "Autonomous agent infrastructure for intelligent workflows",
      "Build, deploy, and discover agents",
      "Why teams choose AgentGrid",
    ],
    links: [
      { text: "Docs", href: "/demo-site/docs" },
      { text: "Examples", href: "/demo-site/examples" },
      { text: "Enterprise", href: "/demo-site/enterprise" },
      { text: "Pricing", href: "/demo-site/pricing" },
    ],
    buttons: [{ text: "Get Started" }, { text: "Talk to us" }],
    visibleText:
      "AgentGrid is autonomous agent infrastructure for intelligent workflows. Build, deploy, and discover agents at scale. Composable runtime, orchestration, and an agent registry. Get Started. No quickstart, starter template, or '10-minute' first build path is shown.",
  },
  "/demo-site/docs": {
    url: "/demo-site/docs",
    title: "AgentGrid Docs",
    headings: ["Documentation", "Concepts", "Architecture", "API Reference", "Deployment"],
    links: [
      { text: "API Reference", href: "/demo-site/docs/api" },
      { text: "Concepts", href: "/demo-site/docs" },
      { text: "Back to site", href: "/demo-site" },
    ],
    buttons: [],
    visibleText:
      "Documentation. Concepts, architecture, runtime model, deployment topology, and the API Reference. Advanced configuration and orchestration internals. There is no beginner quickstart and no 'build your first agent' tutorial.",
  },
  "/demo-site/docs/api": {
    url: "/demo-site/docs/api",
    title: "AgentGrid API Reference",
    headings: ["API Reference", "Authentication", "Agents", "Runs", "Webhooks"],
    links: [{ text: "Back to Docs", href: "/demo-site/docs" }],
    buttons: [],
    visibleText:
      "API Reference. Authentication via bearer tokens. Endpoints for agents, runs, and webhooks with request/response schemas. Dense and technical. No runnable hello-world or starter example for a first build.",
  },
  "/demo-site/examples": {
    url: "/demo-site/examples",
    title: "AgentGrid Examples",
    headings: ["Examples", "Sample agents", "Patterns"],
    links: [
      { text: "Docs", href: "/demo-site/docs" },
      { text: "Back to site", href: "/demo-site" },
    ],
    buttons: [],
    visibleText:
      "Examples. A gallery of finished sample agents and architectural patterns. Impressive but advanced. There is no clone-and-run starter template, no startup business use case, and no hackathon starter kit.",
  },
  "/demo-site/enterprise": {
    url: "/demo-site/enterprise",
    title: "AgentGrid for Enterprise",
    headings: ["Enterprise", "Workflow automation at scale", "Talk to sales"],
    links: [
      { text: "Pricing", href: "/demo-site/pricing" },
      { text: "Back to site", href: "/demo-site" },
    ],
    buttons: [{ text: "Request demo" }],
    visibleText:
      "Enterprise. Automate business workflows at scale with autonomous agents. Trusted by teams. Request a demo. Security, compliance (SOC 2), SSO, data handling, and integration details are not shown near the demo CTA.",
  },
  "/demo-site/pricing": {
    url: "/demo-site/pricing",
    title: "AgentGrid Pricing",
    headings: ["Pricing", "Starter", "Team", "Enterprise"],
    links: [
      { text: "Enterprise", href: "/demo-site/enterprise" },
      { text: "Back to site", href: "/demo-site" },
    ],
    buttons: [{ text: "Get Started" }, { text: "Contact sales" }],
    visibleText:
      "Pricing. Starter, Team, and Enterprise tiers. Contact sales for Enterprise. The demo/pilot path is not obvious from here.",
  },
  "/demo-site-improved": {
    url: "/demo-site-improved",
    title: "AgentGrid — Build your first AI agent in 10 minutes",
    headings: [
      "Build and deploy your first AI agent in 10 minutes",
      "Quickstart",
      "Starter templates",
      "Startup use cases",
      "Security & integrations",
      "Which path are you?",
    ],
    links: [
      { text: "Docs", href: "/demo-site/docs" },
      { text: "Examples", href: "/demo-site/examples" },
      { text: "Enterprise", href: "/demo-site/enterprise" },
    ],
    buttons: [
      { text: "Open Starter Template" },
      { text: "Generate Startup Use Case" },
      { text: "Request Workflow Pilot" },
    ],
    visibleText:
      "Build and deploy your first AI agent in 10 minutes. Open Starter Template. Quickstart: install, run, deploy. Starter templates to clone and run. Startup use cases and a pilot path. Security & integrations: SOC 2, SSO, data handling, key integrations. Which path are you? Developer, Founder, Enterprise, Student.",
  },
};

export function getDemoPage(path: string): PageObservation | undefined {
  return DEMO_SITE_PAGES[path];
}
