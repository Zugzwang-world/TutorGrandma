# Now · 2026-11-17 · overnight beta report

**The overnight beta is live on production. Every wave and the whole polish list (A10) is merged, and the ★ done checks (B11 1–5) pass on production. Run window: 01:08 to about 05:30 IST.** Details: docs/plan/RUNLOG.md, docs/plan/SELFTEST.md, docs/plan/STAR-CHECKS.md.

## Links
- Parents' group chat: https://tutor-grandma.vercel.app/
- Toy stand-in: https://tutor-grandma.vercel.app/toy (`?type` adds a text box for typed turns)
- Projector wall: https://tutor-grandma.vercel.app/home-base (`?demo=1` cycles every cue)
- Presenter (hidden): https://tutor-grandma.vercel.app/presenter
- Toy contract for the hardware track: docs/toy-contract.md

## What works
- ✓ Group chat with Nani's five agents: text and voice notes, live on two phones, one typing bubble at a time, "what changed" sheet with versions.
- ✓ Sorter: 10/10 on the plan's chat script on production. Each agent edits only its own file, in its own voice; edits never overwrite each other.
- ✓ Live sync: the next turn uses the new files; Nani follows changes at once (shells, mangoes) and keeps surprises secret.
- ✓ Outcome reports: Routine `Reminded Aarav at 12. He said "Pee liya abhi." 💧`, House rules "Nani just counted shells with Aarav 🐚", Lessons on the mango play; each reported once.
- ✓ Memory answers "What did he learn today?" from today's turns in 3–5 s, in the parent's language.
- ✓ Evening brief: three lines, three bedtime starters, a dated line in brain.md; a quiet day says so honestly.
- ✓ Toy: hold the paw or space; reaction at ~0 ms; topic-matched learning fillers; barge-in; Nani's voice (Dulari Didi, eleven_v4_turbo).
- ✓ Wall: every marker cue animated, thinking state, sticker strip, timings corner; driven live by the toy.
- ✓ Routine clock: jobs from heartbeat.md fire once per due time on the demo clock (water at 12:00, call and brief at 19:00).
- ✓ Presenter: reset, clock jumps, fire next job, brief, timings toggle, turns table.
- ✓ Call with Mumma: walkie-talkie between /toy and the chat (start, join, clips both ways about 1 s, end, 2-minute idle end). Starts only after Aarav says yes.
- ✓ 64 pre-made sounds and the song "Ek Do Teen, Count With Me".
- ✗ Not checked on real devices: phone microphone, iPhone Safari audio, the Android projector.

## Timings (final self-test, production, 51 voice turns, 3 test voices, 05:00 IST)
- Median per step: speech-to-text 587 ms · brain first word 1,559 ms · voice first audio 2,019 ms · total 3,210 ms.
- At the client: Nani's first sentence arrives at a median of 2.25 s after paw release.
- Perceived: the reaction sound plays at about 0 ms after release. When a learning filler plays, Nani's voice now starts at its next sentence end (p50 about 3.5 s, down from 4.3 s).
- Parents' chat: first agent reply median 3.0 s.

## Speech check
- Final run: 164/165 sentences pass (99%); 47/51 child lines heard correctly.
- Worst: single letters spoken alone ("M" heard as "N"; now fixed in the spelling game), "Bye Nani" heard as "Bhai Nani", one "Chaar!" garbled.
- Hindi in Roman letters sounds the same as Devanagari in Nani's voice (0.81 vs 0.80), so persona.md keeps Roman.

## Usage
- Weekly usage was 8% at 05:10 IST (started at 4%). About 4.5M fresh Opus tokens and 0.6M Sonnet tokens were summed from local transcripts.
- Credits: ElevenLabs about 17% of 100k characters used (resets 17 Nov 21:01 UTC); Kimi about 14.3 USD left.

## Known issues and next steps
1. **Kimi k2.6 stalls** on 10–15% of turns for 7–10 s, worse in some periods. The loop cancels and retries one at a time (up to 3 tries) and fillers cover the wait, but about 1 turn in 7 can still end with the "Chalo, ek naya khel" line. K3 models can't turn thinking off. Best fix: move the brain to Claude Haiku 5.5 once Anthropic credit is fixed (one switch in demo.config.json).
2. Test on real devices: phone mic, iPhone Safari, the projector browser.
3. Single-letter answers: while a spelling is on the wall, a one-letter answer now snaps to the board's tiles ("M" heard as "N" → M; checked 3/3 voices). Outside the spelling game, single letters can still be misheard.
4. A "once at 19:00" job with no date repeats daily; a clock jump only catches jobs from the last 30 minutes.
5. Agent replies sometimes add a small extra ("shells and stones").
