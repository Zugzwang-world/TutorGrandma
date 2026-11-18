// Run with node --test after compiling (see the PR). Covers the PLAN C10 due-time logic.
import assert from "node:assert/strict";
import { test } from "node:test";
import { formatJob, jobSecondsOn, jobTimesOn, parseJobLine, parseJobs, parseWhen, stampOnceDate } from "../jobs";
import { dueJobs, fireId, nextJob, startWindow, upcomingJobs, windowStart, type ClockReading } from "./index";

const at = (hhmm: string, dateKey = "2026-11-17", dayLabel = "17 Nov"): ClockReading => {
  const [h, m] = hhmm.split(":").map(Number);
  return { minutes: h * 60 + m, dateKey, dayLabel };
};
const md = (lines: string[]) => `# Routine\n\n## Jobs\n${lines.join("\n")}\n`;

const water = "- every 2 hours from 10:00 to 18:00 | say | Aarav beta, paani pi lo! | set by Mumma";
const brief = "- daily at 19:00 | brief | Evening brief for Mumma and Papa | set by Nani";
const once = "- once at 19:00 | call | Papa | set by Papa";

test("every 2 hours from 10:00 to 18:00 fires at 12:00", () => {
  const jobs = parseJobs(md([water]));
  const now = at("12:00");
  const due = dueJobs(jobs, startWindow(now.minutes), now);
  assert.equal(due.length, 1);
  assert.equal(due[0].dueAt, "2026-11-17T12:00");
  assert.equal(dueJobs(jobs, 11 * 60 + 59, now).length, 1);
  assert.equal(dueJobs(jobs, 12 * 60, at("12:01")).length, 0); // already past
  assert.equal(dueJobs(jobs, startWindow(13 * 60), at("13:00")).length, 0); // 13:00 is not a slot
});

test("a clock jump past several slots fires only the latest", () => {
  const jobs = parseJobs(md([water]));
  const due = dueJobs(jobs, 9 * 60, at("16:30"));
  assert.deepEqual(due.map((d) => d.dueAt), ["2026-11-17T16:00"]);
});

test("daily at 19:00 fires at 19:00, once per day", () => {
  const jobs = parseJobs(md([brief]));
  assert.equal(dueJobs(jobs, startWindow(19 * 60), at("19:00"))[0]?.dueAt, "2026-11-17T19:00");
  assert.equal(dueJobs(jobs, 18 * 60 + 58, at("18:59")).length, 0);
  assert.equal(dueJobs(jobs, startWindow(19 * 60), at("19:00", "2026-11-18", "18 Nov"))[0]?.dueAt, "2026-11-18T19:00");
});

test("once at 19:00, and once on a date", () => {
  const jobs = parseJobs(md([once, "- once on 18 Nov at 09:00 | song | Play it | set by Mumma"]));
  assert.equal(jobs.length, 2);
  assert.equal(dueJobs(jobs, startWindow(19 * 60), at("19:00")).length, 1);
  assert.equal(dueJobs(jobs, startWindow(9 * 60), at("09:00")).length, 0); // wrong date
  assert.equal(dueJobs(jobs, startWindow(9 * 60), at("09:00", "2026-11-18", "18 Nov")).length, 1);
});

test("next upcoming job, and skipping fires already done", () => {
  const jobs = parseJobs(md([water, brief]));
  const now = at("12:30");
  assert.equal(nextJob(jobs, now)?.dueAt, "2026-11-17T14:00");
  const skip = new Set([fireId(jobs[0].key, "2026-11-17T14:00")]);
  assert.equal(nextJob(jobs, now, skip)?.dueAt, "2026-11-17T16:00");
  assert.equal(nextJob(jobs, at("19:30")), null);
  assert.equal(upcomingJobs(jobs, at("12:00")).length, 4); // 14, 16, 18, 19:00; 12:00 itself is not upcoming
});

