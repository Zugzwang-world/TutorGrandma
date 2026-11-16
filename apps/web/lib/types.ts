// Shared contracts for the overnight beta (PLAN.md A8). Change only through the Coordinator.

export type FileName = "persona" | "planner" | "brain" | "heartbeat" | "parent";
export const FILE_NAMES: FileName[] = ["persona", "planner", "brain", "heartbeat", "parent"];

export type BotKey = "nani" | "routine" | "rules" | "lessons" | "memory";
export const BOT_KEYS: BotKey[] = ["nani", "routine", "rules", "lessons", "memory"];

export interface BotInfo {
  key: BotKey;
  name: string; // shown in the chat
  emoji: string;
  color: string; // Tailwind colour token name, e.g. "marigold" -> bg-marigold, text-marigold
  file: FileName; // the one file this agent writes
  fileLabel: string; // friendly name for the "what changed" sheet
}

export const BOTS: Record<BotKey, BotInfo> = {
  nani: { key: "nani", name: "Nani", emoji: "👵", color: "marigold", file: "persona", fileLabel: "Nani's ways · persona.md" },
  routine: { key: "routine", name: "Routine", emoji: "⏰", color: "routine", file: "heartbeat", fileLabel: "Routine's list · heartbeat.md" },
  rules: { key: "rules", name: "House rules", emoji: "🏠", color: "rules", file: "parent", fileLabel: "House rules · parent.md" },
  lessons: { key: "lessons", name: "Lessons", emoji: "📚", color: "lessons", file: "planner", fileLabel: "Today's plan · planner.md" },
  memory: { key: "memory", name: "Memory", emoji: "📔", color: "memory", file: "brain", fileLabel: "Aarav's memory · brain.md" },
};

export const BOT_OF_FILE: Record<FileName, BotKey> = {
  persona: "nani",
  heartbeat: "routine",
  parent: "rules",
  planner: "lessons",
  brain: "memory",
};

// ---------- Database rows ----------

export interface AgentFile {
  id: number;
  child_id: string;
  name: FileName;
  version: number;
  content: string;
  changed_by: string | null;
  change_note: string | null;
  created_at: string;
}

export type SenderKind = "parent" | "bot" | "system";

export interface MessageMeta {
  // set when an agent reply changed its file (powers the "what changed" link)
  file?: FileName;
  fromVersion?: number;
  toVersion?: number;
  changedLines?: string[];
  // what kind of bubble this is; absent means a normal text bubble
  kind?: "voice" | "call" | "call_clip" | "note" | "event" | "brief";
  // voice notes: transcript shown under the audio bubble
  transcript?: string;
  // calls (N2)
  callId?: string;
  callState?: "ringing" | "open" | "ended";
  [key: string]: unknown;
}

export interface Message {
  id: number;
  child_id: string;
  sender: string; // a parent's name, or a BotKey
  sender_kind: SenderKind;
  text: string;
  audio_url: string | null;
  meta: MessageMeta;
  created_at: string;
}

export type TurnKind = "talk" | "job" | "call" | "song";

export interface TurnTimings {
  stt?: number; // ms, speech-to-text
  brainFirst?: number; // ms from request start to first brain token
  voiceFirst?: number; // ms from request start to first audio ready
  total?: number; // ms, whole request
  [key: string]: number | undefined;
}

export interface Turn {
  id: number;
  child_id: string;
  session_id: string | null;
  kind: TurnKind;
  child_text: string | null;
  nani_text: string | null;
  cues: Cue[];
  file_versions: Partial<Record<FileName, number>>;
  timings: TurnTimings;
  meta: Record<string, unknown>; // e.g. { jobKey, dueAt } for kind "job"
  created_at: string;
}

export interface DemoState {
  child_id: string;
  clock_offset_ms: number;
  show_timings: boolean;
  updated_at: string;
}

// ---------- Nani's markers (C4) ----------

