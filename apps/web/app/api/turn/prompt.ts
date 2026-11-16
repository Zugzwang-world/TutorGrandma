// The live brain prompt for one child turn (PLAN.md C3). Server-only (imports nothing client-unsafe, but
// is only used by /api/turn). G3 extends `changesSection`; keep each section a small named function.
//
// System message (stable across turns, so the provider can cache it):
//   persona.md, planner.md, parent.md, brain.md, a heartbeat summary, the wall marker table, reply rules.
// User message (fresh every turn):
//   the last 8 turns, changes since the child's last turn, the board, the last Nani event, the demo time,
//   and what the child said.
import type { BrainMessage } from "@/lib/brain";
import { clockParts, type ClockParts } from "@/lib/clock";
import { config } from "@/lib/config";
import { parseJobs, summarizeJobs } from "@/lib/jobs";
import { cueToMarker } from "@/lib/markers";
import { BOTS, BOT_OF_FILE, type AgentFile, type BoardState, type FileName, type NaniEvent, type Turn } from "@/lib/types";

const CHILD = config.childName;
const NANI = config.grandmaName;

export interface TurnPromptInput {
  files: Record<FileName, AgentFile>;
  recentTurns: Turn[]; // oldest first, at most 8
  changes: AgentFile[]; // file versions written since the child's last turn, oldest first
  board: BoardState | null;
  lastEvent: NaniEvent | null;
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
[[call mumma]] / [[call papa]]  offer a call to Mumma or Papa
[[note routine: …]] [[note rules: …]] [[note lessons: …]] [[note memory: …]] [[note nani: …]]   one casual line for the parents' chat
</wall_markers>`;

export const REPLY_RULES = `<reply_rules>
- One or two short sentences, then one simple question. At most 35 words.
- At most two wall markers, plus at most one note.
- Plain spoken words only: no emoji, asterisks, lists or stage directions outside markers.
- Write the way the examples in persona.md are written.
</reply_rules>`;

// ---------- User message ----------

export function userTurn(i: TurnPromptInput): string {
  return [
    recentTurnsSection(i.recentTurns),
    changesSection(i.changes),
    boardSection(i.board),
    lastEventSection(i.lastEvent),
    timeSection(i.clock),
    `${CHILD} said: "${i.childText.trim()}"`,
  ].join("\n\n");
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

/** "Changes since Aarav's last turn" (B7). G3 extends this. */
export function changesSection(changes: AgentFile[]): string {
  const head = `## Changes since ${CHILD}'s last turn`;
  if (!changes.length) return `${head}\nNone.`;
  const lines = changes.map((c) => {
    const bot = BOTS[BOT_OF_FILE[c.name]];
    const by = c.changed_by ? `, by ${c.changed_by}` : "";
    return `- ${bot.fileLabel} v${c.version}${by}: ${c.change_note ?? "updated"}`;
  });
  return `${head}\n${lines.join("\n")}\nFollow these at once (the files above already include them). Never reveal a surprise a parent planned.`;
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

export function lastEventSection(ev: NaniEvent | null): string {
  if (!ev) return `## ${NANI}'s last event\nNone.`;
  const at = Number.isNaN(Date.parse(ev.at)) ? ev.at : clockParts(new Date(ev.at)).hhmm;
  return `## ${NANI}'s last event\n${ev.kind} at ${at}: "${ev.text}"`;
}

export function timeSection(c: ClockParts): string {
  return `## Time now\n${c.label} (India)`;
}
