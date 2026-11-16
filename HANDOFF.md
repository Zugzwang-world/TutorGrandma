# Handoff · overnight beta · 2026-11-17

## State
The overnight beta run (docs/plan/PLAN.md) is in progress. T0 was 01:08 IST and the hard stop is 09:08 IST. Wave 0 is done: tables, seed, shared layer (apps/web/lib), contracts (docs/plan/CONTRACTS.md), lookups, Nani's voice, functions in bom1. Wave 1 is running. Progress is in docs/plan/RUNLOG.md.

**Resume:** re-read docs/plan/RUN.md, RUNLOG.md and this file. Check open PRs with `gh pr list`. Read usage with the `mcp__ccd_session_mgmt__get_usage` tool (live mode).

## Branches and PRs
Wave 1 builders open PRs from their own worktrees: G1, G2, N1, S1, then W1. Merge one at a time: squash, delete the branch, pull, run /api/reset, check production.

## Running
- Production: https://tutor-grandma.vercel.app (`/`, `/toy`, `/home-base`, `/presenter` once built). Functions run in bom1.
- GitHub: https://github.com/Zugzwang-world/TutorGrandma
- Vercel: project tutor-grandma, team hrizzup (`--scope hrizzup`), root apps/web.
- Supabase: project tutor-grandma (ref kojmjmxnpaiuhswavarm, ap-south-1). Tables agent_files, messages, turns, demo_state; bucket `audio`; realtime on all four tables.
- Seed: `curl -X POST https://tutor-grandma.vercel.app/api/reset` restores content/seed.json.
- Nani's voice: wSMP2ehaozb5I36yi8vg (Dulari Didi). Models are in content/demo.config.json and LOOKUPS.md.

## Next actions, in order
1. Merge wave 1 PRs as they arrive (reviewer on G1, G2, N1). Launch W1 when a slot frees.
2. Before wave 2: add `POST /api/event` (Routine/system chat posts and job turns) to CONTRACTS.md and build it.
3. Wave 2: G3 after G1, G2 and N1 merge; G4 and P1 alongside it; then G5; N2 after G4.
4. Wave 3: self-test (T1), then the report (T2, A11).

## Gotchas
- The Coordinator commits in the worktree `.claude/worktrees/overnight-beta-execution-10a681` and runs `git push origin HEAD:main`. After every squash-merge, run `git pull --ff-only origin main` in that worktree AND `git -C /Users/hrishikesh/Tutor-Grandma pull --ff-only`.
- Commit `pnpm-lock.yaml` with any package change, or Vercel's frozen install fails.
- Kimi k2.6: never send temperature (fixed at 0.6 with thinking off).
- Preview URLs return 401: check production.
- GitHub blocks pushes that use the founder's private email; the repo config uses the noreply address.
- Never touch hrizzup-staging or Zugzwang-world's Org in Supabase.
- `supabase db push --remote --yes -p "$SUPABASE_DB_PASSWORD"` applies migrations; the worktree is linked.
