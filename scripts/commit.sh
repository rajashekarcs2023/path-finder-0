#!/usr/bin/env bash
# Commits remaining source files in small chunks with short hackathon-style messages.
# Excludes all .md files. Uses real timestamps (no faked history).
set -euo pipefail

cd "$(dirname "$0")/.."

commit() {
  local msg="$1"; shift
  # only add paths that exist and are not .md
  local paths=()
  for p in "$@"; do
    [[ "$p" == *.md ]] && continue
    [[ -e "$p" ]] && paths+=("$p")
  done
  if [[ ${#paths[@]} -eq 0 ]]; then
    echo "skip: $msg (nothing to add)"
    return
  fi
  git add -- "${paths[@]}"
  if git diff --cached --quiet; then
    echo "skip: $msg (no staged changes)"
    return
  fi
  git commit -q -m "$msg"
  echo "ok: $msg"
}

commit "types + personas"        src/lib/types.ts src/lib/personas.ts
commit "brand config"            src/lib/brand.ts
commit "demo site data"          src/lib/demoSiteData.ts
commit "seed results"            src/lib/seed.ts
commit "fallback agent"          src/lib/fallbackAgent.ts
commit "ai action picker"        src/lib/ai.ts
commit "playwright browser agent" src/lib/browserAgent.ts
commit "run engine"              src/lib/runEngine.ts
commit "scoring"                 src/lib/score.ts
commit "fix generator"           src/lib/fixGenerator.ts
commit "run store"               src/lib/store.ts
commit "client store"            src/lib/clientStore.ts

commit "launch hero"             src/components/LaunchHero.tsx
commit "setup form"              src/components/SetupForm.tsx
commit "persona run card"        src/components/PersonaRunCard.tsx
commit "journey timeline"        src/components/JourneyTimeline.tsx
commit "results dashboard"       src/components/ResultsDashboard.tsx
commit "fix card"                src/components/FixCard.tsx
commit "before/after preview"    src/components/BeforeAfterPreview.tsx
commit "demo site layout"        src/components/DemoSiteLayout.tsx

commit "app layout + globals"    src/app/layout.tsx src/app/globals.css
commit "homepage"                src/app/page.tsx
commit "setup page"              src/app/setup/page.tsx
commit "run page"                src/app/run/page.tsx
commit "results page"            src/app/results/page.tsx
commit "run api"                 src/app/api/run/route.ts
commit "generate-fixes api"      src/app/api/generate-fixes/route.ts

commit "demo site home"          src/app/demo-site/page.tsx
commit "demo docs"               src/app/demo-site/docs/page.tsx
commit "demo api docs"           src/app/demo-site/docs/api/page.tsx
commit "demo examples"           src/app/demo-site/examples/page.tsx
commit "demo enterprise"         src/app/demo-site/enterprise/page.tsx
commit "demo pricing"            src/app/demo-site/pricing/page.tsx
commit "improved demo site"      src/app/demo-site-improved/page.tsx

# anything else under src that wasn't caught above (no .md)
commit "remaining src files"     $(git ls-files --others --exclude-standard -- 'src/**' | grep -v '\.md$' || true)

echo "done"
