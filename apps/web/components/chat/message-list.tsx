"use client";
import type { ReactNode } from "react";
import { BOT_KEYS, BOTS, type BotInfo, type BotKey, type FileName, type Message } from "@/lib/types";
import { BotAvatar, ParentAvatar } from "./avatar";
import { CallBubble } from "./call-bubble";
import { SayButton } from "./say-button";
import { botOf, dayKey, dayLabel, timeLabel, toneOf } from "./ui";
import type { Pending, Row } from "./use-chat";
import { VoicePlayer } from "./voice-player";

export interface WhatChangedTarget {
  file: FileName;
  toVersion: number;
  changedLines?: string[];
}

type Item =
  | { t: "day"; key: string; label: string }
  | { t: "msg"; key: string; row: Row; first: boolean }
  | { t: "pending"; key: string; p: Pending; first: boolean };

const GROUP_MS = 5 * 60_000;

const same = (a: string, b: string | null) => !!b && a.trim().toLowerCase() === b.trim().toLowerCase();

function buildItems(rows: Row[], pending: Pending[]): Item[] {
  const out: Item[] = [];
  let lastDay = "";
  let lastSender = "";
  let lastAt = 0;
  const push = (sender: string, at: string, make: (first: boolean) => Item) => {
    const d = dayKey(at);
    if (d !== lastDay) {
      out.push({ t: "day", key: `day-${d}`, label: dayLabel(at) });
      lastDay = d;
      lastSender = "";
    }
    const ts = new Date(at).getTime();
    const first = sender !== lastSender || ts - lastAt > GROUP_MS;
    out.push(make(first));
    lastSender = sender;
    lastAt = ts;
  };
  for (const r of rows) {
    const k = typeof r.meta?.clientId === "string" ? r.meta.clientId : `m${r.id}`;
    const grouping = r.meta?.kind === "call" ? `${r.sender}#call${r.id}` : r.sender;
    push(grouping, r.created_at, (first) => ({ t: "msg", key: k, row: r, first }));
  }
  for (const p of pending) push(p.sender, p.createdAt, (first) => ({ t: "pending", key: p.clientId, p, first }));
  return out;
}

// ---------- bubbles ----------

function Time({ iso, children }: { iso?: string; children?: ReactNode }) {
  return (
    <span className="pointer-events-none absolute right-3 bottom-1.5 flex items-center gap-1 text-[11px] leading-none text-muted/90 tabular-nums">
      {iso ? timeLabel(iso) : null}
      {children}
    </span>
  );
}

const SPACER = <span aria-hidden className="inline-block w-[4.2rem]" />;

function Tag({ bot, children }: { bot: BotInfo | null; children: ReactNode }) {
  const t = bot ? toneOf(bot) : null;
  return (
    <span
      className={`mb-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-extrabold tracking-wide uppercase ${
        t ? `${t.soft} ${t.text}` : "bg-line text-muted"
      }`}
    >
      {children}
    </span>
  );
}

function bubbleShape(side: "left" | "right", first: boolean) {
  const base = "relative rounded-[22px] px-3.5 pt-2 pb-2";
  if (side === "right") return `${base} ${first ? "rounded-tr-md" : ""} border border-marigold/25 bg-marigold-soft`;
  return `${base} ${first ? "rounded-tl-md" : ""} border border-line bg-paper shadow-[0_1px_0_rgba(43,33,24,0.04)]`;
}

function MessageBody({
  row,
  bot,
  mine,
  first,
  localAudio,
}: {
  row: Message;
  bot: BotInfo | null;
  mine: boolean;
  first: boolean;
  localAudio?: string;
}) {
  const kind = row.meta?.kind;
  if (kind === "call") return <CallBubble message={row} />;

  const voice = kind === "voice" || ((kind === "call_clip" || !bot) && !!row.audio_url);
  const text = voice ? (typeof row.meta?.transcript === "string" && row.meta.transcript) || row.text : row.text;
  const isNani = row.sender === "nani";

  return (
    <div className={bubbleShape(mine ? "right" : "left", first)}>
      {(kind === "note" || kind === "event") && <Tag bot={bot}>from playtime</Tag>}
      {kind === "brief" && <Tag bot={bot}>Evening brief</Tag>}
      {voice && <VoicePlayer src={localAudio ?? row.audio_url} mine={mine} />}
      {text ? (
        <p className={`text-base leading-[1.4] break-words whitespace-pre-wrap ${voice ? "mt-1" : ""}`}>
          {text}
          {!isNani && SPACER}
        </p>
      ) : (
        !isNani && <span className="block h-3">{SPACER}</span>
      )}
      {isNani && text && (
        <div className="pr-16">
          <SayButton text={text} />
        </div>
      )}
      <Time iso={row.created_at} />
    </div>
  );
}

