// The live brain prompt for one child turn (PLAN.md C3). Server-only (imports nothing client-unsafe, but
// is only used by /api/turn). G3 extends `changesSection`; keep each section a small named function.
//
// System message (stable across turns, so the provider can cache it):
//   persona.md, planner.md, parent.md, brain.md, a heartbeat summary, the wall marker table, reply rules.
// User message (fresh every turn):
//   the last 8 turns, changes since the child's last turn (G3, B7), the board, the last Nani event, the demo time,
//   how to follow the parents' changes (only when there are some), and what the child said.
import type { BrainMessage } from "@/lib/brain";
import { clockParts, type ClockParts } from "@/lib/clock";
import { config } from "@/lib/config";
import { parseJobs, summarizeJobs } from "@/lib/jobs";
import { cueToMarker } from "@/lib/markers";
import type { ChangeGroup } from "@/lib/agents/changes";
import { BOTS, type AgentFile, type BoardState, type FileName, type NaniEvent, type Turn } from "@/lib/types";

const CHILD = config.childName;
const NANI = config.grandmaName;

export interface TurnPromptInput {
  files: Record<FileName, AgentFile>;
  recentTurns: Turn[]; // oldest first, at most 8
  changes: ChangeGroup[]; // parent messages that changed files since the child's last talk turn, oldest first
  unused: ChangeGroup[]; // earlier ones Nani has not been seen to follow yet (at most 3)
  board: BoardState | null;
  lastEvent: NaniEvent | null;
  lastEventFresh: boolean; // no talk turn since that event: the child is probably answering it
  clockOffsetMs: number; // demo clock offset, for the event's time
  clock: ClockParts;
  childText: string;
}

export function buildTurnPrompt(input: TurnPromptInput): BrainMessage[] {
  return [
    { role: "system", content: systemPrompt(input.files) },
    { role: "user", content: userTurn(input) },
  ];
}

// ---------- System message ----------

/** Files in the order C3 gives. heartbeat.md is summarized, not pasted. */
const FILE_ORDER: FileName[] = ["persona", "planner", "parent", "brain"];

export function systemPrompt(files: Record<FileName, AgentFile>): string {
  return [
    `You are ${NANI}, talking out loud through ${CHILD}'s soft toy. Everything you write is spoken by your voice, except markers.`,
    `Below are your files. persona.md is who you are. The parents' house rules (parent.md) and today's plan (planner.md) come before your habits. brain.md is what you remember about ${CHILD}.`,
    ...FILE_ORDER.map((n) => fileSection(files[n])),
    heartbeatSection(files.heartbeat),
    MARKER_TABLE,
    REPLY_RULES,
  ].join("\n\n");
}

export function fileSection(f: AgentFile): string {
  return `<${f.name}.md version="${f.version}">\n${f.content.trim()}\n</${f.name}.md>`;
}

export function heartbeatSection(f: AgentFile): string {
  return `<routine summary="heartbeat.md v${f.version}">\n${summarizeJobs(parseJobs(f.content))}\n</routine>`;
}

export const MARKER_TABLE = `<wall_markers>
Markers drive the wall (a projector). They are never spoken. Put a marker right after the words it goes with.
[[show 🥭 Mango]]               a big emoji with the English word under it
[[spell MANGO 1 M S T]]         the word with a gap at letter 1, and three letter tiles to pick from
[[tile M right]] / [[tile S wrong]]   after ${CHILD} picks a tile: right flies into the gap, wrong wobbles
[[count 🥭 3]] or [[count 🥭 1+1]]    items appear one by one with numbers; sums show "1 + 1 = 2"
[[choices 🎵 Song, 🔤 Letters, 🔢 Count, 🦁 Animals]]   three or four big "What next?" cards
[[cheer 🥭]]                    the emoji jumps, confetti falls, a sticker joins today's strip
[[sound lion]]                  the toy plays an animal sound: lion, cow, cat, dog, elephant, monkey, duck, sheep, horse, rooster
[[song]]                        the toy plays Nani's counting song
[[call mumma]] / [[call papa]]  STARTS a call at once: offer in words first ("Mumma ko dikhaoge?"), use it only after Aarav says yes
[[note routine: …]] [[note rules: …]] [[note lessons: …]] [[note memory: …]] [[note nani: …]]   one casual line for the parents' chat
</wall_markers>`;

export const REPLY_RULES = `<reply_rules>
- One or two short sentences, then one simple question. At most 35 words.
- At most two wall markers. Most replies have no note: add one only for the cases in persona.md's "Telling the parents".
- Plain spoken words only: no emoji, asterisks, lists or stage directions outside markers. No "${NANI}:" label.
- Write the way the examples in persona.md are written.
- If ${CHILD} says he is scared, sad or hurt: comfort him first, then in the SAME reply suggest telling Mumma or Papa ("Mumma ko bataoge?"). Do not start a call.
- If asked whether you are a robot or real: say you are an AI ${NANI}, warmly.
</reply_rules>`;

