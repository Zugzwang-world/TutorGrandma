"use client";
// React wrapper around TalkLoop: one loop per page, wired to the toy core.
import { useEffect, useRef, useState } from "react";
import { TalkLoop, type TalkStats } from "./talk-loop";
import type { ToyCore } from "./use-toy-core";

export interface Talk {
  press: () => void;
  release: () => void;
  say: (text: string) => void;
  stop: () => void;
}

export function useTalk(core: ToyCore) {
  const [stats, setStats] = useState<TalkStats>({ turn: 0 });
  const [recording, setRecording] = useState(false);
  const loopRef = useRef<TalkLoop | null>(null);
  const { player, setEyes, sendWall, micRef, sessionIdRef, lastEventRef, clockOffsetRef, showTimingsRef } = core;

  useEffect(() => {
    const loop = new TalkLoop({
      player,
      setEyes,
      sendWall,
      mic: () => micRef.current,
      sessionId: () => sessionIdRef.current,
      lastEvent: () => lastEventRef.current,
      clockOffsetMs: () => clockOffsetRef.current,
      showTimings: () => showTimingsRef.current,
      onStats: setStats,
      onRecording: setRecording,
    });
    loopRef.current = loop;
    return () => {
      loop.stop();
      loopRef.current = null;
    };
  }, [player, setEyes, sendWall, micRef, sessionIdRef, lastEventRef, clockOffsetRef, showTimingsRef]);

  const [talk] = useState<Talk>(() => ({
    press: () => loopRef.current?.press(),
    release: () => loopRef.current?.release(),
    say: (text) => loopRef.current?.say(text),
    stop: () => loopRef.current?.stop(),
  }));
  return { talk, stats, recording };
}
