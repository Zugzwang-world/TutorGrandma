"use client";
// The parent's group chat with Nani's five agents (PLAN.md B4).
import "./chat.css";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChatHeader } from "./chat-header";
import { Composer } from "./composer";
import { MessageList, type WhatChangedTarget } from "./message-list";
import { readSender, saveSender } from "./ui";
import { useChat } from "./use-chat";
import { WhatChangedSheet } from "./what-changed-sheet";
import { WhoIsThis } from "./who-is-this";

// This device's sender name (localStorage tg_sender), read without touching it during prerender.
const SERVER = "\u0000server";
let memSender: string | null = null; // fallback when storage is blocked
const senderSubs = new Set<() => void>();
function subscribeSender(cb: () => void) {
  senderSubs.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    senderSubs.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
const senderSnapshot = () => readSender() ?? memSender ?? "";
const serverSnapshot = () => SERVER;

export function GuidanceChat() {
  // Everything that reads the device (localStorage, time) happens after hydration, so the prerendered shell is static.
  const stored = useSyncExternalStore(subscribeSender, senderSnapshot, serverSnapshot);
  const ready = stored !== SERVER;
  const sender = ready && stored ? stored : null;
  const { rows, pending, working, loaded, localAudio, sendText, sendVoice, retry } = useChat(sender);
  const [sheet, setSheet] = useState<WhatChangedTarget | null>(null);
  const [showNew, setShowNew] = useState(false);

  const scroller = useRef<HTMLDivElement | null>(null);
  const content = useRef<HTMLDivElement | null>(null);
  const stuck = useRef(true);
  const lastKey = useRef<string>("");

  const toBottom = useCallback((smooth = false) => {
    const el = scroller.current;
    if (!el) return;
    stuck.current = true;
    setShowNew(false);
    if (smooth) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    else el.scrollTop = el.scrollHeight;
  }, []);

  // Stay pinned to the bottom while content grows (new bubbles, typing rows, images, keyboard).
  useEffect(() => {
    const el = scroller.current;
    const inner = content.current;
    if (!el || !inner) return;
    const ro = new ResizeObserver(() => {
      if (stuck.current) el.scrollTop = el.scrollHeight;
    });
    ro.observe(inner);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // A new message while scrolled up shows a "new messages" pill instead of yanking the view.
  useEffect(() => {
    const last = pending.length ? pending[pending.length - 1].clientId : rows.length ? `m${rows[rows.length - 1].id}` : "";
    if (last && lastKey.current && last !== lastKey.current && !stuck.current) setShowNew(true);
    lastKey.current = last;
  }, [rows, pending]);

  // Only the user's own scrolling (wheel, touch, keys, scrollbar) unpins the view; layout shifts never do.
  const userAt = useRef(0);
  const markUser = () => {
    userAt.current = Date.now();
  };
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (nearBottom) stuck.current = true;
    else if (Date.now() - userAt.current < 1200) stuck.current = false;
    if (stuck.current && showNew) setShowNew(false);
  };

  const pick = (name: string) => {
    memSender = name;
    saveSender(name);
    senderSubs.forEach((cb) => cb());
    requestAnimationFrame(() => toBottom(true));
  };

  const askWho = ready && loaded && !sender;

  return (
    <div className="flex h-dvh w-full flex-col bg-cream">
      <ChatHeader sender={sender} working={working} />

      <div
        ref={scroller}
        onScroll={onScroll}
        onWheel={markUser}
        onTouchMove={markUser}
        onPointerDown={markUser}
        onKeyDown={markUser}
        className="relative flex-1 overflow-y-auto overscroll-contain"
      >
        <div ref={content}>
          {!loaded && (
            <div className="flex justify-center pt-16" aria-label="Loading chat">
              <span className="tg-dots flex gap-1.5 text-muted">
                <span />
                <span />
                <span />
              </span>
            </div>
          )}
          {loaded && (
            <MessageList
              rows={rows}
              pending={pending}
              working={working}
              me={sender}
              localAudio={localAudio}
              onWhatChanged={setSheet}
              onRetry={retry}
              footer={askWho ? <WhoIsThis onPick={pick} /> : null}
            />
          )}
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => toBottom(true)}
          className={`tg-press absolute -top-12 left-1/2 z-10 -translate-x-1/2 rounded-full border border-line bg-paper px-3.5 py-1.5 text-[13px] font-extrabold text-ink/80 shadow-md transition-[opacity,transform] duration-200 ${
            showNew ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
          }`}
          tabIndex={showNew ? 0 : -1}
        >
          New messages ↓
        </button>
        <Composer disabled={!sender} onSendText={sendText} onSendVoice={sendVoice} onSent={() => toBottom()} />
      </div>

      {sheet && <WhatChangedSheet key={`${sheet.file}-${sheet.toVersion}`} target={sheet} onClose={() => setSheet(null)} />}
    </div>
  );
}
