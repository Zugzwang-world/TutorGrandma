# Now · 2026-11-16

**Step 1, setup: mostly done. To finish it, the founder sends one message (ElevenLabs key, Supabase token, new session). Separately, Anthropic needs credit. Details in OPEN.md.**

## Running
- Repo: https://github.com/Zugzwang-world/TutorGrandma (main; squash merge only, auto-merge on, branches deleted on merge)
- Web: https://tutor-grandma.vercel.app (`/` and `/home-base`, placeholders). Vercel project tutor-grandma, team hrizzup, root apps/web; main deploys to production, PRs get previews.
- Supabase: not created yet. The CLI on this Mac is not logged in.

## Preflight · 2026-11-16
- Anthropic (claude-haiku-5-5): the key is valid but the account has no credit ("credit balance is too low"). The API doesn't show the balance.
- ElevenLabs: no key yet. It did not come through in chat and is not in the GraphPay env files.
- Sarvam: not used until buildathon day (DECISIONS.md).

## Workflow proof (T9)
- (a) S, one-word README fix committed straight to main: done by the Coordinator on Opus 5.5.
- (b) M, builder adds "Grandma is on her way" to /home-base: pending. The new subagents load only in a fresh session.
- (c) Scout looks up the stable Next.js version: pending, same reason. The scaffold installed Next.js 16.4.6.

## Next
Finish Step 1 (Supabase, ElevenLabs key, T9 b and c), then the product session and game spec.