export type Cue =
  | { type: "show"; emoji: string; word: string }
  | { type: "spell"; word: string; gap: number; tiles: string[] } // gap is 1-based
  | { type: "tile"; letter: string; result: "right" | "wrong" }
  | { type: "count"; emoji: string; a: number; b?: number } // b set for sums: a + b
  | { type: "choices"; items: { emoji: string; label: string }[] }
  | { type: "cheer"; emoji: string }
  | { type: "sound"; name: string }
  | { type: "song" }
  | { type: "call"; who: "mumma" | "papa" };

export interface Note {
  bot: BotKey;
  text: string;
}

// ---------- Routine jobs (D5) ----------

export type JobAction = "say" | "call" | "brief" | "song";

export type JobWhen =
  | { kind: "daily"; at: string } // "HH:MM"
  | { kind: "every"; everyMinutes: number; from: string; to: string }
  | { kind: "once"; at: string; date?: string }; // date like "17 Nov"

export interface Job {
  key: string; // stable id from the line text, used to record fires
  raw: string; // the full line as written
  when: JobWhen;
  action: JobAction;
  text: string;
  setBy: string;
}

// ---------- The talking loop (C2) ----------

// Board state the toy sends with each turn (what the wall shows right now).
export interface BoardState {
  spell?: { word: string; gap: number; tiles: string[]; filled?: boolean } | null;
  showing?: Cue | null;
}

// The last thing Nani did that was not a reply, e.g. a water reminder.
export interface NaniEvent {
  kind: "reminder" | "call" | "song" | "brief" | "other";
  text: string;
  jobKey?: string;
  at: string; // ISO time
}

// NDJSON lines streamed by POST /api/turn.
export type TurnEvent =
  | { t: "heard"; text: string }
  | { t: "say"; i: number; text: string; cues: Cue[]; audio: string } // audio: base64 mp3
  | { t: "fallback"; id: FallbackId }
  | { t: "done"; ms: { stt: number; brainFirst: number; voiceFirst: number; total: number } };

export type FallbackId = "not_heard" | "voice_failed" | "slow_brain" | "offline";

// ---------- Realtime broadcast channels (B9) ----------

export const channelName = {
  toy: (child: string) => `toy:${child}`,
  wall: (child: string) => `wall:${child}`,
  chat: (child: string) => `chat:${child}`,
};

// Events on toy:<child>
export type ToyEvent =
  | { event: "clock"; payload: { offsetMs: number } }
  | { event: "reset"; payload: Record<string, never> }
  | { event: "fire_next_job"; payload: Record<string, never> }
  | { event: "job"; payload: { job: Job; dueAt: string } }
  | { event: "call"; payload: { callId: string; state: "ringing" | "open" | "ended"; who: string } }
  | { event: "clip"; payload: { callId: string; from: "toy" | "parent"; url: string; sender: string } };

// Events on wall:<child>
export type WallEvent =
  | { event: "cue"; payload: { cue: Cue; turnId?: string } }
  | { event: "thinking"; payload: { on: boolean } }
  | { event: "speaking"; payload: { on: boolean } }
  | { event: "timings"; payload: { show: boolean; ms?: TurnTimings } }
  | { event: "reset"; payload: Record<string, never> };

// Events on chat:<child>
export type ChatEvent = { event: "working"; payload: { bots: BotKey[]; on: boolean } };

// ---------- Pre-made audio (content/audio.json, written by S1) ----------

export type AudioKind = "reaction" | "filler" | "fallback" | "line" | "sfx" | "sting" | "song" | "snippet";

export interface AudioEntry {
  id: string; // fixed ids: docs/plan/CONTRACTS.md
  file: string; // public path, e.g. "/audio/reaction_ooh.mp3"
  kind: AudioKind;
  area?: string; // filler area: numbers, animals, letters, body, colours, shapes, manners, feelings, review, wait
  text?: string; // what is said (for lines)
  duration: number; // seconds
}
