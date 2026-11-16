// Routine clock, pure logic (PLAN.md C10). Which jobs are due on the demo clock, and which is next.
// Relative imports only so the tests run without the Next.js alias. Safe on client and server.
import { fromMinutes, jobTimesOn } from "../jobs";
import type { Job } from "../types";

/** The demo clock reading in India time (from clockParts(demoNow(offset))). */
export interface ClockReading {
  minutes: number; // minutes after midnight
  dateKey: string; // "2026-11-17"
  dayLabel: string; // "17 Nov"
}

export interface DueJob {
  job: Job;
  dueAt: string; // `${dateKey}T${hhmm}`, e.g. "2026-11-17T12:00"
  minutes: number; // minutes after midnight
}

const dueAtOf = (dateKey: string, minutes: number) => `${dateKey}T${fromMinutes(minutes)}`;

export const fireId = (jobKey: string, dueAt: string) => `${jobKey}@${dueAt}`;

/** Window start for a first check: fires the current minute, never backfills the day. */
export const startWindow = (nowMinutes: number) => nowMinutes - 1;

/** How far back a clock jump may reach for jobs it skipped over (minutes). Older slots are stale. */
export const LOOKBACK_MIN = 30;

/**
 * Where the next check's window starts, given the previous check's reading.
 * Normal ticks: the previous minute. A forward jump on the same day (+30 min, +2 h, 19:00) also
 * catches jobs it skipped, but only the last LOOKBACK_MIN minutes, so a jump to 19:00 does not
 * replay the 18:00 water reminder. First check, a backward jump or a new day: just the current minute.
 */
export function windowStart(prev: ClockReading | null, now: ClockReading): number {
  if (!prev || prev.dateKey !== now.dateKey || prev.minutes > now.minutes) return startWindow(now.minutes);
  return Math.max(prev.minutes, now.minutes - LOOKBACK_MIN);
}

/**
 * Jobs due in the window (prevMinutes, now.minutes] today.
 * A job fires at most once per check, at its latest due time in the window, so a clock jump
 * past several "every 2 hours" slots fires one reminder, not a burst.
 */
export function dueJobs(jobs: Job[], prevMinutes: number, now: ClockReading): DueJob[] {
  const out: DueJob[] = [];
  for (const job of jobs) {
    const hit = jobTimesOn(job, now.dayLabel)
      .filter((t) => t > prevMinutes && t <= now.minutes)
      .sort((a, b) => a - b)
      .pop();
    if (hit !== undefined) out.push({ job, dueAt: dueAtOf(now.dateKey, hit), minutes: hit });
  }
  return out.sort((a, b) => a.minutes - b.minutes);
}

/**
 * Upcoming jobs today, soonest first (strictly after now). `skip` holds fireId()s already done,
 * so "fire the next job" twice in a row moves on to the following one.
 */
export function upcomingJobs(jobs: Job[], now: ClockReading, skip?: ReadonlySet<string>): DueJob[] {
  const out: DueJob[] = [];
  for (const job of jobs) {
    for (const t of jobTimesOn(job, now.dayLabel)) {
      if (t <= now.minutes) continue;
      const dueAt = dueAtOf(now.dateKey, t);
      if (skip?.has(fireId(job.key, dueAt))) continue;
      out.push({ job, dueAt, minutes: t });
    }
  }
  return out.sort((a, b) => a.minutes - b.minutes);
}

export function nextJob(jobs: Job[], now: ClockReading, skip?: ReadonlySet<string>): DueJob | null {
  return upcomingJobs(jobs, now, skip)[0] ?? null;
}
