"use client";
// The routine clock on /toy (PLAN.md C10). Reads heartbeat.md and the demo clock live, checks every 15 s
// (and right after a clock change) for due jobs, and fires each once per due time through POST /api/event.
//
// Wiring (one line in the toy page):
//   const { offsetMs } = useRoutine({ play, setLastEvent });
// `play(url)` plays an mp3 url through the toy's audio; `setLastEvent` records what Nani did last so the
// next child turn knows. `onCall(who)` is optional; by default the hook broadcasts toy:aarav `call` ringing.
//
// It uses its OWN Supabase client: supabase-js returns the same channel object for the same topic, so
// re-using the page's toy:aarav channel would throw on `.on()` after subscribe. One extra socket is cheap.
import { createClient, type RealtimeChannel, type SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { audioById } from "@/lib/audio";
import { clockParts, demoNow } from "@/lib/clock";
import { CHILD_ID } from "@/lib/config";
import { parseJobs } from "@/lib/jobs";
import { fireId, nextJob, windowStart, dueJobs, type ClockReading, type DueJob } from "@/lib/routine";
import { channelName, type Job, type NaniEvent } from "@/lib/types";

export type CallWho = "mumma" | "papa";

export interface RoutineOptions {
  /** Play an mp3 url (public path like /audio/song.mp3 or a Supabase url) through the toy's audio. */
  play: (url: string) => void | Promise<void>;
  /** Record the toy's last non-reply event; the next child turn sends it to /api/turn. */
  setLastEvent: (e: NaniEvent) => void;
  /** A call job fired. Default (omitted): broadcast toy:aarav `call` { state: "ringing" }. N2 replaces this. */
  onCall?: (who: CallWho) => void;
  /** Turn the clock off (e.g. while a call is open). Default true. */
  enabled?: boolean;
}

const CHECK_MS = 15_000;
const DAY_MS = 86_400_000;

const reading = (offsetMs: number): ClockReading => {
  const p = clockParts(demoNow(offsetMs));
  return { minutes: p.minutes, dateKey: p.dateKey, dayLabel: p.dayLabel };
};

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

async function postJson(url: string, body: unknown): Promise<{ ok: boolean; status: number; data: Record<string, unknown> }> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: {} };
  }
}

function whoOf(text: string): CallWho {
  return /mumma|mummy|mom|mama|mother|maa/i.test(text) ? "mumma" : "papa";
}

/** Casual chat line Routine posts when it acts. Null: post nothing. */
function chatText(job: Job): string | null {
  switch (job.action) {
    case "say": {
      const goodNight = audioById("line_good_night")?.text;
      if (goodNight && norm(goodNight) === norm(job.text)) return "Said good night to Aarav 🌙";
      return `Reminded Aarav: ${job.text} ${/paani|water|pani/i.test(job.text) ? "💧" : "🔔"}`;
    }
    case "call":
      return `Calling ${whoOf(job.text) === "mumma" ? "Mumma" : "Papa"} now 📞`;
    case "song":
      return "Played the song for Aarav 🎵";
    case "brief":
      return null;
  }
}

