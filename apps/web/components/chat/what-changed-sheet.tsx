"use client";
// "What changed" bottom sheet (for judges): the file's friendly name, that version with its new lines
// highlighted, who changed it and when, and the version list. Live on agent_files inserts.
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { CHILD_ID } from "@/lib/config";
import { diffLines } from "@/lib/files-pure";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { BOT_OF_FILE, BOTS, type AgentFile } from "@/lib/types";
import { BotAvatar } from "./avatar";
import type { WhatChangedTarget } from "./message-list";
import { botOf, uid, whenLabel } from "./ui";

function whoLabel(changedBy: string | null): string {
  if (!changedBy || changedBy === "seed") return "Starting version";
  const b = botOf(changedBy);
  return b ? `${b.emoji} ${b.name}` : changedBy;
}

export function WhatChangedSheet({ target, onClose }: { target: WhatChangedTarget; onClose: () => void }) {
  const bot = BOTS[BOT_OF_FILE[target.file]];
  const [label, fileName] = bot.fileLabel.split(" · ");
  const [versions, setVersions] = useState<AgentFile[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [picked, setPicked] = useState<number>(target.toVersion);
  const [closing, setClosing] = useState(false);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<number | null>(null);
  const body = useRef<HTMLDivElement | null>(null);
  const pills = useRef<HTMLDivElement | null>(null);

  // Load every version of this file, and stay live on new ones.
  useEffect(() => {
    let alive = true;
    const sb = supabaseBrowser();
    sb.from("agent_files")
      .select("*")
      .eq("child_id", CHILD_ID)
      .eq("name", target.file)
      .order("version", { ascending: true })
      .then(({ data, error }) => {
        if (!alive) return;
        if (error || !data) setFailed(true);
        else setVersions(data as AgentFile[]);
      });
    const ch = sb
      .channel(`files-sheet-${uid()}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "agent_files", filter: `child_id=eq.${CHILD_ID}` }, (p) => {
        const row = p.new as AgentFile;
        if (row.name !== target.file) return;
        setVersions((prev) => {
          const list = (prev ?? []).filter((v) => v.id !== row.id);
          return [...list, row].sort((a, b) => a.version - b.version);
        });
      })
      .subscribe();
    return () => {
      alive = false;
      void sb.removeChannel(ch);
    };
  }, [target.file]);

  const close = () => setClosing(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setClosing(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // If the asked-for version is gone (e.g. after a reset), show the latest.
  const current = useMemo(() => {
    if (!versions?.length) return null;
    return versions.find((v) => v.version === picked) ?? versions[versions.length - 1];
  }, [versions, picked]);

  const highlighted = useMemo(() => {
    if (!current || !versions) return new Set<string>();
    if (current.version === target.toVersion && target.changedLines?.length) {
      return new Set(target.changedLines.map((l) => l.trim()).filter(Boolean));
    }
    const prev = [...versions].reverse().find((v) => v.version < current.version);
    return new Set(prev ? diffLines(prev.content, current.content) : []);
  }, [current, versions, target.toVersion, target.changedLines]);

  // Bring the first highlighted line into view, and the picked version pill.
  useLayoutEffect(() => {
    const el = body.current?.querySelector<HTMLElement>("[data-new='true']");
    if (el && body.current) body.current.scrollTop = Math.max(0, el.offsetTop - 72);
    else if (body.current) body.current.scrollTop = 0;
    pills.current?.querySelector<HTMLElement>("[data-picked='true']")?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [current?.id]);

  // Drag the handle down to dismiss.
  const onDragStart = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragStart.current = e.clientY;
    setDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };
  const onDragMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStart.current == null) return;
    setDrag(Math.max(0, e.clientY - dragStart.current));
  };
  const onDragEnd = () => {
    if (dragStart.current == null) return;
    dragStart.current = null;
    setDragging(false);
    if (drag > 110) setClosing(true);
    else setDrag(0);
  };

  const lines = current ? current.content.replace(/\r\n/g, "\n").split("\n") : [];
  const latest = versions?.length ? versions[versions.length - 1].version : null;
  const newCount = lines.filter((l) => highlighted.has(l.trim()) && !l.trim().startsWith("#")).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={`What changed in ${label}`}>
      <div
        className="tg-backdrop absolute inset-0 bg-ink/35"
        data-closing={closing}
        onClick={close}
        onAnimationEnd={() => {
          if (closing) onClose();
        }}
      />
      <div
        className="tg-sheet relative flex max-h-[88dvh] w-full max-w-[640px] flex-col rounded-t-[28px] bg-cream shadow-[0_-8px_40px_rgba(43,33,24,0.18)]"
        data-closing={closing}
        style={
          {
            transform: !closing && drag ? `translateY(${drag}px)` : undefined,
            transition: !dragging && !closing ? "transform 260ms cubic-bezier(0.32,0.72,0,1)" : undefined,
            "--tg-drag": `${drag}px`,
          } as CSSProperties
        }
      >
        {/* handle + header (drag area) */}
        <div className="cursor-grab touch-none px-5 pt-2.5 pb-3 select-none" onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd} onPointerCancel={onDragEnd}>
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-ink/15" />
          <div className="flex items-center gap-3">
            <BotAvatar bot={bot} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[18px] leading-tight font-extrabold">{label}</p>
              <p className="mt-0.5 font-mono text-[13px] text-muted">{fileName}</p>
            </div>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={close}
              aria-label="Close"
              className="tg-press flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-line/70 text-ink/70"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* who + when */}
        {current && (
          <div className="mx-5 mb-3 rounded-2xl border border-line bg-paper px-3.5 py-2.5">
            <p className="text-[15px] leading-snug">
              <span className="font-extrabold">{whoLabel(current.changed_by)}</span>
              <span className="text-muted"> · {whenLabel(current.created_at)}</span>
            </p>
            {current.change_note && <p className="mt-0.5 text-[15px] leading-snug text-ink/75">“{current.change_note}”</p>}
          </div>
        )}

        {/* versions */}
        <div ref={pills} className="tg-noscrollbar flex shrink-0 gap-2 overflow-x-auto px-5 pb-3">
          {(versions ?? []).map((v) => {
            const on = current?.id === v.id;
            return (
              <button
                key={v.id}
                type="button"
                data-picked={on}
                onClick={() => setPicked(v.version)}
                className={`tg-press shrink-0 rounded-full border px-3.5 py-1.5 text-[14px] font-extrabold whitespace-nowrap transition-colors ${
                  on ? "border-marigold bg-marigold text-white" : "border-line bg-paper text-ink/75"
                }`}
              >
                v{v.version}
                {v.version === latest && <span className={on ? "text-white/85" : "text-muted"}> · now</span>}
              </button>
            );
          })}
        </div>

        {/* content */}
        <div ref={body} className="relative min-h-[140px] flex-1 overflow-y-auto overscroll-contain border-t border-line bg-paper px-3 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
          {!versions && !failed && <p className="px-2 py-6 text-center text-muted">Opening the file…</p>}
          {failed && <p className="px-2 py-6 text-center text-muted">Couldn&apos;t open the file right now.</p>}
          {current && (
            <>
              <p className="mb-2 px-2 text-[13px] font-bold text-muted">
                {newCount > 0
                  ? `${newCount} new line${newCount > 1 ? "s" : ""} in v${current.version}`
                  : current.version === 1
                    ? "The first version"
                    : `Nothing new to show in v${current.version}`}
              </p>
              <div className="text-base leading-[1.45]">
                {lines.map((raw, i) => {
                  const l = raw.trim();
                  if (!l) return <div key={i} className="h-2" />;
                  const isNew = highlighted.has(l) && !l.startsWith("#");
                  if (l.startsWith("#")) {
                    const h1 = /^#\s/.test(l);
                    return (
                      <p key={i} className={`px-2 font-extrabold ${h1 ? "pt-1 text-[18px]" : "pt-2 text-[15px] text-ink/80"}`}>
                        {l.replace(/^#+\s*/, "")}
                      </p>
                    );
                  }
                  return (
                    <p
                      key={i}
                      data-new={isNew}
                      className={`relative my-0.5 rounded-lg px-2 py-0.5 break-words ${
                        isNew
                          ? "bg-marigold-soft font-semibold before:absolute before:inset-y-1 before:left-0 before:w-[3px] before:rounded-full before:bg-marigold"
                          : "text-ink/80"
                      }`}
                    >
                      {isNew && <span className="mr-1.5 rounded-md bg-marigold px-1.5 py-px align-[1px] text-[11px] font-extrabold text-white uppercase">new</span>}
                      {l}
                    </p>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
