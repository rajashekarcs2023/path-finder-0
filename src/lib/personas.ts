import type { Persona, PersonaId } from "./types";

export const PERSONAS = [
  {
    id: "developer",
    name: "Developer",
    role: "Engineer evaluating whether they can build quickly",
    mission: "Figure out how to build your first AI agent as quickly as possible.",
    successCriteria: [
      "Find quickstart",
      "Find starter template",
      "Understand first build step",
      "Find docs or examples",
    ],
  },
  {
    id: "founder",
    name: "Founder",
    role: "Startup founder evaluating business relevance",
    mission:
      "Understand if AgentGrid is useful for your startup and what pilot use case to start with.",
    successCriteria: [
      "Understand value proposition",
      "Find startup use cases",
      "Find pilot/demo path",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Buyer",
    role: "Ops or innovation lead evaluating credibility",
    mission:
      "Decide whether AgentGrid can automate business workflows and whether it looks credible.",
    successCriteria: [
      "Find enterprise use case",
      "Find security/integration info",
      "Find demo or pilot CTA",
    ],
  },
  {
    id: "student",
    name: "Student / Hackathon Builder",
    role: "Builder looking for fast project ideas and examples",
    mission: "Find examples, project ideas, or a starter template to build quickly.",
    successCriteria: [
      "Find examples",
      "Find starter template",
      "Find community/docs path",
    ],
  },
] as const satisfies readonly Persona[];

export const DEFAULT_PERSONA_IDS: PersonaId[] = [
  "developer",
  "founder",
  "enterprise",
  "student",
];

export function getPersona(id: PersonaId): Persona {
  const persona = PERSONAS.find((p) => p.id === id);
  if (!persona) throw new Error(`Unknown persona: ${id}`);
  return persona;
}

/** Accent color tokens per persona, used across run + results UIs. */
export const PERSONA_THEME: Record<
  PersonaId,
  { ring: string; text: string; dot: string; glow: string; emoji: string }
> = {
  developer: {
    ring: "ring-sky-500/30",
    text: "text-sky-300",
    dot: "bg-sky-400",
    glow: "shadow-sky-500/20",
    emoji: "⌨️",
  },
  founder: {
    ring: "ring-violet-500/30",
    text: "text-violet-300",
    dot: "bg-violet-400",
    glow: "shadow-violet-500/20",
    emoji: "🚀",
  },
  enterprise: {
    ring: "ring-amber-500/30",
    text: "text-amber-300",
    dot: "bg-amber-400",
    glow: "shadow-amber-500/20",
    emoji: "🏢",
  },
  student: {
    ring: "ring-emerald-500/30",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    glow: "shadow-emerald-500/20",
    emoji: "🎓",
  },
};
