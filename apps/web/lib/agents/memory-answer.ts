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
- Be specific: name the real moments (the word he spelled, what he counted, who he shared with).
- End with one small thing the parent can ask him, tied to a real moment from today's turns. Never invent a moment that is not in the turns or notes below.
- If there are no turns today, say warmly that he hasn't played with ${nani} yet today and share his last day from "Last few days" in brain.md.
- If the question is about something else (a fact about him), answer it from brain.md; if you don't know, say so kindly.
Reply with the answer text only.`;

/** A specific, warm one-or-two-line answer. Throws on a brain or database error (the caller keeps the sorter's reply). */
export async function answerMemoryQuestion(question: string, sender: string): Promise<string> {
  const demo = await getDemoState(CHILD_ID);
  const [brain, turns, notes] = await Promise.all([getLatest(CHILD_ID, "brain"), dayTurns(CHILD_ID), dayNotes(CHILD_ID)]);
  const now = clockParts(demoNow(demo.clock_offset_ms));
  const user = `Today is ${now.dayLabel}. ${sender} asks: ${question}

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
  const text = r.text.trim().replace(/^["“]|["”]$/g, "").replace(/\s*\n+\s*/g, " ");
  if (!text) throw new Error("memory answer: empty");
  return text;
}
