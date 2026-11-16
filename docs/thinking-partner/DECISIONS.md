# Decisions

One line each: date · decision · why.

- 2026-11-16 · Project name Tutor Grandma; repo Zugzwang-world/TutorGrandma, public.
- 2026-11-16 · Ages 5 to 8. One game for the demo, designed with the founder. Parental guidance, not control.
- 2026-11-16 · ElevenLabs is the voice core: Scribe, Eleven v4 Turbo, Eleven v4, grandma's clone.
- 2026-11-16 · Sarvam deferred to the buildathon day; ElevenLabs is the only voice layer until then, Indian languages included · founder's change of plan, one voice vendor until then.
- 2026-11-16 · Live brain: Claude Haiku 5.5, thinking off, low effort. Fillers cover every wait. (From the buildathon on; Kimi until then, below.)
- 2026-11-16 · One agent per child, with files persona, brain, planner, heartbeat, parent. Memory is demo-level: "Yesterday you..." and "What did we do today?".
- 2026-11-16 · Supabase light: Realtime plus one table. No Fly.io, no region tests. Relay host decided in the product session.
- 2026-11-16 · Prototype: no security, compliance or production checks. No GitHub Actions or branch protection. Reviews only on the demo-critical path.
- 2026-11-16 · Roster: Coordinator Opus 5.5 xhigh; advisor Opus 5.5; builder, expert and reviewer Opus 5.5 xhigh; scout Haiku 5.5 xhigh.
- 2026-11-16 · Supabase lives in its own org (new, so Free plan), Tutor Grandma: project tutor-grandma, Mumbai · keeps it apart from hrizzup-staging in the founder's other org, which is off limits.
- 2026-11-16 · Use Supabase's new publishable and secret keys (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY), not the legacy anon and service_role keys · current Supabase default.
- 2026-11-16 · Live brain runs on Kimi until buildathon day, then Claude Haiku 5.5 · founder's call.
- 2026-11-16 · Kimi model: kimi-k2.6, thinking off · fastest of four measured from the founder's Mac, median first word over 6 warm runs: k2.6 690 ms, k3.1-pro 1,148 ms, k3.1-pro-highspeed 1,428 ms, k3 2,127 ms. Highspeed with thinking on gave no words within 60 tokens. k2.6 is deprecated (expected late Dec 2026); the fallback is kimi-k3.1-pro-highspeed.
- 2026-11-16 · Provider and model live in content/demo.config.json under `brain`. Moving to Claude means changing `provider` to "anthropic" · one line.
- 2026-11-16 · KIMI_API_KEY is stored like the other keys (.env.local and Vercel). /preflight checks Kimi and ElevenLabs and skips Anthropic while the provider is kimi · founder's call.
- 2026-11-16 · Buildathon is 22 November, before kimi-k2.6 retires, so keep kimi-k2.6 · founder's answer.
- 2026-11-16 · /preflight makes one tiny Supabase read. It runs at the start of every step, which keeps the Free project from pausing · founder's call.
- 2026-11-16 · The ElevenLabs key is unrestricted: jingles, songs and sound effects are allowed · founder's call.
- 2026-11-16 · Software first: the whole product runs end to end without the toy. Hardware joins later as an outside layer through one contract, the toy-to-relay message format, which only the Coordinator changes · the demo can't depend on hardware timing.
- 2026-11-16 · After planning, the thinking partner works in two chats, software and hardware · keeps each context lean.
- 2026-11-16 · The Grandma Plush Blueprint page is out of date and will be replaced by the plan · founder's call.
- 2026-11-17 · Overnight beta: Nani's voice is "Dulari Didi – Gentle Old Aunty" from the shared library (wSMP2ehaozb5I36yi8vg). Test voices: Muskaan, Amit Bhawani, Bholu (child) · the account had no grandma voice; plan C9.
- 2026-11-17 · Kimi k2.6 temperature is not sent (the API fixes it at 0.6 with thinking off; other values error) · overrides the plan's "about 0.7".
- 2026-11-17 · Speech-to-text model is scribe_v3, live voice eleven_v4_turbo, pre-made lines eleven_v4, sound effects eleven_text_to_sound_v3, music music_v2_5 · newest per LOOKUPS.md.
- 2026-11-17 · Added a demo_state table (clock offset, wall timings switch) and a meta column on turns · a freshly loaded /toy needs the presenter clock, and job fires need a key.
- 2026-11-17 · Shared layer adds brain.ts, eleven.ts, broadcast.ts, clock.ts, demo-state.ts, seed.ts beyond the plan's list · stops five builders writing five Kimi and ElevenLabs clients.
- 2026-11-17 · Seed lives in content/seed.json; the chat broadcast channel is chat:aarav (event "working") · one source for the seed and /api/reset.
- 2026-11-17 · Vercel functions run in bom1 (Mumbai) via apps/web/vercel.json · Supabase is in ap-south-1 and the demo is in India; iad1 added about 200 ms per database hop.
- 2026-11-17 · Nani writes Hindi in Roman letters (Hinglish), not Devanagari · C8 test, 10 lines in Nani's voice on eleven_v4_turbo with language_code hi: transcribed back almost identically (word overlap 0.81 Roman vs 0.80 Devanagari). Roman reads naturally in the parent chat and mixes cleanly with English and markers; persona.md examples stay as they are.
- 2026-11-17 · Non-★ tasks run at high effort even under 8% · usage rose 4%→5% in the first 37 min; at that pace the night would pass 10%.
- 2026-11-17 · Wave 2 is leaner: G4 and P1 run as one builder task (they share the clock), and non-★ M tasks (G4+P1, G5) use Sonnet 5.5 at high effort · usage was 6% at 44 min; Opus builders cost about 1% each.
