// heartbeat.md job lines (PLAN.md D5). Pure; safe on client and server.
// Format: - <when> | <action> | <text> | set by <who>
import { sectionLines } from "./files-pure";
import type { Job, JobAction, JobWhen } from "./types";

const ACTIONS: JobAction[] = ["say", "call", "brief", "song"];
const HHMM = /^([01]?\d|2[0-3]):([0-5]\d)$/;

function pad(t: string): string {
  const m = t.match(HHMM);
  return m ? `${m[1].padStart(2, "0")}:${m[2]}` : t;
}

export function parseWhen(s: string): JobWhen | null {
  const w = s.trim().toLowerCase();
  let m = w.match(/^daily at (\d{1,2}:\d{2})$/);
  if (m && HHMM.test(m[1])) return { kind: "daily", at: pad(m[1]) };
  m = w.match(/^every (\d+) (hours?|minutes?|mins?) from (\d{1,2}:\d{2}) to (\d{1,2}:\d{2})$/);
  if (m && HHMM.test(m[3]) && HHMM.test(m[4])) {
    const n = parseInt(m[1], 10);
    const everyMinutes = m[2].startsWith("hour") ? n * 60 : n;
    if (everyMinutes < 1) return null;
    return { kind: "every", everyMinutes, from: pad(m[3]), to: pad(m[4]) };
  }
  m = w.match(/^once on (\d{1,2} [a-z]{3}) at (\d{1,2}:\d{2})$/);
  if (m && HHMM.test(m[2])) {
    const [d, mon] = m[1].split(" ");
    return { kind: "once", at: pad(m[2]), date: `${parseInt(d, 10)} ${mon[0].toUpperCase()}${mon.slice(1)}` };
  }
  m = w.match(/^once at (\d{1,2}:\d{2})$/);
  if (m && HHMM.test(m[1])) return { kind: "once", at: pad(m[1]) };
  return null;
}

/** Stable key for a job line: survives re-saves of the file as long as the line is unchanged. */
export function jobKey(raw: string): string {
  const s = raw.replace(/^-\s*/, "").replace(/\s+/g, " ").trim().toLowerCase();
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return `job_${h.toString(36)}`;
}

export function parseJobLine(line: string): Job | null {
  const raw = line.trim();
  if (!raw.startsWith("-")) return null;
  const parts = raw.replace(/^-\s*/, "").split("|").map((p) => p.trim());
  if (parts.length < 3) return null;
  const when = parseWhen(parts[0]);
  const action = parts[1].toLowerCase() as JobAction;
  if (!when || !ACTIONS.includes(action)) return null;
  const setBy = (parts[3] || "").replace(/^set by\s*/i, "").trim() || "Nani";
  return { key: jobKey(raw), raw, when, action, text: parts[2], setBy };
}

/** All valid jobs under "## Jobs" in heartbeat.md. Invalid lines are skipped. */
export function parseJobs(heartbeatMd: string): Job[] {
  return sectionLines(heartbeatMd, "## Jobs")
    .map(parseJobLine)
    .filter((j): j is Job => j !== null);
}

export function formatJob(j: Pick<Job, "when" | "action" | "text" | "setBy">): string {
  const w = j.when;
  const when =
    w.kind === "daily"
      ? `daily at ${w.at}`
      : w.kind === "every"
        ? w.everyMinutes % 60 === 0
          ? `every ${w.everyMinutes / 60} hours from ${w.from} to ${w.to}`
          : `every ${w.everyMinutes} minutes from ${w.from} to ${w.to}`
        : w.date
          ? `once on ${w.date} at ${w.at}`
          : `once at ${w.at}`;
  return `- ${when} | ${j.action} | ${j.text} | set by ${j.setBy}`;
}

export const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
export const fromMinutes = (n: number): string =>
  `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

/**
 * Due times (minutes after midnight) for a job on a given day.
 * `dayLabel` is like "17 Nov" (for "once on" jobs).
 */
export function jobTimesOn(job: Job, dayLabel: string): number[] {
  const w = job.when;
  if (w.kind === "daily") return [toMinutes(w.at)];
  if (w.kind === "once") return !w.date || w.date.toLowerCase() === dayLabel.toLowerCase() ? [toMinutes(w.at)] : [];
  const out: number[] = [];
  for (let t = toMinutes(w.from); t <= toMinutes(w.to); t += w.everyMinutes) out.push(t);
  return out;
}

/** One-line human summary of the jobs, for the brain prompt (C3 step 5). */
export function summarizeJobs(jobs: Job[]): string {
  if (!jobs.length) return "No routine jobs.";
  return jobs.map((j) => formatJob(j).replace(/^- /, "")).join("\n");
}