function LeftRow({
  first,
  avatar,
  name,
  nameClass,
  children,
  below,
  fresh,
}: {
  first: boolean;
  avatar: ReactNode;
  name: string;
  nameClass: string;
  children: ReactNode;
  below?: ReactNode;
  fresh?: boolean;
}) {
  return (
    <div className={`flex items-start gap-2 ${first ? "mt-3" : "mt-1"} ${fresh ? "tg-enter tg-origin-left" : ""}`}>
      <div className="w-8 shrink-0">{first ? avatar : null}</div>
      <div className="flex max-w-[82%] min-w-0 flex-col items-start">
        {first && <span className={`mb-0.5 ml-1 text-[13px] font-extrabold ${nameClass}`}>{name}</span>}
        {children}
        {below}
      </div>
    </div>
  );
}

function RightRow({ first, children, below, fresh }: { first: boolean; children: ReactNode; below?: ReactNode; fresh?: boolean }) {
  return (
    <div className={`flex justify-end ${first ? "mt-3" : "mt-1"} ${fresh ? "tg-enter tg-origin-right" : ""}`}>
      <div className="flex max-w-[82%] min-w-0 flex-col items-end">
        {children}
        {below}
      </div>
    </div>
  );
}

function WhatChangedLink({ bot, onOpen }: { bot: BotInfo; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`tg-press mt-1 ml-1 inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-[13px] font-bold ${toneOf(bot).text} hover:underline`}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden className="opacity-80">
        <path
          d="M4 1.5h5.2L13 5.3V13a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13V3a1.5 1.5 0 0 1 1-1.5Z M9 1.8V5.5h3.7 M6 9h4 M8 7v4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      what changed
    </button>
  );
}

function MessageRow({
  row,
  first,
  me,
  localAudio,
  onWhatChanged,
}: {
  row: Row;
  first: boolean;
  me: string | null;
  localAudio?: string;
  onWhatChanged: (t: WhatChangedTarget) => void;
}) {
  const bot = botOf(row.sender);
  if (!bot && row.sender_kind === "system") {
    return (
      <div className={`my-3 flex justify-center ${row.fresh ? "tg-enter" : ""}`}>
        <span className="max-w-[85%] rounded-full bg-line/60 px-3 py-1 text-center text-[13px] text-muted">{row.text}</span>
      </div>
    );
  }
  const mine = !bot && same(row.sender, me);
  const body = <MessageBody row={row} bot={bot} mine={mine} first={first} localAudio={localAudio} />;

  if (mine) {
    return (
      <RightRow first={first} fresh={row.fresh}>
        {body}
      </RightRow>
    );
  }
  if (bot) {
    const m = row.meta ?? {};
    const canDiff = !!m.file && typeof m.toVersion === "number";
    return (
      <LeftRow
        first={first}
        fresh={row.fresh}
        avatar={<BotAvatar bot={bot} size={32} />}
        name={bot.name}
        nameClass={toneOf(bot).text}
        below={
          canDiff ? (
            <WhatChangedLink
              bot={bot}
              onOpen={() => onWhatChanged({ file: m.file as FileName, toVersion: m.toVersion as number, changedLines: m.changedLines })}
            />
          ) : null
        }
      >
        {body}
      </LeftRow>
    );
  }
  return (
    <LeftRow first={first} fresh={row.fresh} avatar={<ParentAvatar name={row.sender} size={32} />} name={row.sender} nameClass="text-ink/70">
      {body}
    </LeftRow>
  );
}

