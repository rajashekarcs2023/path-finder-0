import { NextResponse } from "next/server";
import type { RunRequest } from "@/lib/types";
import { DEFAULT_PERSONA_IDS } from "@/lib/personas";
import { createRun, saveRunResults } from "@/lib/store";
import { executeRun } from "@/lib/runEngine";

// Playwright + OpenAI need the Node.js runtime (not edge), and a real run can
// take a little while when the browser agent is enabled.
export const runtime = "nodejs";
// Live (real-browser) runs of several personas can take a while.
export const maxDuration = 120;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: RunRequest = {};
  try {
    body = (await req.json()) as RunRequest;
  } catch {
    // empty body is fine — we fall back to defaults
  }

  const companyName = body.companyName?.trim() || "AgentGrid";
  const websiteUrl = body.websiteUrl?.trim() || "/demo-site";
  const launchGoal =
    body.launchGoal?.trim() || "Convert developers and enterprise buyers before launch";
  const personas =
    body.personas && body.personas.length ? body.personas : DEFAULT_PERSONA_IDS;

  const run = createRun({ companyName, websiteUrl, launchGoal, personas });

  const { mode, results } = await executeRun(personas, websiteUrl);
  const completed = saveRunResults(run.id, results) ?? { ...run, results, status: "completed" as const };

  return NextResponse.json({
    runId: run.id,
    mode,
    results: completed.results,
    run: completed,
  });
}
