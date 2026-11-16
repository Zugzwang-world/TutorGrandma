// Memory's answer to a parent's question about the child (PLAN.md C12). Server-only.
// The sorter picks Memory with kind "question"; this call replaces its quick reply with one grounded in today's turns.
import { brainComplete } from "../brain";
import { clockParts, demoNow } from "../clock";
import { config, CHILD_ID } from "../config";
import { getDemoState } from "../demo-state";
import { getLatest } from "../files";
import { dayNotes, dayTurns, MEMORY_TONE, turnsText } from "./memory";

const child = config.childName;
const nani = config.grandmaName;

const SYSTEM = `You are Memory, the member of the family group chat who knows ${child} (age ${config.age}) best. A parent asks you about ${child}. Answer from today's turns with ${nani} (his words, her words and the cues: spelled words, counts, cheers), ${nani}'s notes, and brain.md.

${MEMORY_TONE}
- One or two lines, at most 30 words, same language as the parent (English, Hindi or a mix).
- Be specific: pick at most two real moments and name them (the word he spelled, what he counted, who he shared with). Quote his own short words once when you can, exactly as in the turns. Stay under 30 words, the closing question included.
- Only what ${child} himself said or did counts as his: a question ${nani} asked or a number she offered is not his. If the turns don't show it, leave it out.
- End with one small thing the parent can ask him, tied to a real moment from today's turns. Never invent a moment that is not in the turns or notes below.
- Vary the opening; lead with the moment you're proudest of.
- If there are no turns today, say warmly that he hasn't played with ${nani} yet today and share his last day from "Last few days" in brain.md.
- If the question is about something else (a fact about him), answer it from brain.md; if you don't know, say so kindly.
Reply with the answer text only.`;

/** A specific, warm one-or-two-line answer. Throws on a brain or database error (the caller keeps the sorter's reply). */
export async function answerMemoryQuestion(question: string, sender: string): Promise<string> {
  const demo = await getDemoState(CHILD_ID);
  const [brain, turns, notes] = await Promise.all([getLatest(CHILD_ID, "brain"), dayTurns(CHILD_ID), dayNotes(CHILD_ID)]);
  const now = clockParts(demoNow(demo.clock_offset_ms));
  const hindi = /[\u0900-\u097F]|\b(kya|hai|hain|ne|ko|aaj|kaise|kaisa|mein|se|ki|ka|nahi|haan|kuch|bata|batao|usne|kitna)\b/i.test(question);
  const lang = hindi ? "the same mix of Hindi and English the parent used" : "English only (no Hindi sentences; a Hindi word he said may be quoted)";
  const user = `Today is ${now.dayLabel}. ${sender} asks: ${question}
Reply in ${lang}, at most 30 words.

TODAY'S TURNS WITH ${child.toUpperCase()}
${turnsText(turns)}

${nani.toUpperCase()}'S NOTES TODAY
${notes.length ? notes.map((n) => `- ${n}`).join("\n") : "(none)"}

BRAIN.MD
${brain.content.trim()}`;
  const r = await brainComplete({
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: user },
    ],
    maxTokens: 200,
    signal: AbortSignal.timeout(7_000), // past this the sorter's own reply is used
  });
  // Unwrap only a fully quoted answer: a closing quote after "Ask him, "…?"" belongs to the answer.
  const raw = r.text.trim();
  const text = (/^["“][^"“”]*["”]$/.test(raw) ? raw.slice(1, -1) : raw).replace(/\s*\n+\s*/g, " ");
  if (!text) throw new Error("memory answer: empty");
  return text;
}
