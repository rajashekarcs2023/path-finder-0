import type {
  JourneyStep,
  PageObservation,
  Persona,
  PersonaId,
  PersonaResult,
} from "./types";
import { getPersona } from "./personas";
import { chooseNextAction, generatePersonaReport, isAIEnabled } from "./ai";
import { getFallbackResult, runFallback } from "./fallbackAgent";
import { genericResult, runPersonaJourney } from "./browserAgent";
import { getDemoPage } from "./demoSiteData";

/** A real, external website (not our own localhost demo site). */
export function isLiveUrl(url: string): boolean {
  return (
    /^https?:\/\//i.test(url) &&
    !/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(url)
  );
}

/**
 * Decides HOW a run executes, in priority order:
 *   1. Real Playwright browser  (USE_BROWSER_AGENT=true)
 *   2. AI reasoning over the modeled demo site  (OPENAI_API_KEY present)
 *   3. Deterministic fallback  (always available — the default)
 *
 * Every path is individually guarded so one persona (or one mode) failing never
 * breaks the run; it degrades to the curated fallback for that persona.
 */

export type RunMode = "browser" | "ai" | "fallback";

export function resolveMode(): RunMode {
  if (process.env.USE_BROWSER_AGENT === "true") return "browser";
  if (isAIEnabled()) return "ai";
  return "fallback";
}

const MAX_STEPS = 5;

/** AI-driven navigation over the static demo-site model (no real browser). */
async function runAiSimulated(persona: Persona, startUrl: string): Promise<PersonaResult> {
  const start = getDemoPage(startUrl) ?? getDemoPage("/demo-site");
  if (!start) return getFallbackResult(persona.id);
  let current: PageObservation = start;

  const journey: JourneyStep[] = [];
  const visited = new Set<string>();

  for (let step = 1; step <= MAX_STEPS; step++) {
    visited.add(current.url);
    const action = await chooseNextAction(persona, current, journey);

    if (action.type === "stop") {
      journey.push({
        stepNumber: step,
        url: current.url,
        observationSummary: current.headings[0] ?? current.title,
        action: `Stopped — ${action.outcome}`,
        reasoning: action.reason,
      });
      break;
    }

    if (action.type === "scroll") {
      journey.push({
        stepNumber: step,
        url: current.url,
        observationSummary: current.headings[0] ?? current.title,
        action: "Scrolled to read more",
        reasoning: action.reason,
      });
      continue;
    }

    // click — resolve target to a modeled page
    const link = current.links.find((l) =>
      l.text.toLowerCase().includes(action.targetText.toLowerCase()),
    );
    journey.push({
      stepNumber: step,
      url: current.url,
      observationSummary: current.headings[0] ?? current.title,
      action: `Clicked “${action.targetText}”`,
      reasoning: action.reason,
    });

    const next: PageObservation | undefined = link ? getDemoPage(link.href) : undefined;
    // Move only to a new, modeled page; dead ends/loops leave us in place so the
    // model renders a verdict on the next iteration.
    if (next && !visited.has(next.url)) {
      current = next;
    }
  }

  return generatePersonaReport(persona, journey);
}

async function runOnePersona(
  mode: RunMode,
  id: PersonaId,
  startUrl: string,
  live = false,
): Promise<PersonaResult> {
  const persona = getPersona(id);
  try {
    if (mode === "browser") {
      return await runPersonaJourney({
        persona,
        startUrl,
        maxSteps: MAX_STEPS,
        generic: live,
      });
    }
    if (mode === "ai") {
      return await runAiSimulated(persona, startUrl);
    }
  } catch (err) {
    console.error(`Run failed for ${id} (${mode}); using fallback:`, err);
  }
  // For a real URL, never fall back to the AgentGrid-specific curated result.
  return live ? genericResult(persona, []) : getFallbackResult(id);
}

export async function executeRun(
  personaIds: PersonaId[],
  startUrl = "/demo-site",
): Promise<{ mode: RunMode; results: PersonaResult[] }> {
  const live = isLiveUrl(startUrl);
  // A real external URL can ONLY be tested with a real browser — force it,
  // regardless of env. The controlled demo follows the configured mode.
  const mode: RunMode = live ? "browser" : resolveMode();

  // Fast path: pure deterministic fallback (demo only).
  if (mode === "fallback") {
    return { mode, results: runFallback(personaIds) };
  }

  let results: PersonaResult[];
  if (mode === "browser") {
    // Live runs go in parallel for speed. The demo runs sequentially (4 Chromium
    // at once is heavy and the controlled demo doesn't need the speed).
    if (live) {
      results = await Promise.all(
        personaIds.map((id) => runOnePersona(mode, id, startUrl, true)),
      );
    } else {
      results = [];
      for (const id of personaIds) {
        results.push(await runOnePersona(mode, id, startUrl, false));
      }
    }
  } else {
    results = await Promise.all(personaIds.map((id) => runOnePersona(mode, id, startUrl)));
  }

  return { mode, results };
}
