import type { LaunchQARun, PersonaResult } from "./types";

/**
 * In-memory run store. Sufficient for the hackathon demo: a single Next.js
 * server process keeps the latest runs in module memory. To move to Convex
 * later, keep these four function signatures and swap the implementation.
 */
declare global {
  // eslint-disable-next-line no-var
  var __launchqaStore: Map<string, LaunchQARun> | undefined;
  // eslint-disable-next-line no-var
  var __launchqaLatestId: string | undefined;
}

const runs: Map<string, LaunchQARun> =
  globalThis.__launchqaStore ?? (globalThis.__launchqaStore = new Map());

function setLatest(id: string) {
  globalThis.__launchqaLatestId = id;
}

let counter = 0;
function makeId(): string {
  counter += 1;
  // Avoid Date.now()/Math.random() determinism concerns; uniqueness within a
  // process is all we need for the demo store.
  return `run_${counter.toString(36)}_${runs.size.toString(36)}${process.hrtime.bigint().toString(36)}`;
}

export function createRun(
  input: Omit<LaunchQARun, "id" | "status" | "results" | "createdAt" | "completedAt">,
): LaunchQARun {
  const id = makeId();
  const run: LaunchQARun = {
    id,
    ...input,
    status: "created",
    results: [],
    createdAt: Date.now(),
  };
  runs.set(id, run);
  setLatest(id);
  return run;
}

export function getRun(id: string): LaunchQARun | undefined {
  return runs.get(id);
}

export function saveRunResults(id: string, results: PersonaResult[]): LaunchQARun | undefined {
  const run = runs.get(id);
  if (!run) return undefined;
  run.results = results;
  run.status = "completed";
  run.completedAt = Date.now();
  runs.set(id, run);
  setLatest(id);
  return run;
}

export function getLatestRun(): LaunchQARun | undefined {
  const id = globalThis.__launchqaLatestId;
  return id ? runs.get(id) : undefined;
}
