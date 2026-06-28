import type { GeneratedFix, LaunchQARun, PersonaResult } from "./types";
import { runFallback } from "./fallbackAgent";
import { generateFallbackFixes } from "./fixGenerator";
import { DEFAULT_PERSONA_IDS } from "./personas";

/**
 * Seeded demo data so /run and /results are always presentable, even on a cold
 * load with nothing in sessionStorage. Pure + client-safe (no server-only deps).
 */
export function seedResults(): PersonaResult[] {
  return runFallback(DEFAULT_PERSONA_IDS);
}

export function seedRun(): LaunchQARun {
  return {
    id: "seed_demo",
    companyName: "AgentGrid",
    websiteUrl: "/demo-site",
    launchGoal: "Convert developers and enterprise buyers before launch",
    personas: DEFAULT_PERSONA_IDS,
    status: "completed",
    results: seedResults(),
    createdAt: 0,
    completedAt: 0,
  };
}

export function seedFixes(): GeneratedFix[] {
  return generateFallbackFixes(seedResults());
}
