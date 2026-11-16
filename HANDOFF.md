# Handoff · overnight beta · 2026-11-17, 05:15 IST

## State
The overnight beta is done and live. Waves 0–3 and the whole A10 polish list are merged; the ★ B11 checks pass on production (docs/plan/STAR-CHECKS.md); the final self-test is in docs/plan/SELFTEST.md; the report is in docs/thinking-partner/NOW.md. Production was reset to the seed at the end.

**Resume:** re-read docs/thinking-partner/NOW.md (report), OPEN.md (questions for the founder) and docs/plan/RUNLOG.md. Usage: `mcp__ccd_session_mgmt__get_usage`.

## Branches and PRs
None open. All 15 PRs are merged; branches are deleted.

## Running
- Production: https://tutor-grandma.vercel.app: `/` (parents' chat), `/toy` (`?type` adds a text box), `/home-base` (`?demo=1` cycles the cues), `/presenter` (hidden).
- Functions run in bom1. Supabase project kojmjmxnpaiuhswavarm has the tables agent_files, messages, turns and demo_state, plus the `audio` bucket.
- Seed and reset: `curl -X POST https://tutor-grandma.vercel.app/api/reset` restores content/seed.json.
- Self-test: `python3 -I scripts/selftest/selftest.py all|voice|chat [--voices 0,1,2] [--lines 1-17] [--no-reset] [--no-report]`.
- Contracts: docs/plan/CONTRACTS.md. Toy contract for hardware: docs/toy-contract.md.

## Next actions, in order
1. Founder: the questions in OPEN.md ("From the overnight beta"): Kimi stalls → Claude Haiku switch, real-device checks, the voice clone.
2. Before any demo: `python3 -I scripts/selftest/selftest.py all`, then `curl -X POST https://tutor-grandma.vercel.app/api/reset`.
3. Next build steps: real-device fixes, the voice clone, then the hardware track against docs/toy-contract.md.

## Gotchas
- The Coordinator commits in `.claude/worktrees/overnight-beta-execution-10a681` and runs `git push origin HEAD:main`. After every merge: `git pull --ff-only origin main` there AND `git -C /Users/hrishikesh/Tutor-Grandma pull --ff-only`.
- Wait for a deploy with: `gh api repos/Zugzwang-world/TutorGrandma/commits/<sha>/status --jq .state` until it reads `success`.
- Kimi k2.6: never send temperature. It stalls on 10–15% of requests; /api/turn and the sorter cancel and retry one at a time (`brainStreamRetry`). Never send parallel requests: Kimi throttles bursts.
- Commit `pnpm-lock.yaml` with any package change.
- Builders share the Playwright browser: tell them to open their own context.
- Preview URLs return 401: check production.
- Never touch hrizzup-staging or Zugzwang-world's Org in Supabase.
