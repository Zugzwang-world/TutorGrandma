// Waiting moments (PLAN.md C5): which pre-made clip to play while Nani thinks. Pure picking logic.
//   Layer 1: a reaction at release, never the same twice in a row.
//   Layer 2: a learning filler at 1.2 s, at most one every two turns, never the same twice.
//            Preference: today's letter and theme (planner.md "## Today"), then the area of the last cue.
//   Layer 3: at 4 s, the song snippet or the chashma line (alternating).
import { audioById, audioByKind } from "@/lib/audio";
import { CHILD_ID } from "@/lib/config";
import { supabaseBrowser } from "@/lib/supabase/browser";
import type { AudioEntry, Cue } from "@/lib/types";

export const REACTION_IDS = ["reaction_ooh", "reaction_achha", "reaction_hmm", "reaction_haanji", "reaction_oho", "reaction_achha_achha"];
export const LONG_WAIT_IDS = ["song_snippet", "filler_wait_chashma"];

/** The learning area a cue belongs to, if any (letters for spell/tile, numbers for count, animals for sound). */
export function areaOfCue(c: Cue): string | null {
  if (c.type === "spell" || c.type === "tile") return "letters";
  if (c.type === "count") return "numbers";
  if (c.type === "sound") return "animals";
  return null;
}

/** Layer 3 clips fade when Nani's reply arrives; reactions and learning fillers play to the end. */
export function isLongWait(id: string): boolean {
  return LONG_WAIT_IDS.includes(id);
}

// ---------- today's topic (planner.md "## Today") ----------

/** What Nani is teaching today: a letter (upper case) and the theme areas (the fillers' `area` names). */
export interface Today {
  letter: string | null;
  themes: string[];
}

// Words that put a line or a theme in an area. Used on the planner's theme text ("animals and fruits", or a
// parent's "mangoes") and on the words inside a filler, so "M se Mango!" also counts as a fruits filler.
const THEME_WORDS: Record<string, RegExp> = {
  animals: /\b(animals?|jaanwar|lion|cow|cat|dog|elephant|monkey|bandar|duck|sheep|horse|rooster|billi|gaay|haathi|ullu|owl|sher)\b/i,
  fruits: /\b(fruits?|phal|mango(es)?|aam|banana|kela|apple|seb|orange|santra|grapes?|angoor)\b/i,
  numbers: /\b(numbers?|count(ing)?|gino|gin|ginti|shells?|seepiyan)\b/i,
  letters: /\b(letters?|alphabets?|abc|akshar)\b/i,
  colours: /\b(colou?rs?|rang)\b/i,
  shapes: /\b(shapes?|circle|square|triangle)\b/i,
  body: /\b(body|nose|ears?|naak|kaan)\b/i,
};

export function themesIn(text: string): string[] {
  return Object.entries(THEME_WORDS).filter(([, re]) => re.test(text)).map(([k]) => k);
}

/** A filler's letter, read from its words: "M se Monkey", "A for Apple", "M ki awaaz". */
export function letterOfFiller(e: AudioEntry): string | null {
  return e.text?.match(/\b([A-Z]) (?:se|for|ki)\b/)?.[1] ?? null;
}

/** Reads "- Letter: M" and "- Theme: animals and fruits" under "## Today" in planner.md. */
export function parseToday(planner: string | null | undefined): Today | null {
  if (!planner) return null;
  const sec = planner.match(/^##[ \t]*Today\b[^\n]*\n([\s\S]*?)(?=^##[ \t]|(?![\s\S]))/im)?.[1];
  if (!sec) return null;
  const letterText = sec.match(/^[ \t]*[-*]?[ \t]*Letter[ \t]*:[ \t]*(.+)$/im)?.[1]?.trim() ?? "";
  const letter = letterText.match(/^([A-Za-z])(?![A-Za-z])/)?.[1]?.toUpperCase() ?? null;
  const themeText = sec.match(/^[ \t]*[-*]?[ \t]*Theme[ \t]*:[ \t]*(.+)$/im)?.[1] ?? "";
  const themes = themesIn(themeText);
  return letter || themes.length ? { letter, themes } : null;
}

/**
 * Keeps `onChange` up to date with today's topic: the latest planner row now, then every new planner
 * version (a parent asking for mangoes). Returns the stop function. A failure keeps the last topic.
 */
export function watchToday(onChange: (t: Today | null) => void): () => void {
  let dead = false;
  const sb = supabaseBrowser();
  void (async () => {
    try {
      const { data } = await sb
        .from("agent_files")
        .select("content")
        .eq("child_id", CHILD_ID)
        .eq("name", "planner")
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!dead && data?.content) onChange(parseToday(data.content));
    } catch {
      // no topic: fillers fall back to the current area
    }
  })();
  const ch = sb
    .channel(`today:${CHILD_ID}`)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "agent_files", filter: `child_id=eq.${CHILD_ID}` }, (p) => {
      const row = p.new as { name?: string; content?: string };
      if (!dead && row?.name === "planner") onChange(parseToday(row.content));
    })
    .subscribe();
  return () => {
    dead = true;
    void sb.removeChannel(ch);
  };
}

function pick<T>(xs: T[]): T | undefined {
  return xs.length ? xs[Math.floor(Math.random() * xs.length)] : undefined;
}

export class WaitPicker {
  private lastReaction: string | null = null;
  private usedFillers = new Set<string>();
  private lastFiller: string | null = null;
  private lastFillerTurn = -99;
  private longIndex = 0;
  private today: Today | null = null;

  setToday(t: Today | null): void {
    this.today = t;
  }

  /** Does this filler belong to today's letter or theme? */
  private isToday(e: AudioEntry): boolean {
    const t = this.today;
    if (!t) return false;
    if (t.letter && letterOfFiller(e) === t.letter) return true;
    if (!t.themes.length) return false;
    return [e.area ?? "", ...themesIn(e.text ?? "")].some((a) => t.themes.includes(a));
  }

  reaction(): AudioEntry | undefined {
    const all = REACTION_IDS.map(audioById).filter((e): e is AudioEntry => !!e);
    const e = pick(all.filter((x) => x.id !== this.lastReaction)) ?? all[0];
    if (e) this.lastReaction = e.id;
    return e;
  }

  /** A learning filler for turn number `turn`, or undefined if one played on the previous turn. */
  filler(turn: number, area: string | null): AudioEntry | undefined {
    if (turn - this.lastFillerTurn < 2) return undefined;
    const all = audioByKind("filler").filter((e) => e.area !== "wait");
    if (!all.length) return undefined;
    let fresh = all.filter((e) => !this.usedFillers.has(e.id));
    if (!fresh.length) {
      this.usedFillers.clear(); // all used once: start over, but never repeat the last one
      fresh = all.filter((e) => e.id !== this.lastFiller);
    }
    // Today's topic first (best: also in the current area), then the current area, then anything.
    const today = fresh.filter((e) => this.isToday(e));
    const inArea = area ? fresh.filter((e) => e.area === area) : [];
    const both = today.filter((e) => inArea.includes(e));
    const e = pick(both) ?? pick(today) ?? pick(inArea) ?? pick(fresh);
    if (e) {
      this.usedFillers.add(e.id);
      this.lastFiller = e.id;
      this.lastFillerTurn = turn;
    }
    return e;
  }

  longWait(): AudioEntry | undefined {
    for (let k = 0; k < LONG_WAIT_IDS.length; k++) {
      const e = audioById(LONG_WAIT_IDS[(this.longIndex + k) % LONG_WAIT_IDS.length]);
      if (e) {
        this.longIndex += k + 1;
        return e;
      }
    }
    return undefined;
  }
}
