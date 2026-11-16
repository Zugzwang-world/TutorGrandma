"use client";
// The projector wall (PLAN C4). Listens on wall:<child>, shows one cue at a time, plays no audio.
import "./wall.css";
import { useCallback, useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { CHILD_ID } from "@/lib/config";
import { clockParts } from "@/lib/clock";
import { parseMarkers } from "@/lib/markers";
import { channelName, type Cue, type TurnTimings } from "@/lib/types";
import {
  CallScene,
  CheerScene,
  ChoicesScene,
  CountScene,
  IdleScene,
  LetterScene,
  ShowScene,
  SongScene,
  SoundScene,
  SpellScene,
  ThinkingScene,
  type SpellBoard,
} from "./scenes";

type BaseCue = Exclude<Cue, { type: "spell" } | { type: "tile" } | { type: "sound" }>;

type View =
  | { kind: "idle"; key: number }
  | { kind: "cue"; key: number; cue: BaseCue }
  | { kind: "spell"; key: number; board: SpellBoard }
  | { kind: "letter"; key: number; letter: string; result: "right" | "wrong" };

interface WallState {
  view: View; // what stays on the wall
  flash: { key: number; name: string } | null; // a brief animal over the view
  thinking: boolean;
  speaking: boolean;
  n: number; // counter for animation keys
}

type Action =
  | { t: "cue"; cue: Cue }
  | { t: "thinking"; on: boolean }
  | { t: "speaking"; on: boolean }
  | { t: "idle" }
  | { t: "flashDone"; key: number };

const initial: WallState = { view: { kind: "idle", key: 0 }, flash: null, thinking: false, speaking: false, n: 0 };

function reduce(s: WallState, a: Action): WallState {
  switch (a.t) {
    case "thinking":
      return { ...s, thinking: a.on, flash: a.on ? null : s.flash };
    case "speaking":
      return { ...s, speaking: a.on };
    case "idle":
      return { ...s, thinking: false, flash: null, n: s.n + 1, view: { kind: "idle", key: s.n + 1 } };
    case "flashDone":
      return s.flash?.key === a.key ? { ...s, flash: null } : s;
    case "cue": {
      const c = a.cue;
      const n = s.n + 1;
      const next = { ...s, thinking: false, n };
      switch (c.type) {
        case "sound":
          return { ...next, flash: { key: n, name: c.name } };
        case "spell":
          return {
            ...next,
            flash: null,
            view: {
              kind: "spell",
              key: n,
              board: {
                word: c.word,
                gap: c.gap,
                tiles: c.tiles.slice(0, 3).map((letter) => ({ letter, state: "idle" as const })),
                filled: false,
              },
            },
          };
        case "tile": {
          if (s.view.kind === "spell") {
            const b = s.view.board;
            const idx = b.tiles.findIndex((t) => t.letter === c.letter && t.state === "idle");
            const tiles = b.tiles.map((t, i) => (i === idx ? { ...t, state: c.result } : t));
            // Same key: the board stays mounted, so the tile animates in place.
            return { ...next, flash: null, view: { ...s.view, board: { ...b, tiles, filled: b.filled || c.result === "right" } } };
          }
          return { ...next, flash: null, view: { kind: "letter", key: n, letter: c.letter, result: c.result } };
        }
        default:
          return { ...next, flash: null, view: { kind: "cue", key: n, cue: c } };
      }
    }
  }
}

// ?demo=1 cycles through every cue type (C4 examples), 3 s each.
const DEMO_STEPS: (string | "idle" | "thinking")[] = [
  "idle",
  "thinking",
  "[[show 🥭 Mango]]",
  "[[spell MANGO 1 M S T]]",
  "[[tile S wrong]]",
  "[[tile M right]]",
  "[[count 🐚 3]]",
  "[[count 🥭 1+1]]",
  "[[choices 🎵 Song, 🔤 Letters, 🔢 Count, 🦁 Animals]]",
  "[[cheer 🥭]]",
  "[[sound lion]]",
  "[[song]]",
  "[[call mumma]]",
];

const IDLE_AFTER_MS = 120_000;
const SOUND_MS = 2500;
const STRIP_MAX = 12;
const stickerKey = () => `wall:stickers:${clockParts(new Date()).dateKey}`;

function loadStickers(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(stickerKey()) || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function hasTimings(t: unknown): t is TurnTimings {
  return !!t && typeof t === "object" && Object.values(t as object).some((v) => typeof v === "number");
}

export default function Wall() {
  const [s, dispatch] = useReducer(reduce, initial);
  const [stickers, setStickers] = useState<string[]>([]);
  const [newest, setNewest] = useState(-1);
  const [showTimings, setShowTimings] = useState(false);
  const [timings, setTimings] = useState<TurnTimings | null>(null);
  const [live, setLive] = useState(false);
  const [tapped, setTapped] = useState(false);
  const demoRef = useRef(false);
  const stickersRef = useRef<string[]>([]);

  const onCue = useCallback((cue: Cue) => {
    if (cue.type === "cheer") {
      const next = [...stickersRef.current, cue.emoji];
      stickersRef.current = next;
      setStickers(next);
      setNewest(next.length - 1);
      if (!demoRef.current) {
        try {
          localStorage.setItem(stickerKey(), JSON.stringify(next));
        } catch {}
      }
    }
    dispatch({ t: "cue", cue });
  }, []);

  // Today's stickers, and demo mode.
  useEffect(() => {
    const demo = new URLSearchParams(location.search).get("demo") === "1";
    demoRef.current = demo;
    if (!demo) {
      const saved = loadStickers();
      stickersRef.current = saved;
      setStickers(saved);
    }
    if (!demo) return;
    let i = 0;
    const step = () => {
      const st = DEMO_STEPS[i % DEMO_STEPS.length];
      if (st === "idle") dispatch({ t: "idle" });
      else if (st === "thinking") dispatch({ t: "thinking", on: true });
      else parseMarkers(st).cues.forEach(onCue);
      i++;
    };
    step();
    const id = setInterval(step, 3000);
    return () => clearInterval(id);
  }, [onCue]);

  // Live: broadcast events on wall:<child>.
  useEffect(() => {
    const sb = supabaseBrowser();
    const ch = sb
      .channel(channelName.wall(CHILD_ID))
      .on("broadcast", { event: "cue" }, ({ payload }) => {
        if (payload?.cue?.type) onCue(payload.cue as Cue);
      })
      .on("broadcast", { event: "thinking" }, ({ payload }) => dispatch({ t: "thinking", on: !!payload?.on }))
      .on("broadcast", { event: "speaking" }, ({ payload }) => dispatch({ t: "speaking", on: !!payload?.on }))
      .on("broadcast", { event: "timings" }, ({ payload }) => {
        if (typeof payload?.show === "boolean") setShowTimings(payload.show);
        if (hasTimings(payload?.ms)) setTimings(payload.ms);
      })
      .on("broadcast", { event: "reset" }, () => {
        try {
          localStorage.removeItem(stickerKey());
        } catch {}
        location.reload();
      })
      .subscribe((status) => setLive(status === "SUBSCRIBED"));
    return () => {
      sb.removeChannel(ch);
    };
  }, [onCue]);

  // Live: demo_state.show_timings and the latest turn's timings.
  useEffect(() => {
    const sb = supabaseBrowser();
    const filter = `child_id=eq.${CHILD_ID}`;
    sb.from("demo_state")
      .select("show_timings")
      .eq("child_id", CHILD_ID)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setShowTimings(!!data.show_timings);
      });
    sb.from("turns")
      .select("timings")
      .eq("child_id", CHILD_ID)
      .order("id", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        const row = data?.find((r) => hasTimings(r.timings));
        if (row) setTimings((cur) => cur ?? row.timings);
      });
    const ch = sb
      .channel(`wall-db:${CHILD_ID}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "demo_state", filter }, (p) => {
        const row = p.new as { show_timings?: boolean };
        if (typeof row?.show_timings === "boolean") setShowTimings(row.show_timings);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "turns", filter }, (p) => {
        const t = (p.new as { timings?: unknown }).timings;
        if (hasTimings(t)) setTimings(t);
      })
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, []);

  // The animal shows briefly, then the wall goes back to what it was showing.
  useEffect(() => {
    if (!s.flash) return;
    const key = s.flash.key;
    const id = setTimeout(() => dispatch({ t: "flashDone", key }), SOUND_MS);
    return () => clearTimeout(id);
  }, [s.flash]);

  // After a long quiet spell, go back to the calm scene.
  useEffect(() => {
    if (s.view.kind === "idle" || s.thinking || demoRef.current) return;
    const id = setTimeout(() => dispatch({ t: "idle" }), IDLE_AFTER_MS);
    return () => clearTimeout(id);
  }, [s.view, s.thinking]);

  // First tap: fullscreen and keep the screen awake (kiosk on the projector's browser).
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null;
    let wanted = false;
    const getLock = async () => {
      try {
        const wl = (navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } }).wakeLock;
        if (wl && document.visibilityState === "visible") lock = await wl.request("screen");
      } catch {}
    };
    const onTap = () => {
      setTapped(true);
      try {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
      } catch {}
      if (!wanted || !lock) {
        wanted = true;
        getLock();
      }
    };
    const onVis = () => {
      if (wanted && document.visibilityState === "visible") getLock();
    };
    window.addEventListener("pointerdown", onTap);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pointerdown", onTap);
      document.removeEventListener("visibilitychange", onVis);
      lock?.release().catch(() => {});
    };
  }, []);

  const v = s.view;
  let scene: ReactNode;
  let sceneKey: string;
  if (s.thinking) {
    scene = <ThinkingScene />;
    sceneKey = "thinking";
  } else if (s.flash) {
    scene = <SoundScene name={s.flash.name} />;
    sceneKey = `sound-${s.flash.key}`;
  } else {
    sceneKey = `v-${v.key}`;
    if (v.kind === "idle") scene = <IdleScene />;
    else if (v.kind === "spell") scene = <SpellScene board={v.board} />;
    else if (v.kind === "letter") scene = <LetterScene letter={v.letter} result={v.result} />;
    else {
      const c = v.cue;
      if (c.type === "show") scene = <ShowScene emoji={c.emoji} word={c.word} />;
      else if (c.type === "count") scene = <CountScene cue={c} />;
      else if (c.type === "choices") scene = <ChoicesScene items={c.items} />;
      else if (c.type === "cheer") scene = <CheerScene emoji={c.emoji} />;
      else if (c.type === "song") scene = <SongScene />;
      else scene = <CallScene who={c.who} />;
    }
  }

  const shown = stickers.slice(-STRIP_MAX);
  const offset = stickers.length - shown.length;

  return (
    <main className="wall-root" data-scene={sceneKey}>
      <div className="wall-stage" key={sceneKey}>
        {scene}
      </div>

      {s.speaking && (
        <div className="wall-speaking" aria-hidden>
          <span className="emoji">👵</span>
          <span className="wall-bars">
            <i />
            <i />
            <i />
          </span>
        </div>
      )}

      {showTimings && (
        <div className="wall-timings">
          {(["stt", "brainFirst", "voiceFirst", "total"] as const).map((k) => (
            <div key={k}>
              <span>{k}</span>
              <b>{typeof timings?.[k] === "number" ? Math.round(timings[k]!) : "–"}</b>
            </div>
          ))}
          <small>ms</small>
        </div>
      )}

      <div className="wall-strip">
        {shown.length === 0 ? (
          <span className="wall-strip-empty">Today&apos;s stickers</span>
        ) : (
          shown.map((e, i) => (
            <span key={offset + i} className={`emoji wall-sticker ${offset + i === newest ? "wall-sticker-new" : ""}`}>
              {e}
            </span>
          ))
        )}
      </div>

      <span className={`wall-live ${live ? "on" : ""}`} title={live ? "Connected" : "Connecting"} />
      {!tapped && <p className="wall-hint">Tap for full screen</p>}
    </main>
  );
}