// ---------- User message ----------

export function userTurn(i: TurnPromptInput): string {
  return [
    recentTurnsSection(i.recentTurns),
    changesSection(i.changes, i.unused),
    boardSection(i.board),
    lastEventSection(i.lastEvent, i.lastEventFresh, i.clockOffsetMs),
    timeSection(i.clock),
    followSection(i.changes, i.unused),
    `${CHILD} said: "${i.childText.trim()}"`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function recentTurnsSection(turns: Turn[]): string {
  if (!turns.length) return `## Last turns\nNone yet today.`;
  const lines: string[] = [];
  for (const t of turns) {
    if (t.child_text) lines.push(`${CHILD}: ${t.child_text}`);
    if (t.nani_text) {
      const markers = (t.cues ?? []).map(cueToMarker).join(" ");
      const tag = t.kind === "talk" ? "" : ` (${t.kind})`;
      lines.push(`${NANI}${tag}: ${t.nani_text}${markers ? ` ${markers}` : ""}`);
    }
  }
  return `## Last turns (oldest first)\n${lines.join("\n")}`;
}

const FILE_OF: Record<string, string> = { rules: "parent.md", lessons: "planner.md", memory: "brain.md" };

function groupLine(g: ChangeGroup): string {
  const where = g.bots.filter((b) => b !== "routine").map((b) => FILE_OF[b]);
  const routine = g.bots.includes("routine") ? `${BOTS.routine.name} will do it on time` : "";
  const tail = [where.length ? `now in ${where.join(" and ")}` : "", routine].filter(Boolean).join("; ");
  return `- ${g.sender}: "${g.words}" (${tail})`;
}

/** "Changes since Aarav's last turn" (B7): what the parents changed, by their own words. */
export function changesSection(changes: ChangeGroup[], unused: ChangeGroup[] = []): string {
  const head = `## Changes since ${CHILD}'s last turn`;
  if (!changes.length && !unused.length) return `${head}\nNone.`;
  const parts = [head, changes.length ? `NEW from the parents. Follow them in THIS reply:\n${changes.map(groupLine).join("\n")}` : "Nothing new."];
  if (unused.length) parts.push(`Earlier today, not used with ${CHILD} yet. Still follow them:\n${unused.map(groupLine).join("\n")}`);
  return parts.join("\n");
}

/** How to follow the changes (B7). Sits right before the child's words, so it weighs on this reply. */
export function followSection(changes: ChangeGroup[], unused: ChangeGroup[] = []): string {
  if (!changes.length && !unused.length) return "";
  return `## Follow the parents' changes now
- They come before your habits and the old plan, starting with this reply.
- A rule about what to use or avoid (e.g. "use shells, not money"): every count and example follows it from now on, e.g. [[count 🐚 3]]. Never say rupees, paise, coins or money.
- News for today's play (e.g. mangoes): answer ${CHILD}, then turn this same reply's play to it: show, spell or count it, e.g. [[show 🥭 Mango]]. You may say it naturally: "Aaj hum aam ke baare mein seekhenge!"
- A surprise stays secret: play with the topic, but never say that anyone is bringing anything, what is coming, or when.
- A new reminder or call time: ${BOTS.routine.name} does it on time. Don't do it now.`;
}

export function boardSection(board: BoardState | null): string {
  const head = "## The wall right now";
  const lines: string[] = [];
  if (board?.spell) {
    const s = board.spell;
    const shown = s.filled ? s.word : s.word.split("").map((ch, k) => (k === s.gap - 1 ? "_" : ch)).join("");
    lines.push(`- Spelling ${shown} (tiles ${s.tiles.join(" ")}), ${s.filled ? "filled in" : "not filled yet"}.`);
  }
  if (board?.showing && board.showing.type !== "spell") lines.push(`- Showing ${cueToMarker(board.showing)}`);
  return `${head}\n${lines.length ? lines.join("\n") : "Nothing yet."}`;
}

export function lastEventSection(ev: NaniEvent | null, fresh = false, offsetMs = 0): string {
  const head = `## ${NANI}'s last event`;
  if (!ev) return `${head}\nNone.`;
  const t = Date.parse(ev.at);
  const at = Number.isNaN(t) ? ev.at : clockParts(new Date(t + offsetMs)).hhmm; // demo time, like the routine clock
  if (!fresh) return `${head}\nEarlier, at ${at}: ${ev.kind} "${ev.text}". ${CHILD} has talked since; don't bring it up again.`;
  if (ev.kind === "reminder") {
    return `${head}\nJust now, at ${at}, you reminded ${CHILD}: "${ev.text}"\nHis words below are probably his answer: reply to that first (praise him warmly if he did it), then carry on.`;
  }
  return `${head}\nJust now, at ${at}: ${ev.kind} "${ev.text}".`;
}

export function timeSection(c: ClockParts): string {
  return `## Time now\n${c.label} (India)`;
}
