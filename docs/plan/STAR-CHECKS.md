# ★ done checks (B11) and fixes

## Run 1 on production, 03:01–03:05 IST
1. ✓ "Remind him to drink water every 2 hours" → Routine: "Done! Every 2 hours from 10 to 6, Nani will ask Aarav to drink water 💧"; heartbeat.md v2 has the job. With /toy awake, the presenter jump to 12:00 fired it once (turns kind job, dueAt 2026-11-17T12:00), and Routine posted "Reminded Aarav: Aarav beta, paani pi lo! Paani piya? 💧". Aarav: "Pee liya abhi." → Routine: `Reminded Aarav at 12. He said "Pee liya abhi." 💧`
2. ✓ "Don't use real money in examples, use shells" → House rules: "Got it, no money. Nani will count with shells 🐚". Next turn: "Aaj hum shells se ginti karenge, Aarav! [count 🐚] Dekho, ek shell aur ek shell, kitne hue?" → House rules: "Nani just counted shells with Aarav 🐚"
3. ✓ "I'm bringing mangoes for him tonight" → Lessons: "Lovely! Today's play is all about mangoes 🥭. I'll keep your surprise a secret 🤫", Memory: "Noted! Mango night stays our little secret 🤫". Next turn: "Aaj hum M for Mango seekhenge, Aarav! Aam pasand hai? [show 🥭 Mango]" (no surprise revealed) → Lessons: "Nani just taught Aarav M for Mango 🥭"
4. ✓ "What did he learn today?" → Memory (3.0 s): "He learned M for Mango 🥭 and counted shells with Nani, 1 + 1. He also practiced saying "Lion" and roared like a sher. Ask him how many shells made two!"
5. ✓ Two browser tabs on `/` both showed Memory's answer live, no refresh.

Fixes from this self-test (all on main): hedged brain requests (Kimi stalls), roars reach Nani as sounds (were "not heard"), no spoken "Nani:" prefix, plain-text agent bubbles, Memory answers in parallel with the sorter and in the parent's language (18 s → 3–5 s), /toy wakes without waiting for mic permission.
Re-run of the failing lines (8–10, 17 × 3 voices): roar now cheered in all 3; 1 of 12 still hit slow_brain (Kimi stalled on both requests).
