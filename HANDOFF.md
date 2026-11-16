# Handoff · overnight beta · 2026-11-17, 03:15 IST

## State
The overnight beta (docs/plan/PLAN.md) is running: T0 01:08 IST; features stop 07:38; report at 08:38; hard stop 09:08.
- Waves 0, 1 and 2 are merged and live: chat, sorter and agents, toy, wall, sounds, routine clock, presenter, brief, live sync, calls.
- ★ B11 checks 1 to 5 pass on production (docs/plan/STAR-CHECKS.md).
- Self-test results are in docs/plan/SELFTEST.md; run 2 is in progress.
- Next: A10 polish with 2–3 builders, then a final self-test and the A11 report.

**Resume:** re-read docs/plan/RUN.md, RUNLOG.md and this file. Run `gh pr list`. Read usage with the `mcp__ccd_session_mgmt__get_usage` tool (live mode; thresholds in RUN.md A6).

## Branches and PRs
None open at 03:15. Builders open PRs from their own worktrees. Merge them one at a time: squash, delete the branch, pull, run /api/reset, check production.

## Running
- Production: https://tutor-grandma.vercel.app: `/` (parents' chat), `/toy` (`?type` adds a text box), `/home-base` (`?demo=1` cycles the cues), `/presenter` (hidden).
- Functions run in bom1. Supabase project kojmjmxnpaiuhswavarm has the tables agent_files, messages, turns and demo_state, plus the `audio` bucket.
- Seed and reset: `curl -X POST https://tutor-grandma.vercel.app/api/reset` restores content/seed.json.
- Self-test: `python3 -I scripts/selftest/selftest.py all|voice|chat [--voices 0,1,2] [--lines 1-17] [--no-reset] [--no-report]`.
- Contracts: docs/plan/CONTRACTS.md. Toy contract for hardware: docs/toy-contract.md.

## Next actions, in order
1. Read self-test run 2 (scripts/selftest/out/run2.log, docs/plan/SELFTEST.md). Fix ★ failures first.
2. A10 polish in order: chat feel → agent replies → topic fillers → wall animations → talking-loop speed. Stop new features at 07:38.
3. Final full self-test, then the A11 report: docs/thinking-partner/NOW.md, DECISIONS.md, OPEN.md and this file.

## Gotchas
- The Coordinator commits in `.claude/worktrees/overnight-beta-execution-10a681` and runs `git push origin HEAD:main`. After every merge: `git pull --ff-only origin main` there AND `git -C /Users/hrishikesh/Tutor-Grandma pull --ff-only`.
- Wait for a deploy with: `gh api repos/Zugzwang-world/TutorGrandma/commits/<sha>/status --jq .state` until it reads `success`.
- Kimi k2.6: never send temperature. It sometimes stalls past 6 s; /api/turn and the sorter send a backup request (`brainStreamHedged`).
- Commit `pnpm-lock.yaml` with any package change.
- Builders share the Playwright browser: tell them to open their own context.
- Preview URLs return 401: check production.
- Never touch hrizzup-staging or Zugzwang-world's Org in Supabase.
