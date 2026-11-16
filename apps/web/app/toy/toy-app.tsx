"use client";
// /toy, the toy stand-in (PLAN.md C1, C2): Nani's face, a big paw (hold to talk, or hold space), and the
// speaker for everything Nani says. Plug-in points:
//   G4: const routine = useRoutine(core)  (app/toy/use-routine.ts) — reminders via core.player, core.lastEventRef
//   N2: core.mode === "call" routes the paw to the call instead of talk.press/release
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { NaniFace } from "./face";
import s from "./toy.module.css";
import { AUDIO } from "@/lib/audio";
import { useRoutine } from "./use-routine";
import { useTalk } from "./use-talk";
import { useToyCore, type EyeState } from "./use-toy-core";

const LABEL: Record<EyeState, string> = {
  idle: "Hold the paw and talk to Nani",
  listening: "Nani is listening…",
  thinking: "Nani is thinking…",
  speaking: "Nani is talking",
  calling: "Calling…",
  offline: "Nani is resting (offline)",
};

const noSubscribe = () => () => {};

export function ToyApp() {
  const core = useToyCore();
  const { talk: loop, stats: st } = useTalk(core);

  // G4: routine jobs (reminders, calls, brief, song) fire on the demo clock through the toy's speaker.
  useRoutine({
    enabled: core.awake,
    play: async (url) => {
      const pre = AUDIO.find((a) => a.file === url);
      const clip = pre ? core.player.playId(pre.id) : await core.player.load(url).then((b) => (b ? core.player.play(b, "routine") : null));
      if (!clip) return;
      core.setEyes("speaking");
      await clip.ended;
      core.setEyes("idle");
    },
    setLastEvent: (e) => {
      core.lastEventRef.current = e;
    },
  });
  const [down, setDown] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // The paw: talk mode today; N2 switches core.mode to "call" and handles presses itself.
  const press = () => {
    if (!core.awake) return;
    setDown(true);
    if (core.mode === "talk") loop.press();
  };
  const release = () => {
    setDown(false);
    if (core.mode === "talk") loop.release();
  };
  const pressRef = useRef(press);
  const releaseRef = useRef(release);
  useEffect(() => {
    pressRef.current = press;
    releaseRef.current = release;
  });

  // Hold the space bar to talk (not while typing).
  useEffect(() => {
    const isTyping = (e: KeyboardEvent) => e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
    const kd = (e: KeyboardEvent) => {
      if (e.code !== "Space" || isTyping(e)) return;
      e.preventDefault();
      if (!e.repeat) pressRef.current();
    };
    const ku = (e: KeyboardEvent) => {
      if (e.code !== "Space" || isTyping(e)) return;
      e.preventDefault();
      releaseRef.current();
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, []);

  // ?type shows a text box (testing, or a backup if the microphone fails on stage).
  const typeParam = useSyncExternalStore(
    noSubscribe,
    () => new URLSearchParams(window.location.search).has("type"),
    () => false,
  );
  const showTyping = typeParam || !!core.micError;

  const timing = [
    st.reactionMs !== undefined && `reaction ${st.reactionMs} ms`,
    st.firstVoiceMs !== undefined && `voice ${st.firstVoiceMs} ms`,
    st.server && `stt ${st.server.stt} · brain ${st.server.brainFirst} · tts ${st.server.voiceFirst} · total ${st.server.total}`,
    st.fallback && `fallback ${st.fallback}`,
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <main className="fixed inset-0 flex select-none flex-col items-center justify-between bg-cream px-4 pb-6 pt-8 text-ink">
      <p className="rounded-full bg-paper/80 px-5 py-2 text-lg font-semibold text-muted shadow-sm" aria-live="polite">
        {LABEL[core.eyes]}
      </p>

      <NaniFace eyes={core.eyes} />

      <div className="flex w-full max-w-md flex-col items-center gap-3">
        {showTyping && (
          <form
            className="flex w-full gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!core.awake) return;
              loop.say(draft);
              setDraft("");
            }}
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={core.micError ? `${core.micError}: type to Nani` : "Type what Aarav says"}
              className="min-w-0 flex-1 rounded-full border border-line bg-paper px-4 py-2 text-base outline-none focus:border-marigold"
            />
            <button className="rounded-full bg-marigold px-4 py-2 font-bold text-paper">Say</button>
          </form>
        )}

        <button
          type="button"
          aria-label="Hold to talk to Nani"
          data-down={down}
          className={`${s.paw} flex h-44 w-44 items-center justify-center rounded-full bg-marigold shadow-lg sm:h-52 sm:w-52`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            press();
          }}
          onPointerUp={release}
          onPointerCancel={release}
          onContextMenu={(e) => e.preventDefault()}
        >
          <svg viewBox="0 0 100 100" className="h-3/5 w-3/5" aria-hidden>
            <g fill="#fff8ee">
              <ellipse cx={50} cy={64} rx={22} ry={18} />
              <ellipse cx={24} cy={40} rx={9} ry={11} />
              <ellipse cx={40} cy={26} rx={9} ry={11} />
              <ellipse cx={60} cy={26} rx={9} ry={11} />
              <ellipse cx={76} cy={40} rx={9} ry={11} />
            </g>
          </svg>
        </button>
        <p className="text-sm text-muted">Hold the paw to talk, or hold the space bar</p>
        <p className="min-h-5 text-center text-xs text-muted/80">
          {st.heard !== undefined && <span>heard “{st.heard}”  ·  </span>}
          {timing}
        </p>
      </div>

      {!core.awake && (
        <button
          type="button"
          onClick={() => void core.wake()}
          className="fixed inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-marigold-soft/95 text-ink"
        >
          <NaniFace eyes="offline" />
          <span className="rounded-full bg-marigold px-8 py-4 text-2xl font-extrabold text-paper shadow-lg">Tap to wake Nani</span>
        </button>
      )}
    </main>
  );
}
