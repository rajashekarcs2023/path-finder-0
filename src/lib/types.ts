export type PersonaId = "developer" | "founder" | "enterprise" | "student";

export type Persona = {
  id: PersonaId;
  name: string;
  role: string;
  mission: string;
  successCriteria: string[];
};

export type PageObservation = {
  url: string;
  title: string;
  headings: string[];
  links: { text: string; href: string }[];
  buttons: { text: string }[];
  visibleText: string;
};

export type AgentAction =
  | { type: "click"; targetText: string; reason: string }
  | { type: "scroll"; reason: string }
  | { type: "stop"; outcome: "success" | "failure" | "partial"; reason: string };

export type Outcome = "success" | "failure" | "partial";

export type JourneyStep = {
  stepNumber: number;
  url: string;
  observationSummary: string;
  action: string;
  reasoning: string;
};

export type PersonaResult = {
  personaId: PersonaId;
  personaName: string;
  mission: string;
  outcome: Outcome;
  score: number;
  journey: JourneyStep[];
  confusionPoint: string;
  quote: string;
  conversionBlocker: string;
  recommendedFix: string;
};

export type RunStatus = "created" | "running" | "completed";

export type LaunchQARun = {
  id: string;
  companyName: string;
  websiteUrl: string;
  launchGoal: string;
  personas: PersonaId[];
  status: RunStatus;
  results: PersonaResult[];
  createdAt: number;
  completedAt?: number;
};

export type GeneratedFix = {
  id: string;
  title: string;
  affectedPersona: string;
  issue: string;
  evidence: string;
  recommendation: string;
  generatedCopy: string;
  impact: "High" | "Medium" | "Low";
};

/** Shape of the POST /api/run request body. */
export type RunRequest = {
  companyName?: string;
  websiteUrl?: string;
  launchGoal?: string;
  personas?: PersonaId[];
};
