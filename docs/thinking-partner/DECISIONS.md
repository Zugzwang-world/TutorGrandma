# Decisions

One line each: date · decision · why.

- 2026-11-16 · Project name Tutor Grandma; repo Zugzwang-world/TutorGrandma, public.
- 2026-11-16 · Ages 5 to 8. One game for the demo, designed with the founder. Parental guidance, not control.
- 2026-11-16 · ElevenLabs is the voice core: Scribe, Eleven v4 Turbo, Eleven v4, grandma's clone.
- 2026-11-16 · No Sarvam until buildathon day; ElevenLabs covers everything, Indian languages included, for now · founder's change of plan, one voice vendor until then.
- 2026-11-16 · Live brain: Claude Haiku 5.5, thinking off, low effort. Fillers cover every wait.
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
