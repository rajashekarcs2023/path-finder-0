import type { GeneratedFix, PersonaResult } from "./types";

/**
 * Deterministic fix generation derived from persona results.
 *
 * Used directly in fallback mode and as the guaranteed fallback for the
 * AI-powered generateFixes(). The fixes map to the upgrades shipped on
 * /demo-site-improved, so the before/after story stays coherent.
 */

type FixSeed = Omit<GeneratedFix, "id">;

const PERSONA_FIX: Record<string, (r: PersonaResult) => FixSeed> = {
  developer: (r) => ({
    title: "Add a developer quickstart CTA above the fold",
    affectedPersona: r.personaName,
    issue: "Developers can’t find a first-build path and bounce before activating.",
    evidence:
      "The persona clicked Docs → API Reference but never found a quickstart or starter template.",
    recommendation:
      "Put a “Build your first AI agent in 10 minutes” CTA above the fold linking to a starter template, and add a Quickstart to the docs.",
    generatedCopy:
      "Build your first AI agent in 10 minutes. Clone a starter template, run it locally, and deploy.",
    impact: "High",
  }),
  founder: (r) => ({
    title: "Add startup use cases + a “Generate Startup Use Case” pilot CTA",
    affectedPersona: r.personaName,
    issue: "Founders understand the category but can’t map it to a concrete pilot.",
    evidence:
      "The persona read the hero and Examples but found only infrastructure framing — no startup use case or pilot path.",
    recommendation:
      "Add an outcome-led “Startup use cases” section and a pilot CTA that proposes a concrete first project.",
    generatedCopy:
      "Not sure where to start? Generate a startup use case and ship a pilot agent this week.",
    impact: "High",
  }),
  enterprise: (r) => ({
    title: "Add a security & integrations block before the enterprise demo CTA",
    affectedPersona: r.personaName,
    issue: "The highest-intent buyer stalls because trust proof is missing at the CTA.",
    evidence:
      "The persona reached the Enterprise page and demo CTA but found no security, compliance, or integration information.",
    recommendation:
      "Place a security & integrations block (SOC 2, SSO, data handling, key integrations) directly above the demo CTA.",
    generatedCopy:
      "Enterprise-ready: SOC 2 Type II, SSO/SAML, encryption in transit and at rest, and 20+ integrations. Request a workflow pilot.",
    impact: "High",
  }),
  student: (r) => ({
    title: "Add a hackathon starter kit with a clone-and-run template",
    affectedPersona: r.personaName,
    issue: "Fast builders find inspiration but no immediate starting point, so they drop off.",
    evidence:
      "The persona browsed Examples and Docs but found no clone-able starter repo or hackathon kit.",
    recommendation:
      "Add a “Hackathon starter kit” with a one-command starter template and a community/Discord link.",
    generatedCopy:
      "Hackathon starter kit: clone the template, run one command, and have a working agent in minutes. Join the community on Discord.",
    impact: "Medium",
  }),
};

const HERO_FIX: FixSeed = {
  title: "Rewrite the hero and add a “Which path are you?” role selector",
  affectedPersona: "All personas",
  issue: "The abstract hero forces every persona to guess their path.",
  evidence:
    "Every persona started on a hero reading “Autonomous agent infrastructure for intelligent workflows,” with a generic “Get Started” CTA and no role-based routing.",
  recommendation:
    "Lead with a concrete outcome headline and add a role selector (Developer / Founder / Enterprise / Student) that routes each visitor to the right path.",
  generatedCopy:
    "Build and deploy your first AI agent in 10 minutes. Which path are you? Developer · Founder · Enterprise · Student.",
  impact: "High",
};

export function generateFallbackFixes(results: PersonaResult[]): GeneratedFix[] {
  // Cross-cutting hero fix first (it affects everyone), then a fix per persona
  // that did not fully succeed.
  const seeds: FixSeed[] = [HERO_FIX];
  for (const r of results) {
    const builder = PERSONA_FIX[r.personaId];
    if (builder && r.outcome !== "success") seeds.push(builder(r));
  }
  return seeds.map((seed, i) => ({ id: `fix_${i + 1}`, ...seed }));
}
