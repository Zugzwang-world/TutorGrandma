# Handoff · 2026-11-16

## State
Step 1 (setup) is done. Research lives in docs/thinking-partner/RESEARCH.md; R1 to R4 are not kept. T9 a, b and c are done. The live brain is kimi-k2.6 until 22 November (buildathon), then Claude Haiku 5.5, through `brain` in content/demo.config.json. Next is planning in a new thinking-partner chat; the agenda is in OPEN.md. Software first: no hardware or firmware work, and no Sarvam, until a brief says so.

## Branches and PRs
None open. main only. PR #1 (T9b) is merged.

## Running
- GitHub: https://github.com/Zugzwang-world/TutorGrandma
- Production: https://tutor-grandma.vercel.app (`/`, `/home-base`)
- Vercel: project tutor-grandma (prj_Fk2AIqrl3S9XeUi0aiXY6uuQRyVm), team hrizzup (team_m0d8TiC9xuPrm9qI8ob6byBM), root apps/web, Git connected
- Supabase: org Tutor Grandma (tlwtdcmdpydwzijvfogz, Free), project tutor-grandma (ref kojmjmxnpaiuhswavarm, ap-south-1), no tables. Repo linked via supabase/config.toml; run `supabase link --project-ref kojmjmxnpaiuhswavarm` in any new checkout (link state is gitignored).
- Env, in .env.local and in Vercel (all three environments): ANTHROPIC_API_KEY, ELEVENLABS_API_KEY, KIMI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY. In .env.local only: SUPABASE_DB_PASSWORD, SUPABASE_PROJECT_REF, VERCEL_OIDC_TOKEN.

## Next actions, in order
1. Wait for the planning brief from the new thinking-partner chat. Run /preflight at its start.
2. Before 22 November: the founder fixes Anthropic credit. Then set `brain.provider` to "anthropic" and run /preflight with the Anthropic check back on.

## Gotchas
- GitHub blocks pushes that use the founder's private email. This repo's local git config uses the GitHub noreply address, and worktrees share it.
- After every squash-merge, run `git pull --ff-only` on local main, or the next S commit diverges.
- The Vercel MCP connection has no access to team hrizzup. Use the Vercel CLI with `--scope hrizzup`. To add env vars, pipe the value in with `printf %s` so no newline is stored.
- Preview and per-deployment URLs sit behind Vercel auth and return 401. Check the production alias instead.
- Next.js 16.4.6 has cacheComponents on. apps/web/AGENTS.md says to read node_modules/next/dist/docs before writing Next code.
- If a key or token arrives in chat, write it to .env.local or export it, and never echo it. The repo is public.
- Supabase: never touch hrizzup-staging or anything in Zugzwang-world's Org (CLAUDE.md). Hosted Supabase CLI changes need `--yes` in agent mode. A brand-new org can return "Not Found" on project create for a few seconds; retry.
- Kimi: base https://api.moonshot.ai/v1 (OpenAI-compatible). Turn thinking off with `"thinking": {"type": "disabled"}`. K3 models also accept it, even though the docs say they always think. Balance: GET /users/me/balance.
- ANTHROPIC_API_KEY in .env.local is quoted. Strip the quotes when reading it in shell.
- `supabase projects api-keys` masks secret keys unless you pass `--reveal`. A masked key fails with "Invalid API key".
