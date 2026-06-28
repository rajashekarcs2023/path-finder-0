import type { Outcome, PersonaResult } from "./types";

/** Overall launch-readiness score = average of persona scores. */
export function overallReadiness(results: PersonaResult[]): number {
  if (!results.length) return 0;
  return Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
}

export function readinessLabel(score: number): string {
  if (score >= 80) return "Launch-ready";
  if (score >= 65) return "Almost ready";
  if (score >= 50) return "Leaky funnel";
  return "Not launch-ready";
}

/** Maps a 0–100 score to a status tone used by badges/rings. */
export function scoreTone(score: number): "success" | "partial" | "failure" {
  if (score >= 75) return "success";
  if (score >= 50) return "partial";
  return "failure";
}

export const OUTCOME_LABEL: Record<Outcome, string> = {
  success: "Success",
  partial: "Partial",
  failure: "Failed",
};

export const OUTCOME_TONE: Record<Outcome, "success" | "partial" | "failure"> = {
  success: "success",
  partial: "partial",
  failure: "failure",
};
