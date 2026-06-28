import type {
  AgentAction,
  JourneyStep,
  PageObservation,
  Persona,
  PersonaId,
  PersonaResult,
} from "./types";
import { chooseNextAction, generatePersonaReport, isAIEnabled } from "./ai";
import { getFallbackResult } from "./fallbackAgent";

/**
 * Real browser navigation with Playwright Chromium. This is the most
 * "impressive but fragile" path, so it is wrapped end-to-end: ANY failure
 * (missing browser binary, timeout, navigation error) returns the polished
 * deterministic fallback for that persona. The browser is always closed.
 *
 * Enabled only when USE_BROWSER_AGENT=true. Otherwise the run engine uses the
 * AI-over-static-pages path or the pure fallback.
 */

function baseUrl(): string {
  return process.env.PATHFINDER_BASE_URL || "http://localhost:3000";
}

function absolute(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${baseUrl().replace(/\/$/, "")}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

// Page-extraction script executed in the browser context.
const EXTRACT = `() => {
  const clean = (el) => (el.textContent || '').replace(/\\s+/g, ' ').trim();
  const headings = Array.from(document.querySelectorAll('h1,h2,h3')).map(clean).filter(Boolean);
  const links = Array.from(document.querySelectorAll('a'))
    .map((a) => ({ text: clean(a), href: a.getAttribute('href') || '' }))
    .filter((l) => l.text);
  const buttons = Array.from(document.querySelectorAll('button,[role=button]'))
    .map((b) => ({ text: clean(b) }))
    .filter((b) => b.text);
  const visibleText = ((document.body && document.body.innerText) || '')
    .replace(/\\s+/g, ' ').trim().slice(0, 3000);
  return { url: location.pathname, title: document.title, headings, links, buttons, visibleText };
}`;

// Persona-appropriate link preferences used when no OpenAI key is present but
// we still navigate a real browser.
const HEURISTIC_PATH: Record<PersonaId, string[]> = {
  developer: ["docs", "api", "examples", "pricing"],
  founder: ["examples", "pricing", "enterprise"],
  enterprise: ["enterprise", "pricing", "docs"],
  student: ["examples", "docs", "pricing"],
};

function heuristicAction(
  persona: Persona,
  observation: PageObservation,
  previousSteps: JourneyStep[],
): AgentAction {
  const visited = new Set(previousSteps.map((s) => s.url));
  const prefs = HEURISTIC_PATH[persona.id];
  for (const pref of prefs) {
    const link = observation.links.find(
      (l) =>
        (l.text.toLowerCase().includes(pref) || l.href.toLowerCase().includes(pref)) &&
        l.href.startsWith("/") &&
        !visited.has(l.href),
    );
    if (link) {
      return {
        type: "click",
        targetText: link.text,
        reason: `As a ${persona.name.toLowerCase()}, ${link.text} is my most likely next step toward my mission.`,
      };
    }
  }
  return {
    type: "stop",
    outcome: "partial",
    reason: "I explored the obvious paths but did not clearly complete my mission.",
  };
}

async function decideAction(
  persona: Persona,
  observation: PageObservation,
  previousSteps: JourneyStep[],
): Promise<AgentAction> {
  if (isAIEnabled()) {
    try {
      return await chooseNextAction(persona, observation, previousSteps);
    } catch (err) {
      console.error("chooseNextAction failed, using heuristic:", err);
    }
  }
  return heuristicAction(persona, observation, previousSteps);
}

function summarize(obs: PageObservation): string {
  const heading = obs.headings[0] ? `“${obs.headings[0]}”` : obs.title;
  const nav = obs.links
    .filter((l) => l.href.startsWith("/"))
    .map((l) => l.text)
    .slice(0, 5)
    .join(", ");
  return `${heading}${nav ? ` · nav: ${nav}` : ""}`;
}

export async function runPersonaJourney({
  persona,
  startUrl,
  maxSteps = 5,
}: {
  persona: Persona;
  startUrl: string;
  maxSteps?: number;
}): Promise<PersonaResult> {
  let browser: import("playwright").Browser | null = null;
  try {
    const { chromium } = await import("playwright");
    browser = await chromium.launch({
      headless: process.env.HEADLESS !== "false",
    });
    const page = await browser.newPage();
    await page.goto(absolute(startUrl), { waitUntil: "domcontentloaded", timeout: 15000 });

    const journey: JourneyStep[] = [];

    for (let step = 1; step <= maxSteps; step++) {
      const observation = (await page.evaluate(EXTRACT)) as PageObservation;
      const action = await decideAction(persona, observation, journey);

      if (action.type === "stop") {
        journey.push({
          stepNumber: step,
          url: observation.url,
          observationSummary: summarize(observation),
          action: `Stopped — ${action.outcome}`,
          reasoning: action.reason,
        });
        break;
      }

      if (action.type === "scroll") {
        await page.evaluate("window.scrollBy(0, window.innerHeight)");
        journey.push({
          stepNumber: step,
          url: observation.url,
          observationSummary: summarize(observation),
          action: "Scrolled to read more",
          reasoning: action.reason,
        });
        continue;
      }

      // click
      const target = action.targetText;
      journey.push({
        stepNumber: step,
        url: observation.url,
        observationSummary: summarize(observation),
        action: `Clicked “${target}”`,
        reasoning: action.reason,
      });

      const link = page
        .locator(`a:has-text("${target.replace(/"/g, '\\"')}")`)
        .first();
      const button = page
        .locator(`button:has-text("${target.replace(/"/g, '\\"')}")`)
        .first();

      try {
        if (await link.count()) {
          await Promise.all([
            page.waitForLoadState("domcontentloaded", { timeout: 10000 }).catch(() => {}),
            link.click({ timeout: 5000 }),
          ]);
        } else if (await button.count()) {
          await button.click({ timeout: 5000 }).catch(() => {});
        } else {
          // Target not actually present — record and stop to stay honest.
          journey.push({
            stepNumber: step + 1,
            url: observation.url,
            observationSummary: summarize(observation),
            action: `Could not find “${target}”`,
            reasoning: "The element I wanted was not on the page, so I could not proceed.",
          });
          break;
        }
      } catch {
        break;
      }
    }

    // Build the verdict.
    if (isAIEnabled()) {
      try {
        return await generatePersonaReport(persona, journey);
      } catch (err) {
        console.error("generatePersonaReport failed, using curated verdict:", err);
      }
    }
    // Curated verdict + the REAL observed journey when we captured one.
    const curated = getFallbackResult(persona.id);
    return { ...curated, journey: journey.length ? journey : curated.journey };
  } catch (err) {
    console.error(`runPersonaJourney failed for ${persona.id}, using fallback:`, err);
    return getFallbackResult(persona.id);
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
