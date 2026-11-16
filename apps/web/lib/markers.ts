// Nani's wall and note markers (PLAN.md C4, B8). Pure; safe on client and server.
import { BOT_KEYS, type BotKey, type Cue, type Note } from "./types";

const MARKER_RE = /\[\[([^\[\]]*?)\]\]/g;

/** Parse one marker body (the text between [[ and ]]). Returns a cue, a note, or null if invalid. */
export function parseMarker(body: string): { cue?: Cue; note?: Note } | null {
  const s = body.trim();
  const m = s.match(/^(\w+)\s*([\s\S]*)$/);
  if (!m) return null;
  const kind = m[1].toLowerCase();
  const rest = m[2].trim();
  const parts = rest.split(/\s+/).filter(Boolean);

  switch (kind) {
    case "show": {
      if (parts.length < 2) return null;
      return { cue: { type: "show", emoji: parts[0], word: parts.slice(1).join(" ") } };
    }
    case "spell": {
      // [[spell MANGO 1 M S T]]
      if (parts.length < 3) return null;
      const word = parts[0].toUpperCase();
      const gap = parseInt(parts[1], 10);
      if (!Number.isFinite(gap) || gap < 1 || gap > word.length) return null;
      const tiles = parts.slice(2, 5).map((t) => t.toUpperCase());
      return { cue: { type: "spell", word, gap, tiles } };
    }
    case "tile": {
      if (parts.length < 2) return null;
      const result = parts[1].toLowerCase();
      if (result !== "right" && result !== "wrong") return null;
      return { cue: { type: "tile", letter: parts[0].toUpperCase(), result } };
    }
    case "count": {
      // [[count 🥭 1+1]] or [[count 🐚 3]]
      if (parts.length < 2) return null;
      const expr = parts.slice(1).join("");
      const sum = expr.match(/^(\d+)\+(\d+)$/);
      if (sum) return { cue: { type: "count", emoji: parts[0], a: +sum[1], b: +sum[2] } };
      const n = expr.match(/^(\d+)$/);
      if (n) return { cue: { type: "count", emoji: parts[0], a: +n[1] } };
      return null;
    }
    case "choices": {
      // [[choices 🎵 Song, 🔤 Letters, 🔢 Count]]
      const items = rest
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => {
          const [emoji, ...label] = x.split(/\s+/);
          return { emoji, label: label.join(" ") };
        })
        .filter((x) => x.emoji && x.label)
        .slice(0, 4);
      if (items.length < 2) return null;
      return { cue: { type: "choices", items } };
    }
    case "cheer":
      return { cue: { type: "cheer", emoji: parts[0] || "⭐" } };
    case "sound":
      if (!parts[0]) return null;
      return { cue: { type: "sound", name: parts[0].toLowerCase() } };
    case "song":
      return { cue: { type: "song" } };
    case "call": {
      const who = (parts[0] || "").toLowerCase();
      if (who !== "mumma" && who !== "papa") return null;
      return { cue: { type: "call", who } };
    }
    case "note": {
      // [[note routine: Aarav said he drank water]]
      const nm = rest.match(/^(\w+)\s*:\s*([\s\S]+)$/);
      if (!nm) return null;
      const bot = nm[1].toLowerCase() as BotKey;
      if (!BOT_KEYS.includes(bot)) return null;
      return { note: { bot, text: nm[2].trim() } };
    }
    default:
      return null;
  }
}

/** Remove every [[...]] marker (and any unfinished trailing "[[...") and tidy spaces. */
export function stripMarkers(text: string): string {
  return text
    .replace(MARKER_RE, " ")
    .replace(/\[\[[^\]]*$/, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Split a reply into speakable text, wall cues and parent notes. Invalid markers are dropped. */
export function parseMarkers(text: string): { speech: string; cues: Cue[]; notes: Note[]; invalid: string[] } {
  const cues: Cue[] = [];
  const notes: Note[] = [];
  const invalid: string[] = [];
  for (const m of text.matchAll(MARKER_RE)) {
    const r = parseMarker(m[1]);
    if (!r) invalid.push(m[0]);
    else if (r.cue) cues.push(r.cue);
    else if (r.note) notes.push(r.note);
  }
  return { speech: stripMarkers(text), cues, notes, invalid };
}

/** True if the text ends inside an unfinished marker ("... [[show 🥭"), so a streamer should wait for more. */
export function hasOpenMarker(text: string): boolean {
  const open = text.lastIndexOf("[[");
  return open >= 0 && text.indexOf("]]", open) < 0;
}

/** Render a cue back to marker text (for prompts and logs). */
export function cueToMarker(c: Cue): string {
  switch (c.type) {
    case "show": return `[[show ${c.emoji} ${c.word}]]`;
    case "spell": return `[[spell ${c.word} ${c.gap} ${c.tiles.join(" ")}]]`;
    case "tile": return `[[tile ${c.letter} ${c.result}]]`;
    case "count": return `[[count ${c.emoji} ${c.b !== undefined ? `${c.a}+${c.b}` : c.a}]]`;
    case "choices": return `[[choices ${c.items.map((i) => `${i.emoji} ${i.label}`).join(", ")}]]`;
    case "cheer": return `[[cheer ${c.emoji}]]`;
    case "sound": return `[[sound ${c.name}]]`;
    case "song": return `[[song]]`;
    case "call": return `[[call ${c.who}]]`;
  }
}