test("clock jumps: forward catches recent skips, backward and first check only the current minute", () => {
  const jobs = parseJobs(md([water, brief]));
  // +30 min from 11:50 to 12:20 catches the 12:00 water slot
  const a = dueJobs(jobs, windowStart(at("11:50"), at("12:20")), at("12:20"));
  assert.deepEqual(a.map((d) => d.dueAt), ["2026-11-17T12:00"]);
  // jump 12:00 -> 19:00: the brief fires, the stale 18:00 water slot does not
  const b = dueJobs(jobs, windowStart(at("12:00"), at("19:00")), at("19:00"));
  assert.deepEqual(b.map((d) => d.job.action), ["brief"]);
  // jump back to 12:00 from 20:30 fires the 12:00 slot once
  const c = dueJobs(jobs, windowStart(at("20:30"), at("12:00")), at("12:00"));
  assert.deepEqual(c.map((d) => d.dueAt), ["2026-11-17T12:00"]);
  // first check
  assert.equal(dueJobs(jobs, windowStart(null, at("19:30")), at("19:30")).length, 0);
});

// ---------- REFINE R4.1: job lines with no end, seconds, and dated one-offs ----------

test("every 2 hours from HH:MM:SS has no end: due at the start, then every 2 hours to the end of the day", () => {
  const w = parseWhen("every 2 hours from 01:16:05");
  assert.deepEqual(w, { kind: "every", everyMinutes: 120, from: "01:16:05" });
  const job = parseJobLine("- every 2 hours from 01:16:05 | say | Aarav beta, paani pi lo! | set by Mumma")!;
  const secs = jobSecondsOn(job, "19 Nov");
  assert.equal(secs[0], 1 * 3600 + 16 * 60 + 5);
  assert.equal(secs[1], 3 * 3600 + 16 * 60 + 5);
  assert.equal(secs.at(-1), 23 * 3600 + 16 * 60 + 5);
  assert.equal(secs.length, 12);
  assert.deepEqual(jobTimesOn(job, "19 Nov").slice(0, 2), [76, 196]);
});

test("every N minutes from HH:MM with no end, and the old window form still parse", () => {
  assert.deepEqual(parseWhen("every 30 minutes from 7:05"), { kind: "every", everyMinutes: 30, from: "07:05" });
  assert.deepEqual(parseWhen("every 2 hours from 10:00 to 18:00"), { kind: "every", everyMinutes: 120, from: "10:00", to: "18:00" });
  assert.deepEqual(parseWhen("daily at 19:00"), { kind: "daily", at: "19:00" });
  assert.equal(parseWhen("every 0 minutes from 10:00"), null);
  assert.equal(parseWhen("every 2 hours from 25:00"), null);
});

test("seconds in one-off times", () => {
  assert.deepEqual(parseWhen("once on 19 Nov at 01:16:35"), { kind: "once", at: "01:16:35", date: "19 Nov" });
  const job = parseJobLine("- once on 19 Nov at 01:18:00 | call | Papa | set by Papa")!;
  assert.deepEqual(jobSecondsOn(job, "19 Nov"), [4680]);
  assert.deepEqual(jobSecondsOn(job, "20 Nov"), []);
  assert.equal(parseWhen("once on 19 Nov at 01:16:60"), null);
});

test("formatJob round-trips every form", () => {
  for (const line of [
    "- every 2 hours from 01:16:05 | say | Paani pi lo! | set by Mumma",
    "- every 45 minutes from 09:00 | say | Stretch! | set by Papa",
    "- every 2 hours from 10:00 to 18:00 | say | Paani pi lo! | set by Mumma",
    "- once on 19 Nov at 01:18:00 | call | Papa | set by Papa",
    "- once at 19:00 | call | Papa | set by Papa",
    "- daily at 20:30 | say | Good night! | set by Nani",
  ]) {
    assert.equal(formatJob(parseJobLine(line)!), line);
  }
});

test("a dateless one-off gets today's date stamped; other lines are unchanged", () => {
  assert.equal(stampOnceDate("- once at 19:00 | call | Papa | set by Mumma", "19 Nov"), "- once on 19 Nov at 19:00 | call | Papa | set by Mumma");
  assert.equal(stampOnceDate("- once at 7:05:30 | say | Hi | set by Papa", "19 Nov"), "- once on 19 Nov at 07:05:30 | say | Hi | set by Papa");
  for (const l of ["- once on 20 Nov at 19:00 | call | Papa | set by Mumma", "- daily at 19:00 | brief | Brief | set by Nani", "- every 2 hours from 01:00 | say | x | set by Mumma"]) {
    assert.equal(stampOnceDate(l, "19 Nov"), l);
  }
});
