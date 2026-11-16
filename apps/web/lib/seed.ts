// Restores the demo seed (PLAN.md Part D) for one child (server-only). Used by /api/reset.
import seed from "../../../content/seed.json";
import { supabaseAdmin } from "./supabase/server";

export async function resetToSeed(child: string): Promise<{ files: number; messages: number }> {
  const sb = supabaseAdmin();
  for (const t of ["turns", "messages", "agent_files"]) {
    const { error } = await sb.from(t).delete().eq("child_id", child);
    if (error) throw new Error(`reset ${t}: ${error.message}`);
  }
  const files = seed.files.map((f) => ({ ...f, child_id: child }));
  const { error: fe } = await sb.from("agent_files").insert(files);
  if (fe) throw new Error(`seed files: ${fe.message}`);
  const chat = seed.chat.map((m) => ({ ...m, child_id: child, audio_url: null }));
  const { error: me } = await sb.from("messages").insert(chat);
  if (me) throw new Error(`seed chat: ${me.message}`);
  const { error: de } = await sb
    .from("demo_state")
    .upsert({ child_id: child, clock_offset_ms: 0, show_timings: false, updated_at: new Date().toISOString() });
  if (de) throw new Error(`seed demo_state: ${de.message}`);
  return { files: files.length, messages: chat.length };
}
