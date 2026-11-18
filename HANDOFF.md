# Handoff · 2026-11-19

## State
The overnight beta (17 Nov) is done and live on production: the parents' group chat with Nani's five agents, the toy stand-in, the projector wall, the presenter page, routine jobs, the evening brief, calls and the pre-made sounds. The ★ B11 checks pass on production. A tech pitch page has been added at /pitch.html (PR #16).
- Report: docs/thinking-partner/NOW.md
- How to test it: docs/thinking-partner/DEMO.md
- Questions for the founder: docs/thinking-partner/OPEN.md
- Night log: docs/plan/RUNLOG.md

## Branches and PRs
None open. All PRs (#2 to #16) are merged; branches are deleted.

## Running
- Production: https://tutor-grandma.vercel.app with `/` (parents' chat), `/toy` (`?type` adds a text box), `/home-base` (`?demo=1` cycles the cues), `/presenter` (hidden) and `/pitch.html`.
- Vercel: project tutor-grandma, team hrizzup (`--scope hrizzup`), root apps/web, functions in bom1. main deploys to production; preview URLs return 401.
- Supabase: project tutor-grandma (ref kojmjmxnpaiuhswavarm, ap-south-1). Tables agent_files, messages, turns and demo_state, the public bucket `audio`, and realtime on all four tables. Migrations are in supabase/migrations: `supabase db push --remote --yes -p "$SUPABASE_DB_PASSWORD"`.
- Seed and reset: `curl -X POST https://tutor-grandma.vercel.app/api/reset` restores content/seed.json.
- Self-test on production: `python3 -I scripts/selftest/selftest.py all|voice|chat [--voices 0,1,2] [--lines 1-17] [--no-reset] [--no-report]`. It writes docs/plan/SELFTEST.md.
- Contracts: docs/plan/CONTRACTS.md (between parts of the app) and docs/toy-contract.md (for the hardware track).
- Env, in .env.local and in Vercel: ANTHROPIC_API_KEY, ELEVENLABS_API_KEY, KIMI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY.

## Next actions, in order
1. Founder: answer OPEN.md ("From the overnight beta"): the Kimi stalls and the Haiku switch, real-device checks, and the voice clone.
2. Before any demo: run /preflight, then the self-test, then reset.
3. Once Anthropic credit is fixed: test the Claude Haiku 5.5 path end to end (lib/brain.ts, the sorter's streamed JSON) before switching `brain.provider`.
4. Then: fixes from real devices, grandma's voice clone, and the hardware track against docs/toy-contract.md.

## Gotchas
- After every squash-merge, run `git pull --ff-only` on local main, or the next S commit diverges.
- To wait for a deploy: `gh api repos/Zugzwang-world/TutorGrandma/commits/<sha>/status --jq .state` until it says `success`.
- Kimi k2.6: never send temperature. It stalls on some requests; /api/turn and the sorter cancel and retry one at a time (`brainStreamRetry`). Never send parallel requests: Kimi throttles bursts.
- Commit `pnpm-lock.yaml` with any package change, or Vercel's frozen install fails.
- Builders share the Playwright browser: tell them to open their own context.
- GitHub blocks pushes that use the founder's private email; the repo config uses the noreply address.
- Never touch hrizzup-staging or anything in Zugzwang-world's Org in Supabase.
- If a key arrives in chat, write it to .env.local and never echo it. The repo is public.
