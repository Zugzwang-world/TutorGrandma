// POST /api/brief: Memory posts the evening brief and logs the day in brain.md (PLAN.md C12).
// Called by the 19:00 Routine job or the presenter. No body needed. Returns { ok, messageId, toVersion }.
import { runBrief } from "@/lib/agents/memory-brief";

export const maxDuration = 60;

export async function POST() {
  const t0 = Date.now();
  try {
    const r = await runBrief();
    console.log(`[brief] ${JSON.stringify({ ...r, ms: Date.now() - t0 })}`);
    return Response.json(r);
  } catch (e) {
    console.error(`[brief] failed: ${(e as Error).message}`);
    return Response.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
