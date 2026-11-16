import { broadcastSafe } from "@/lib/broadcast";
import { CHILD_ID } from "@/lib/config";
import { resetToSeed } from "@/lib/seed";
import { channelName } from "@/lib/types";

// Restores the seed (files at seed versions, seed chat, no turns) and tells /toy and /home-base to reload.
export async function POST() {
  const r = await resetToSeed(CHILD_ID);
  await Promise.all([
    broadcastSafe(channelName.toy(CHILD_ID), "reset", {}),
    broadcastSafe(channelName.wall(CHILD_ID), "reset", {}),
  ]);
  return Response.json({ ok: true, ...r });
}
