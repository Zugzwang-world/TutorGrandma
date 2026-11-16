# Now · 2026-11-16

**Step 1, setup: nearly done. Supabase is live, the keys are stored, and the live brain runs on Kimi (kimi-k2.6) until buildathon day. Left: the founder's OK to put the Supabase vars in Vercel, then T9 b and c. Details in OPEN.md.**

## Running
- Repo: https://github.com/Zugzwang-world/TutorGrandma (main; squash merge only, auto-merge on, branches deleted on merge)
- Web: https://tutor-grandma.vercel.app (`/` and `/home-base`, placeholders). Vercel project tutor-grandma, team hrizzup, root apps/web; main deploys to production, PRs get previews.
- Supabase: org Tutor Grandma (new, Free plan), project tutor-grandma in Mumbai (ap-south-1), ref kojmjmxnpaiuhswavarm, https://supabase.com/dashboard/project/kojmjmxnpaiuhswavarm. No tables yet. The repo is linked (`supabase/config.toml`). URL and keys are in .env.local, not yet in Vercel.
- Live brain switch: `brain` in content/demo.config.json. Provider kimi, model kimi-k2.6, thinking off. Set provider to "anthropic" for Claude Haiku 5.5.
- Vercel env (all three environments): ANTHROPIC_API_KEY, ELEVENLABS_API_KEY, KIMI_API_KEY.

## Preflight · 2026-11-16
- Kimi (kimi-k2.6, thinking off): works, first byte in 0.52 s. Balance 14.77 (USD).
- ElevenLabs: works. Creator tier, 1,238 of 100,215 characters used; resets 2026-11-18.
- Anthropic: skipped while Kimi is the brain. The last call today still said credit too low.

## Kimi latency · 2026-11-16
Median first word over 6 warm runs, from the founder's Mac: k2.6 690 ms, k3.1-pro 1,148 ms, k3.1-pro-highspeed 1,428 ms, k3 2,127 ms. All with thinking off.

## Workflow proof (T9)
- (a) S, one-word README fix committed straight to main: done by the Coordinator on Opus 5.5.
- (b) M, builder adds "Grandma is on her way" to /home-base: pending.
- (c) Scout looks up the stable Next.js version: pending. The scout did run today, on Haiku 5.5, for the Kimi model lookup.

## Next
Supabase vars into Vercel (after the founder's OK), T9 b and c. Then the product session and game spec.
