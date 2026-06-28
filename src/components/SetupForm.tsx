"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { saveConfig, type SetupConfig } from "@/lib/clientStore";
import { PERSONAS, DEFAULT_PERSONA_IDS, PERSONA_THEME } from "@/lib/personas";
import type { PersonaId } from "@/lib/types";
import { BRAND } from "@/lib/brand";

const INPUT_CLASS =
  "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400/50";
const LABEL_CLASS = "block text-sm font-medium text-slate-300 mb-1.5";

/**
 * Prefilled LaunchQA configuration form. On submit it persists the config to
 * sessionStorage and routes to /run. Designed to demo in a single click.
 */
export default function SetupForm() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("AgentGrid");
  const [websiteUrl, setWebsiteUrl] = useState("/demo-site");
  const [productDescription, setProductDescription] = useState(
    "AI infrastructure for building, deploying, and discovering AI agents",
  );
  const [launchGoal, setLaunchGoal] = useState(
    "Convert developers and enterprise buyers before launch",
  );
  const [conversionGoals, setConversionGoals] = useState(
    "Developer activation, enterprise demo requests, founder pilots",
  );
  const [personas, setPersonas] = useState<PersonaId[]>([
    ...DEFAULT_PERSONA_IDS,
  ]);
  const [submitting, setSubmitting] = useState(false);

  function togglePersona(id: PersonaId) {
    setPersonas((prev) => {
      if (prev.includes(id)) {
        // Keep at least one persona selected.
        if (prev.length === 1) return prev;
        return prev.filter((p) => p !== id);
      }
      return [...prev, id];
    });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const config: SetupConfig = {
      companyName,
      websiteUrl,
      productDescription,
      launchGoal,
      personas,
      conversionGoals,
    };
    saveConfig(config);
    router.push("/run");
  }

  return (
    <form onSubmit={handleSubmit} className="lq-card p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="companyName" className={LABEL_CLASS}>
            Company name
          </label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="AgentGrid"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="websiteUrl" className={LABEL_CLASS}>
            Website URL
          </label>
          <input
            id="websiteUrl"
            type="text"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="/demo-site"
            className={INPUT_CLASS}
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Use{" "}
            <span className="font-mono text-slate-400">/demo-site</span> — the
            controlled demo site {BRAND.name} crawls for this walkthrough.
          </p>
        </div>

        <div>
          <label htmlFor="productDescription" className={LABEL_CLASS}>
            Product description
          </label>
          <textarea
            id="productDescription"
            rows={3}
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="What does your product do?"
            className={`${INPUT_CLASS} resize-none`}
          />
        </div>

        <div>
          <label htmlFor="launchGoal" className={LABEL_CLASS}>
            Launch goal
          </label>
          <input
            id="launchGoal"
            type="text"
            value={launchGoal}
            onChange={(e) => setLaunchGoal(e.target.value)}
            placeholder="What does a successful launch look like?"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="conversionGoals" className={LABEL_CLASS}>
            Conversion goals
          </label>
          <input
            id="conversionGoals"
            type="text"
            value={conversionGoals}
            onChange={(e) => setConversionGoals(e.target.value)}
            placeholder="Which conversions matter most?"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <span className={LABEL_CLASS}>Buyer personas</span>
          <p className="mb-3 text-xs text-slate-500">
            Each persona runs an autonomous mission through your site.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {PERSONAS.map((persona) => {
              const theme = PERSONA_THEME[persona.id];
              const selected = personas.includes(persona.id);
              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => togglePersona(persona.id)}
                  aria-pressed={selected}
                  className={[
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                    selected
                      ? `border-white/10 bg-white/[0.06] ring-1 ${theme.ring} ${theme.text}`
                      : "border-white/10 bg-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200",
                  ].join(" ")}
                >
                  <span aria-hidden>{theme.emoji}</span>
                  <span>{persona.name}</span>
                  {selected ? (
                    <span aria-hidden className="text-xs">
                      ✓
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="lq-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Launching…" : `Run ${BRAND.name}`}
          </button>
        </div>
      </div>
    </form>
  );
}
