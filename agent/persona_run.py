#!/usr/bin/env python
"""
browser-use bridge for path-finder-0.

Reads a JSON request on STDIN:
  {"url": "...", "personas": [{"id","name","role","mission","successCriteria"}],
   "maxSteps": 7, "concurrency": 2}

Runs each AI buyer persona through browser-use (Gemini 3.5 Flash) against the
real URL, then prints a JSON array of PersonaResult objects on STDOUT.

All human-readable logs go to STDERR so STDOUT stays clean JSON for the Node
caller. Spawned by src/lib/browserUseAgent.ts during a live run.

Requires: a Python env with `browser-use` installed and GEMINI_API_KEY (or
GOOGLE_API_KEY) in the environment.
"""
import asyncio
import json
import os
import re
import sys

try:
    from dotenv import load_dotenv

    load_dotenv()  # pick up GEMINI_API_KEY/GOOGLE_API_KEY from a local .env if present
except Exception:
    pass


def log(*a):
    print(*a, file=sys.stderr, flush=True)


JSON_INSTRUCTION = (
    "When you are finished, call done with text that is ONLY a single JSON object "
    "(no markdown fences) with exactly these keys: "
    '{"outcome": one of "success" | "partial" | "failure", '
    '"score": integer 0-100 for how easily you could complete your mission, '
    '"confusionPoint": one short sentence on where you got stuck (or "" if none), '
    '"quote": a first-person quote in your persona voice, '
    '"conversionBlocker": the main thing stopping you from converting (or ""), '
    '"recommendedFix": one concrete website or onboarding fix}.'
)


def build_task(url: str, p: dict) -> str:
    criteria = "; ".join(p.get("successCriteria", []) or [])
    return (
        f"You are a {p['name']} ({p.get('role', '')}). You are visiting the website "
        f"{url} for the first time. Your mission: {p['mission']} "
        f"Success looks like: {criteria}. "
        "Navigate the site like a real visitor genuinely trying to accomplish this "
        "mission. Be strict and honest: if the site does not clearly help you, say so. "
        "Do NOT log in, sign up, or submit any forms. Visit at most a few pages. "
        + JSON_INSTRUCTION
    )


def parse_verdict(text: str | None) -> dict:
    if not text:
        return {}
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if not m:
        return {}
    try:
        return json.loads(m.group(0))
    except Exception:
        return {}


def build_journey(history) -> list:
    steps = []
    try:
        thoughts = history.model_thoughts()
    except Exception:
        thoughts = []
    try:
        urls = history.urls()
    except Exception:
        urls = []
    try:
        actions = history.action_names()
    except Exception:
        actions = []

    count = max(len(thoughts), len(actions))
    for i in range(count):
        th = thoughts[i] if i < len(thoughts) else None
        url = urls[i] if i < len(urls) else (urls[-1] if urls else "")
        action_name = actions[i] if i < len(actions) else ""
        goal = getattr(th, "next_goal", "") if th else ""
        prev = getattr(th, "evaluation_previous_goal", "") if th else ""
        label = (action_name or goal or "Acted").strip()
        steps.append(
            {
                "stepNumber": i + 1,
                "url": (url or "")[:300],
                "observationSummary": (prev or "")[:260],
                "action": label[:90],
                "reasoning": (goal or "")[:260],
            }
        )
    return steps


def to_result(p: dict, verdict: dict, journey: list) -> dict:
    outcome = verdict.get("outcome")
    if outcome not in ("success", "partial", "failure"):
        outcome = "partial"
    try:
        score = int(verdict.get("score"))
    except Exception:
        score = 55
    score = max(0, min(100, score))
    return {
        "personaId": p["id"],
        "personaName": p["name"],
        "mission": p["mission"],
        "outcome": outcome,
        "score": score,
        "journey": journey,
        "confusionPoint": (verdict.get("confusionPoint") or "")[:400],
        "quote": (verdict.get("quote") or "")[:400],
        "conversionBlocker": (verdict.get("conversionBlocker") or "")[:400],
        "recommendedFix": (verdict.get("recommendedFix") or "")[:400],
    }


def fallback_result(p: dict, note: str) -> dict:
    return {
        "personaId": p["id"],
        "personaName": p["name"],
        "mission": p["mission"],
        "outcome": "partial",
        "score": 30,
        "journey": [],
        "confusionPoint": note,
        "quote": "",
        "conversionBlocker": "The live run could not be completed.",
        "recommendedFix": "Retry, or confirm the URL is reachable.",
    }


async def run_persona(url: str, p: dict, max_steps: int, sem: asyncio.Semaphore) -> dict:
    from browser_use import Agent, ChatGoogle

    async with sem:
        log(f"[{p['id']}] starting browser-use on {url}")
        try:
            llm = ChatGoogle(model=os.getenv("GEMINI_MODEL", "gemini-3.5-flash"))
            agent = Agent(task=build_task(url, p), llm=llm)
            history = await agent.run(max_steps=max_steps)
        except Exception as e:  # noqa: BLE001
            log(f"[{p['id']}] error: {e}")
            return fallback_result(p, f"The agent could not complete the run: {e}")

        try:
            final = history.final_result() or ""
        except Exception:
            final = ""
        verdict = parse_verdict(final)
        journey = build_journey(history)
        log(f"[{p['id']}] done — {len(journey)} steps, outcome={verdict.get('outcome')}")
        return to_result(p, verdict, journey)


async def main():
    req = json.loads(sys.stdin.read())
    url = req["url"]
    personas = req["personas"]
    max_steps = int(req.get("maxSteps", 7))
    concurrency = max(1, int(req.get("concurrency", 2)))
    sem = asyncio.Semaphore(concurrency)
    results = await asyncio.gather(
        *[run_persona(url, p, max_steps, sem) for p in personas]
    )
    print(json.dumps(results))


if __name__ == "__main__":
    asyncio.run(main())
