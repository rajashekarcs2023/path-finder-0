import type { PersonaId, PersonaResult } from "./types";

/**
 * Deterministic, polished persona journeys.
 *
 * This is the reliability backbone of the demo: with no OpenAI key and no
 * Playwright browser, LaunchQA still produces convincing, mission-grounded
 * results. The journeys map 1:1 to the intentionally-flawed /demo-site funnel.
 */
const FALLBACK_RESULTS: Record<PersonaId, PersonaResult> = {
  developer: {
    personaId: "developer",
    personaName: "Developer",
    mission: "Figure out how to build your first AI agent as quickly as possible.",
    outcome: "failure",
    score: 42,
    journey: [
      {
        stepNumber: 1,
        url: "/demo-site",
        observationSummary:
          "Hero reads “Autonomous agent infrastructure for intelligent workflows.” Primary CTA is a generic “Get Started.”",
        action: "Read the homepage hero and scanned for a quickstart",
        reasoning:
          "I want to start building immediately, so I look for a quickstart or a clear first step above the fold.",
      },
      {
        stepNumber: 2,
        url: "/demo-site",
        observationSummary:
          "No quickstart on the homepage. Nav offers Docs, Examples, Enterprise, Pricing.",
        action: "Clicked “Docs”",
        reasoning: "Docs is where I’d expect a quickstart and the first build steps.",
      },
      {
        stepNumber: 3,
        url: "/demo-site/docs",
        observationSummary:
          "Docs lists Concepts, Architecture, API Reference, and Deployment — but no beginner quickstart.",
        action: "Clicked “API Reference”",
        reasoning:
          "There’s no quickstart, so I try the API Reference hoping for a hello-world to copy.",
      },
      {
        stepNumber: 4,
        url: "/demo-site/docs/api",
        observationSummary:
          "Dense endpoint reference (auth, agents, runs). No runnable first example or starter template.",
        action: "Searched for a copy-paste starter; found none",
        reasoning:
          "This is reference material, not a first-build path. I still don’t know step one.",
      },
      {
        stepNumber: 5,
        url: "/demo-site/docs/api",
        observationSummary:
          "No quickstart, starter template, or “10-minute” path anywhere in the funnel.",
        action: "Stopped — failed activation",
        reasoning:
          "I can’t tell how to build my first agent, so I’d bounce and try a competitor.",
      },
    ],
    confusionPoint:
      "The developer could not find a beginner quickstart or starter template — the site routes builders straight to API reference.",
    quote:
      "I get that this is about AI agents, but I have no idea where to actually start building.",
    conversionBlocker:
      "The funnel sends developers to API reference before showing any first-build path, so activation fails above the fold.",
    recommendedFix:
      "Add a developer CTA above the fold: “Build your first AI agent in 10 minutes,” linking to a starter template.",
  },

  founder: {
    personaId: "founder",
    personaName: "Founder",
    mission:
      "Understand if AgentGrid is useful for your startup and what pilot use case to start with.",
    outcome: "partial",
    score: 58,
    journey: [
      {
        stepNumber: 1,
        url: "/demo-site",
        observationSummary:
          "Hero is abstract: “Autonomous agent infrastructure for intelligent workflows.”",
        action: "Read the hero and product description",
        reasoning:
          "I’m evaluating fit for my startup — I look for concrete use cases and business outcomes.",
      },
      {
        stepNumber: 2,
        url: "/demo-site",
        observationSummary:
          "Copy is infrastructure-heavy with no startup or business framing.",
        action: "Clicked “Examples”",
        reasoning: "Examples might show what companies actually build with this.",
      },
      {
        stepNumber: 3,
        url: "/demo-site/examples",
        observationSummary:
          "Shows technical sample agents — but no startup/business use cases and no pilot path.",
        action: "Scanned the examples for a startup-relevant story",
        reasoning:
          "These are developer demos, not “here’s the business value for a startup like mine.”",
      },
      {
        stepNumber: 4,
        url: "/demo-site/examples",
        observationSummary:
          "No “startup use cases” section and no pilot/demo path. The value prop stays abstract.",
        action: "Stopped — partial understanding",
        reasoning:
          "I sort of understand the category, but I can’t tell what I’d pilot first or why now.",
      },
    ],
    confusionPoint:
      "The founder understood the category but never found a concrete startup use case or a “where do I start” pilot path.",
    quote:
      "I think I get the gist, but I can’t tell what I’d actually pilot first or why I should care right now.",
    conversionBlocker:
      "The messaging is infrastructure-led, not outcome-led, so founders can’t map the product to a business use case.",
    recommendedFix:
      "Add a “Startup use cases” section and a “Generate Startup Use Case” pilot CTA that turns the value prop into a concrete first project.",
  },

  enterprise: {
    personaId: "enterprise",
    personaName: "Enterprise Buyer",
    mission:
      "Decide whether AgentGrid can automate business workflows and whether it looks credible.",
    outcome: "partial",
    score: 64,
    journey: [
      {
        stepNumber: 1,
        url: "/demo-site",
        observationSummary:
          "Hero emphasizes autonomous agents. The nav has an Enterprise link.",
        action: "Read the homepage, then headed for Enterprise",
        reasoning:
          "I evaluate credibility and workflow fit, so I go straight to the Enterprise page.",
      },
      {
        stepNumber: 2,
        url: "/demo-site/enterprise",
        observationSummary:
          "Enterprise page describes workflow automation but has no security, compliance, or integrations section.",
        action: "Searched for security / SOC 2 / SSO / integrations",
        reasoning:
          "Before I request a demo I need to see security and integration credibility.",
      },
      {
        stepNumber: 3,
        url: "/demo-site/enterprise",
        observationSummary:
          "Found a “Request demo” CTA, but trust information is buried or absent near it.",
        action: "Looked again for trust signals around the CTA",
        reasoning:
          "There’s a demo CTA, but nothing reassures me this is enterprise-ready.",
      },
      {
        stepNumber: 4,
        url: "/demo-site/enterprise",
        observationSummary:
          "Workflow automation is clear; security/integration trust is missing before the CTA.",
        action: "Stopped — partial conversion",
        reasoning:
          "I’d consider a demo, but I can’t justify it internally without security and integration proof.",
      },
    ],
    confusionPoint:
      "The enterprise buyer found the workflow-automation pitch but no security, compliance, or integration information before the demo CTA.",
    quote:
      "The automation story is fine, but I can’t bring this to my team without seeing security and integrations.",
    conversionBlocker:
      "Trust and security proof is missing right where the buyer decides to request a demo, stalling the highest-intent persona.",
    recommendedFix:
      "Add a security & integrations block (SOC 2, SSO, data handling, key integrations) directly above the enterprise demo CTA.",
  },

  student: {
    personaId: "student",
    personaName: "Student / Hackathon Builder",
    mission: "Find examples, project ideas, or a starter template to build quickly.",
    outcome: "partial",
    score: 70,
    journey: [
      {
        stepNumber: 1,
        url: "/demo-site",
        observationSummary: "Homepage with nav: Docs, Examples, Enterprise, Pricing.",
        action: "Read the homepage, then headed for Examples",
        reasoning:
          "I want fast project ideas and something I can clone and run tonight.",
      },
      {
        stepNumber: 2,
        url: "/demo-site/examples",
        observationSummary:
          "Examples show finished agents but no clone-able starter repo or template.",
        action: "Searched for a “starter template” / “clone this repo”",
        reasoning: "Cool ideas, but I need a starting point I can run immediately.",
      },
      {
        stepNumber: 3,
        url: "/demo-site/docs",
        observationSummary: "Docs are reference-style with no hackathon starter kit.",
        action: "Checked Docs for a starter kit",
        reasoning: "Still no obvious “start here” template for a quick build.",
      },
      {
        stepNumber: 4,
        url: "/demo-site/docs",
        observationSummary:
          "Found inspiration but no starter template or hackathon kit to clone.",
        action: "Stopped — partial",
        reasoning:
          "I know what’s possible, but without a starter repo I’ll probably use something faster.",
      },
    ],
    confusionPoint:
      "The student found example projects for inspiration but no clone-able starter template or hackathon kit.",
    quote:
      "The examples look cool, but I need a starter repo I can clone and run tonight — I can’t find one.",
    conversionBlocker:
      "There’s inspiration but no immediate “clone and run” path, so fast builders drop off before their first build.",
    recommendedFix:
      "Add a “Hackathon starter kit” with a clone-and-run starter template and a community/Discord link.",
  },
};

