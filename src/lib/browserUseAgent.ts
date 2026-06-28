import type { PersonaId, PersonaResult } from "./types";
import { getPersona } from "./personas";

/**
 * Bridge to the Python browser-use + Gemini agent (agent/persona_run.py).
 *
 * Spawns the script, writes a JSON request to its stdin, and parses the JSON
 * result from stdout. Returns null if browser-use isn't configured or the run
 * fails — so the run engine can fall back to the in-process Playwright+OpenAI
 * live mode and never break.
 *
 * Enable by setting (in .env.local):
 *   USE_BROWSER_USE=true
 *   PYTHON_BIN=/abs/path/to/venv/bin/python   # a venv with `browser-use` installed
 *   GEMINI_API_KEY=...                          # (or GOOGLE_API_KEY)
 */
export function isBrowserUseEnabled(): boolean {
  return (
    process.env.USE_BROWSER_USE === "true" && Boolean(process.env.PYTHON_BIN)
  );
}

export async function runWithBrowserUse(
  url: string,
  personaIds: PersonaId[],
): Promise<PersonaResult[] | null> {
  if (!isBrowserUseEnabled()) return null;

  const { spawn } = await import("node:child_process");
  const path = await import("node:path");

  const pythonBin = process.env.PYTHON_BIN as string;
  const script = path.join(process.cwd(), "agent", "persona_run.py");

  const personas = personaIds.map((id) => {
    const p = getPersona(id);
    return {
      id: p.id,
      name: p.name,
      role: p.role,
      mission: p.mission,
      successCriteria: p.successCriteria,
    };
  });

  const payload = JSON.stringify({
    url,
    personas,
    maxSteps: Number(process.env.BROWSER_USE_MAX_STEPS || 7),
    concurrency: Number(process.env.BROWSER_USE_CONCURRENCY || 2),
  });

  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    const child = spawn(pythonBin, [script], {
      cwd: process.cwd(),
      env: { ...process.env },
    });

    const killTimer = setTimeout(
      () => child.kill("SIGKILL"),
      Number(process.env.BROWSER_USE_TIMEOUT_MS || 110000),
    );

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("error", (err) => {
      clearTimeout(killTimer);
      console.error("browser-use spawn error:", err);
      resolve(null);
    });

    child.on("close", (code) => {
      clearTimeout(killTimer);
      if (code !== 0) {
        console.error(`browser-use exited ${code}:`, stderr.slice(-600));
      }
      try {
        // Our result is the last JSON array printed on stdout (logs go to stderr).
        const match = stdout.trim().match(/\[[\s\S]*\]\s*$/);
        if (!match) {
          console.error("browser-use: no JSON array on stdout");
          resolve(null);
          return;
        }
        const parsed = JSON.parse(match[0]) as PersonaResult[];
        resolve(Array.isArray(parsed) && parsed.length ? parsed : null);
      } catch (e) {
        console.error("browser-use parse error:", e);
        resolve(null);
      }
    });

    child.stdin.write(payload);
    child.stdin.end();
  });
}
