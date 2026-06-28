# path-finder-0 — AI GTM QA before you send traffic

path-finder-0 sends **autonomous AI buyer personas** through a startup's website
*before launch*. Each persona gets a real GTM mission, navigates the site, and
path-finder-0 shows exactly where each persona gets confused, whether they'd convert,
and the precise website/onboarding fixes that would improve conversion.

> Don't wait for analytics to tell you your launch leaked. Run AI GTM QA before
> you send traffic.

path-finder-0 is **not** a chatbot, a generic website audit, or a fake-analytics
dashboard. It's mission-based AI website testing.

---

## What's in the demo

A self-contained demo that runs on a controlled, intentionally-flawed sample
site (**AgentGrid**) so the story is reliable every time:

- **`/`** — path-finder-0 marketing homepage
- **`/setup`** — prefilled run configuration (AgentGrid, 4 personas)
- **`/run`** — live screen where 4 AI personas navigate the site step by step
- **`/results`** — launch-readiness score, per-persona blockers, generated fixes, before/after preview
- **`/demo-site`** + subpages — the AgentGrid site being tested (with deliberate conversion problems)
- **`/demo-site-improved`** — the same site after path-finder-0's fixes (the "wow" payoff)

The four personas: **Developer**, **Founder**, **Enterprise Buyer**, and
**Student / Hackathon Builder** — each with its own mission and success criteria.

---

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

That's it. **The full demo works with no API keys and no browser setup** — it
uses a deterministic fallback agent that produces polished, consistent results.

### Optional: real AI reasoning

Copy `.env.example` to `.env.local` and set an OpenAI key to have the personas
reason for real (non-deterministic) over the modeled site:

```bash
cp .env.example .env.local
# then edit .env.local:
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini   # optional, this is the default
```

Without a key, path-finder-0 automatically uses the fallback agent — nothing breaks.

### Optional: real browser navigation (Playwright)

To watch a real Chromium browser actually crawl `/demo-site`:

```bash
npm run playwright:install   # one-time: installs Chromium
```

Then set in `.env.local`:

```bash
USE_BROWSER_AGENT=true
HEADLESS=true                # set "false" to watch the browser live
PATHFINDER_BASE_URL=http://localhost:3000
```

The dev server must be running so the browser has a site to visit. If Playwright
fails for any reason (missing binary, timeout), each persona gracefully falls
back to its deterministic result — the demo never breaks.

---

## Run modes (priority order)

path-finder-0 picks the best available mode automatically:

| Mode | When | What happens |
| --- | --- | --- |
| **Live browser** | `USE_BROWSER_AGENT=true` | Real Playwright Chromium navigates `/demo-site` |
| **AI** | `OPENAI_API_KEY` set | OpenAI reasons over the modeled site, step by step |
| **Fallback** | default | Deterministic, polished persona journeys |

Every mode degrades safely to fallback on any error, per persona.

---

## 3-minute demo script

1. **Open the homepage (`/`).** "Startups spend money sending traffic to a
   website they've never tested from each buyer's point of view. path-finder-0 sends
   AI buyer personas through the site *before* launch."
2. **Go to `/setup`.** Show **AgentGrid** prefilled — company, website
   (`/demo-site`), launch goal, and the four personas already selected.
3. **Click "Run path-finder-0".** You land on `/run`.
4. **Watch the personas navigate.** Four AI agents each run their mission and
   reveal their journey step by step — reading the homepage, clicking Docs,
   clicking API Reference, and so on. This is the moment that shows it's *agents
   testing a site*, not a chatbot.
5. **Click "View full results".** On `/results`, show the **launch-readiness
   score** and the per-persona outcomes.
6. **Open the Developer result.** It **failed** to find a quickstart — it went
   homepage → Docs → API Reference and never found a starter template.
7. **Open the Enterprise result.** It found the enterprise page but **no
   security / integration trust** before the demo CTA.
8. **Scroll to the generated fixes.** Concrete, copy-pasteable: a developer
   quickstart CTA, a startup-use-case pilot, a security & integrations block, a
   hackathon starter kit, and a rewritten hero with a role selector.
9. **Open the improved site (`/demo-site-improved`).** Show the same site with
   the fixes shipped: "Build and deploy your first AI agent in 10 minutes,"
   starter templates, a security block, and a "Which path are you?" selector.
10. **Close:** "Orange Slice finds who wants to buy. path-finder-0 tests whether your
    website can convert them once they arrive."

---

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v3**
- **Playwright** (optional, lazy-loaded) for real browser navigation
- **OpenAI** (optional, lazy-loaded) for real persona reasoning
- In-memory run store (no database required for the demo)

### Project structure

```
src/
  app/
    page.tsx                     # / — path-finder-0 homepage
    setup/page.tsx               # /setup
    run/page.tsx                 # /run — live persona run
    results/page.tsx             # /results — dashboard + fixes
    demo-site/…                  # the AgentGrid site under test
    demo-site-improved/page.tsx  # the fixed site
    api/run/route.ts             # POST /api/run  (executes a run)
    api/generate-fixes/route.ts  # POST /api/generate-fixes
  components/                    # LaunchHero, SetupForm, PersonaRunCard,
                                 # JourneyTimeline, ResultsDashboard, FixCard,
                                 # BeforeAfterPreview, DemoSiteLayout
  lib/
    types.ts personas.ts brand.ts
    store.ts clientStore.ts seed.ts score.ts
    fallbackAgent.ts fixGenerator.ts demoSiteData.ts
    ai.ts browserAgent.ts runEngine.ts
```

---

## API

### `POST /api/run`

```json
{
  "companyName": "AgentGrid",
  "websiteUrl": "/demo-site",
  "launchGoal": "Convert developers and enterprise buyers before launch",
  "personas": ["developer", "founder", "enterprise", "student"]
}
```

Returns `{ runId, mode, results, run }` with the completed persona results.

### `POST /api/generate-fixes`

```json
{ "results": [ /* PersonaResult[] */ ] }
```

Returns `{ "fixes": [ /* GeneratedFix[] */ ] }`.

---

## Notes

- **Scope:** This is a hackathon MVP focused on the demo path. No auth, billing,
  CRM, email, real A/B infrastructure, or production-scale crawling.
- **Product name:** the brand lives in one place — `src/lib/brand.ts`. Edit
  `BRAND.name` (and `BRAND.monogram`) to rebrand the entire app — nav wordmarks,
  metadata, hero copy, and demo-site banners all read from it.
