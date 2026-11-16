# Now · 2026-11-16

**Step 1, setup: Supabase is done. Still missing: the ElevenLabs key (it did not come through in chat again), the Supabase vars in Vercel, and T9 b and c. Details in OPEN.md.**

## Running
- Repo: https://github.com/Zugzwang-world/TutorGrandma (main; squash merge only, auto-merge on, branches deleted on merge)
- Web: https://tutor-grandma.vercel.app (`/` and `/home-base`, placeholders). Vercel project tutor-grandma, team hrizzup, root apps/web; main deploys to production, PRs get previews.
- Supabase: org Tutor Grandma (new, Free plan), project tutor-grandma in Mumbai (ap-south-1), ref kojmjmxnpaiuhswavarm, https://supabase.com/dashboard/project/kojmjmxnpaiuhswavarm. Empty: no tables yet. This repo is linked to it (`supabase/config.toml`). URL and keys are in .env.local, not yet in Vercel.

## Preflight · 2026-11-16
- Anthropic: founder says credit is topped up. Not re-checked yet.
- ElevenLabs: no key yet.
- Sarvam: not used until buildathon day (DECISIONS.md).

## Workflow proof (T9)
- (a) S, one-word README fix committed straight to main: done by the Coordinator on Opus 5.5.
- (b) M, builder adds "Grandma is on her way" to /home-base: pending.
- (c) Scout looks up the stable Next.js version: pending. The scaffold installed Next.js 16.4.6.

## Next
ElevenLabs key, Supabase vars into Vercel, /preflight, T9 b and c. Then the product session and game spec.
