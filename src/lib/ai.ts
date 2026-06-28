import type {
  AgentAction,
  GeneratedFix,
  JourneyStep,
  Outcome,
  Persona,
  PageObservation,
  PersonaResult,
} from "./types";
import { generateFallbackFixes } from "./fixGenerator";
import { getFallbackResult } from "./fallbackAgent";

/**
 * OpenAI integration — entirely optional. Every function degrades to a
 * deterministic fallback when OPENAI_API_KEY is missing or a call fails, so the
 * app never breaks because of the model.
 */

export function isAIEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// Lazily import the SDK so the bundle/build never depends on it being present.
async function getClient() {
  const { default: OpenAI } = await import("openai");
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function safeParse<T>(content: string | null | undefined): T | null {
  if (!content) return null;
  try {
    return JSON.parse(content) as T;
  } catch {
    // Tolerate fenced or prefixed output.
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as T;
    } catch {
      return null;
    }
  }
}

const NAV_SYSTEM_PROMPT = `You are an autonomous AI buyer persona testing a startup website before launch.
You are not giving generic feedback. You are trying to complete your mission like a real visitor.
You receive your persona, mission, success criteria, the current page observation, and your previous steps.
Choose exactly ONE next action:
- click a visible link/button by its exact visible text
- scroll
- stop with outcome "success", "failure", or "partial"
Be strict. If the website does not clearly help you complete your mission, say so and stop.
Return JSON only, matching one of:
{"type":"click","targetText":"Docs","reason":"..."}
{"type":"scroll","reason":"..."}
{"type":"stop","outcome":"failure","reason":"..."}`;

export async function chooseNextAction(
  persona: Persona,
  observation: PageObservation,
  previousSteps: JourneyStep[],
): Promise<AgentAction> {
  const client = await getClient();
  const userPayload = {
    persona: { name: persona.name, role: persona.role },
    mission: persona.mission,
    successCriteria: persona.successCriteria,
    currentPage: {
      url: observation.url,
      title: observation.title,
      headings: observation.headings,
      links: observation.links.map((l) => l.text),
      buttons: observation.buttons.map((b) => b.text),
      visibleText: observation.visibleText.slice(0, 3000),
    },
    previousSteps: previousSteps.map((s) => ({
      url: s.url,
      action: s.action,
      reasoning: s.reasoning,
    })),
    stepNumber: previousSteps.length + 1,
  };

  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: NAV_SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(userPayload) },
    ],
  });

  const parsed = safeParse<AgentAction>(completion.choices[0]?.message?.content);
  if (!parsed || !("type" in parsed)) {
    return { type: "stop", outcome: "partial", reason: "Could not decide a next action." };
  }
  return parsed;
}

const REPORT_SYSTEM_PROMPT = `You are an AI buyer persona that just finished navigating a startup website on a mission.
Produce a strict, honest verdict. Return JSON only:
{"outcome":"failure|partial|success","score":0-100,"confusionPoint":"...","quote":"first-person quote","conversionBlocker":"...","recommendedFix":"concrete website/onboarding fix"}`;

export async function generatePersonaReport(
  persona: Persona,
  journey: JourneyStep[],
): Promise<PersonaResult> {
  const client = await getClient();
  const userPayload = {
    persona: { id: persona.id, name: persona.name, role: persona.role },
    mission: persona.mission,
    successCriteria: persona.successCriteria,
    journey: journey.map((s) => ({
      url: s.url,
      observation: s.observationSummary,
      action: s.action,
      reasoning: s.reasoning,
    })),
  };

  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.5,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: REPORT_SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(userPayload) },
    ],
  });

  const parsed = safeParse<{
    outcome: Outcome;
    score: number;
    confusionPoint: string;
    quote: string;
    conversionBlocker: string;
    recommendedFix: string;
  }>(completion.choices[0]?.message?.content);

  if (!parsed) return { ...getFallbackResult(persona.id), journey };

  return {
    personaId: persona.id,
    personaName: persona.name,
    mission: persona.mission,
    outcome: parsed.outcome ?? "partial",
    score: typeof parsed.score === "number" ? Math.round(parsed.score) : 60,
    journey,
    confusionPoint: parsed.confusionPoint ?? "",
    quote: parsed.quote ?? "",
    conversionBlocker: parsed.conversionBlocker ?? "",
    recommendedFix: parsed.recommendedFix ?? "",
  };
}

const FIXES_SYSTEM_PROMPT = `You are a senior GTM/conversion engineer. Given AI buyer-persona test results for a pre-launch website, generate concrete website and onboarding fixes.
Do NOT invent conversion-lift percentages. Use qualitative impact: "High", "Medium", or "Low".
Return JSON only: {"fixes":[{"title":"...","affectedPersona":"...","issue":"...","evidence":"...","recommendation":"...","generatedCopy":"ready-to-paste copy","impact":"High|Medium|Low"}]}`;

export async function generateFixes(results: PersonaResult[]): Promise<GeneratedFix[]> {
  if (!isAIEnabled()) return generateFallbackFixes(results);
  try {
    const client = await getClient();
    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: FIXES_SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify(
            results.map((r) => ({
              persona: r.personaName,
              outcome: r.outcome,
              score: r.score,
              confusionPoint: r.confusionPoint,
              conversionBlocker: r.conversionBlocker,
              recommendedFix: r.recommendedFix,
            })),
          ),
        },
      ],
    });

    const parsed = safeParse<{ fixes: Omit<GeneratedFix, "id">[] }>(
      completion.choices[0]?.message?.content,
    );
    if (!parsed?.fixes?.length) return generateFallbackFixes(results);
    return parsed.fixes.map((f, i) => ({ id: `fix_${i + 1}`, ...f }));
  } catch (err) {
    console.error("generateFixes failed, using fallback:", err);
    return generateFallbackFixes(results);
  }
}
