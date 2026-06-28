"use client";

import type { GeneratedFix, LaunchQARun, PersonaId } from "./types";

/**
 * Client-side persistence via sessionStorage. The run executes server-side, but
 * we mirror the result in the browser so navigating /setup → /run → /results
 * survives a full page load without a database. Results/run pages fall back to
 * seeded demo data when nothing is stored.
 */

const CONFIG_KEY = "launchqa:config";
const RUN_KEY = "launchqa:run";
const FIXES_KEY = "launchqa:fixes";

export type SetupConfig = {
  companyName: string;
  websiteUrl: string;
  productDescription: string;
  launchGoal: string;
  personas: PersonaId[];
  conversionGoals: string;
};

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sessionStorage unavailable — ignore */
  }
}

export const saveConfig = (c: SetupConfig) => write(CONFIG_KEY, c);
export const loadConfig = () => read<SetupConfig>(CONFIG_KEY);

export const saveRun = (run: LaunchQARun) => write(RUN_KEY, run);
export const loadRun = () => read<LaunchQARun>(RUN_KEY);

export const saveFixes = (fixes: GeneratedFix[]) => write(FIXES_KEY, fixes);
export const loadFixes = () => read<GeneratedFix[]>(FIXES_KEY);