function PendingRow({ p, first, localAudio, onRetry }: { p: Pending; first: boolean; localAudio?: string; onRetry: (id: string) => void }) {
  const failed = p.status === "failed";
  return (
    <RightRow
      first={first}
      fresh
      below={
        failed ? (
          <button
            type="button"
            onClick={() => onRetry(p.clientId)}
            className="tg-press mt-1 mr-1 inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-[13px] font-bold text-memory"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden>
              <path d="M13.5 8A5.5 5.5 0 1 1 11.9 4.1M13.5 2v3.2h-3.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {p.error ?? "not sent"} · retry
          </button>
        ) : null
      }
    >
      <div className={`${bubbleShape("right", first)} ${failed ? "opacity-70" : ""}`}>
        {p.kind === "voice" && <VoicePlayer src={localAudio ?? null} mine />}
        {p.kind === "voice" && !p.text ? (
          <p className="mt-1 text-base leading-[1.4]">
            <span className={p.status === "transcribing" ? "tg-shimmer font-semibold" : "text-muted"}>
              {p.status === "transcribing" ? "Writing it down…" : "Voice note"}
            </span>
            {SPACER}
          </p>
        ) : (
          <p className={`text-base leading-[1.4] break-words whitespace-pre-wrap ${p.kind === "voice" ? "mt-1" : ""}`}>
            {p.text}
            {SPACER}
          </p>
        )}
        <Time iso={p.createdAt}>
          {!failed && (
            <svg width="12" height="12" viewBox="0 0 16 16" aria-label="sending" className="text-muted">
              <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 4.6V8l2.2 1.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
        </Time>
      </div>
    </RightRow>
  );
}

function TypingRow({ bot, on }: { bot: BotInfo; on: boolean }) {
  return (
    <div className="tg-collapse" data-open={on} aria-hidden={!on}>
      <div>
        <div className="flex items-center gap-2 pt-2">
          <BotAvatar bot={bot} size={32} />
          <div className="flex items-center gap-2 rounded-[22px] rounded-tl-md border border-line bg-paper px-3.5 py-2.5">
            <span className={`text-[13px] font-extrabold ${toneOf(bot).text}`}>{bot.name}</span>
            <span className={`tg-dots flex items-center gap-1 ${toneOf(bot).text}`} aria-label="typing">
              <span />
              <span />
              <span />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MessageList({
  rows,
  pending,
  working,
  me,
  localAudio,
  onWhatChanged,
  onRetry,
  footer,
}: {
  rows: Row[];
  pending: Pending[];
  working: BotKey[];
  me: string | null;
  localAudio: Record<string, string>;
  onWhatChanged: (t: WhatChangedTarget) => void;
  onRetry: (clientId: string) => void;
  footer?: ReactNode;
}) {
  const items = buildItems(rows, pending);
  return (
    <div className="mx-auto w-full max-w-[640px] px-3 pt-2 pb-3">
      {items.map((it) => {
        if (it.t === "day")
          return (
            <div key={it.key} className="my-3 flex justify-center">
              <span className="rounded-full border border-line/70 bg-cream/95 px-3 py-0.5 text-[12px] font-bold text-muted shadow-[0_1px_2px_rgba(43,33,24,0.05)]">
                {it.label}
              </span>
            </div>
          );
        if (it.t === "msg") {
          const cid = typeof it.row.meta?.clientId === "string" ? it.row.meta.clientId : "";
          return (
            <MessageRow
              key={it.key}
              row={it.row}
              first={it.first}
              me={me}
              localAudio={cid ? localAudio[cid] : undefined}
              onWhatChanged={onWhatChanged}
            />
          );
        }
        return <PendingRow key={it.key} p={it.p} first={it.first} localAudio={localAudio[it.p.clientId]} onRetry={onRetry} />;
      })}
      <div aria-live="polite">
        {BOT_KEYS.map((k) => (
          <TypingRow key={k} bot={BOTS[k]} on={working.includes(k)} />
        ))}
      </div>
      {footer}
    </div>
  );
}