export function useRoutine(opts: RoutineOptions): { offsetMs: number; jobs: Job[] } {
  const [offsetMs, setOffsetMs] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);

  const optsRef = useRef(opts);
  useEffect(() => {
    optsRef.current = opts;
  });

  const jobsRef = useRef<Job[]>([]);
  const offsetRef = useRef(0);
  const lastRef = useRef<ClockReading | null>(null); // reading at the previous check
  const loaded = useRef({ jobs: false, clock: false });
  const firedRef = useRef<Set<string>>(new Set()); // fireId()s this tab has already handled
  const checkRef = useRef<() => void>(() => {});
  const fireNextRef = useRef<() => void>(() => {});
  const enabled = opts.enabled !== false;
  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    const sb: SupabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    let dead = false;
    let toyCh: RealtimeChannel | null = null;

    const playId = async (id: string) => {
      const f = audioById(id)?.file;
      if (f) await optsRef.current.play(f);
    };

    // ----- acting on one due job -----
    const act = async (d: DueJob) => {
      const { job, dueAt } = d;
      const id = fireId(job.key, dueAt);
      if (firedRef.current.has(id)) return;
      firedRef.current.add(id);
      const text = chatText(job);
      const r = await postJson("/api/event", {
        bot: "routine",
        ...(text ? { text } : {}),
        turn: { kind: "job", meta: { jobKey: job.key, dueAt, action: job.action, text: job.text } },
      });
      if (!r.ok) {
        firedRef.current.delete(id); // not recorded: allow a retry (fire_next_job)
        return;
      }
      if (r.data.duplicate) return; // another tab or an earlier fire already did this one
      const at = new Date().toISOString();
      const o = optsRef.current;
      try {
        if (job.action === "say") {
          o.setLastEvent({ kind: "reminder", text: job.text, jobKey: job.key, at });
          const goodNight = audioById("line_good_night");
          if (goodNight?.text && norm(goodNight.text) === norm(job.text)) await playId("line_good_night");
          else {
            const s = await postJson("/api/say", { text: job.text });
            if (s.ok && typeof s.data.url === "string") await o.play(s.data.url);
          }
        } else if (job.action === "call") {
          const who = whoOf(job.text);
          o.setLastEvent({ kind: "call", text: `Calling ${who === "mumma" ? "Mumma" : "Papa"}`, jobKey: job.key, at });
          await playId(`line_call_${who}`);
          if (o.onCall) o.onCall(who);
          else toyCh?.send({ type: "broadcast", event: "call", payload: { callId: crypto.randomUUID(), state: "ringing", who } });
        } else if (job.action === "brief") {
          o.setLastEvent({ kind: "brief", text: job.text, jobKey: job.key, at });
          await postJson("/api/brief", {}); // 404 until G5 lands: fine
        } else if (job.action === "song") {
          o.setLastEvent({ kind: "song", text: audioById("song")?.text ?? "the song", jobKey: job.key, at });
          await playId("song");
        }
      } catch (e) {
        console.error("routine: act failed", e);
      }
    };

    // ----- the check -----
    const check = () => {
      if (dead || !loaded.current.jobs || !loaded.current.clock) return;
      const now = reading(offsetRef.current);
      const start = windowStart(lastRef.current, now);
      lastRef.current = now;
      if (!enabledRef.current) return;
      for (const d of dueJobs(jobsRef.current, start, now)) void act(d);
    };
    checkRef.current = check;

    // Fire the next upcoming job now (today, else tomorrow's first), skipping ones already fired.
    fireNextRef.current = () => {
      if (!loaded.current.jobs) return;
      const now = reading(offsetRef.current);
      let d = nextJob(jobsRef.current, now, firedRef.current);
      if (!d) {
        const t = clockParts(new Date(demoNow(offsetRef.current).getTime() + DAY_MS));
        d = nextJob(jobsRef.current, { minutes: -1, dateKey: t.dateKey, dayLabel: t.dayLabel }, firedRef.current);
      }
      if (d) void act(d);
    };

    const applyJobs = (content: string | null | undefined) => {
      const list = parseJobs(content ?? "");
      jobsRef.current = list;
      loaded.current.jobs = true;
      setJobs(list);
    };
    const applyOffset = (ms: unknown) => {
      if (typeof ms !== "number" || !Number.isFinite(ms)) return;
      if (loaded.current.clock && ms === offsetRef.current) return;
      offsetRef.current = ms;
      loaded.current.clock = true;
      setOffsetMs(ms);
      check(); // right after a clock change
    };

    // ----- initial reads -----
    const filter = `child_id=eq.${CHILD_ID}`;
    sb.from("agent_files")
      .select("content")
      .eq("child_id", CHILD_ID)
      .eq("name", "heartbeat")
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!dead && !loaded.current.jobs) applyJobs(data?.content);
        if (!dead) check();
      });
    sb.from("demo_state")
      .select("clock_offset_ms")
      .eq("child_id", CHILD_ID)
      .maybeSingle()
      .then(({ data }) => {
        if (dead) return;
        if (data) applyOffset(data.clock_offset_ms);
        else if (!loaded.current.clock) {
          loaded.current.clock = true;
          check();
        }
      });

    // ----- live: heartbeat.md, demo_state, toy broadcasts -----
    const dbCh = sb
      .channel(`routine-db:${CHILD_ID}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "agent_files", filter }, (p) => {
        const row = p.new as { name?: string; content?: string };
        if (row?.name === "heartbeat") applyJobs(row.content);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "demo_state", filter }, (p) => {
        applyOffset((p.new as { clock_offset_ms?: number })?.clock_offset_ms);
      })
      .subscribe();

    toyCh = sb
      .channel(channelName.toy(CHILD_ID))
      .on("broadcast", { event: "clock" }, ({ payload }) => applyOffset(payload?.offsetMs))
      .on("broadcast", { event: "fire_next_job" }, () => fireNextRef.current())
      .subscribe();

    const timer = setInterval(check, CHECK_MS);
    return () => {
      dead = true;
      clearInterval(timer);
      void sb.removeChannel(dbCh);
      if (toyCh) void sb.removeChannel(toyCh);
      void sb.realtime.disconnect();
    };
  }, []);

  return { offsetMs, jobs };
}
