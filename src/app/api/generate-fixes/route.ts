import { NextResponse } from "next/server";
import type { PersonaResult } from "@/lib/types";
import { generateFixes } from "@/lib/ai";
import { generateFallbackFixes } from "@/lib/fixGenerator";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let results: PersonaResult[] = [];
  try {
    const body = (await req.json()) as { results?: PersonaResult[] };
    results = body.results ?? [];
  } catch {
    /* fall through to empty */
  }

  if (!results.length) {
    return NextResponse.json({ fixes: [] });
  }

  try {
    const fixes = await generateFixes(results);
    return NextResponse.json({ fixes });
  } catch (err) {
    console.error("generate-fixes route failed, using fallback:", err);
    return NextResponse.json({ fixes: generateFallbackFixes(results) });
  }
}