/**
 * The "wow" re-run: after the generated fixes ship on /demo-site-improved, the
 * developer persona now succeeds. Used by the before/after re-run moment.
 */
export const DEVELOPER_IMPROVED_RESULT: PersonaResult = {
  personaId: "developer",
  personaName: "Developer",
  mission: "Figure out how to build your first AI agent as quickly as possible.",
  outcome: "success",
  score: 88,
  journey: [
    {
      stepNumber: 1,
      url: "/demo-site-improved",
      observationSummary:
        "Hero reads “Build and deploy your first AI agent in 10 minutes,” with an “Open Starter Template” CTA.",
      action: "Read the new hero and saw a developer CTA",
      reasoning: "The first build path is stated above the fold — exactly what I needed.",
    },
    {
      stepNumber: 2,
      url: "/demo-site-improved",
      observationSummary:
        "A Quickstart section shows install → run → deploy in three steps next to a starter template.",
      action: "Followed the Quickstart steps",
      reasoning: "Three concrete steps tell me precisely how to start.",
    },
    {
      stepNumber: 3,
      url: "/demo-site-improved",
      observationSummary:
        "Starter template section links a clone-and-run repo with a copy-paste command.",
      action: "Opened the starter template",
      reasoning: "I can clone this and have a running agent in minutes.",
    },
    {
      stepNumber: 4,
      url: "/demo-site-improved",
      observationSummary: "First build path is unambiguous end-to-end.",
      action: "Stopped — successful activation",
      reasoning: "I know exactly how to build my first agent. I’d start now.",
    },
  ],
  confusionPoint: "None — the quickstart and starter template made the first build path obvious.",
  quote: "Got it — clone the starter, run it, deploy. I could ship my first agent today.",
  conversionBlocker: "Resolved: the above-the-fold developer path now leads straight to a quickstart.",
  recommendedFix:
    "Keep the “Build your first agent in 10 minutes” CTA and starter template above the fold.",
};

/** Return deterministic results for the requested personas, in request order. */
export function runFallback(personaIds: PersonaId[]): PersonaResult[] {
  return personaIds
    .filter((id): id is PersonaId => id in FALLBACK_RESULTS)
    .map((id) => structuredClone(FALLBACK_RESULTS[id]));
}

export function getFallbackResult(id: PersonaId): PersonaResult {
  return structuredClone(FALLBACK_RESULTS[id]);
}
