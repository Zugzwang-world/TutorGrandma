// Waiting moments (PLAN.md C5): which pre-made clip to play while Nani thinks. Pure picking logic.
//   Layer 1: a reaction at release, never the same twice in a row.
//   Layer 2: a learning filler at 1.2 s, preferring the current area, at most one every two turns,
//            never the same twice.
//   Layer 3: at 4 s, the song snippet or the chashma line (alternating).
import { audioById, audioByKind } from "@/lib/audio";
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

function pick<T>(xs: T[]): T | undefined {
  return xs.length ? xs[Math.floor(Math.random() * xs.length)] : undefined;
}

export class WaitPicker {
  private lastReaction: string | null = null;
  private usedFillers = new Set<string>();
  private lastFiller: string | null = null;
  private lastFillerTurn = -99;
  private longIndex = 0;

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
    const inArea = area ? fresh.filter((e) => e.area === area) : [];
    const e = pick(inArea) ?? pick(fresh);
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
