# Handoff · 2026-11-16

## State
Step 1 (setup), brief in `~/Downloads/STEP_01_SETUP.md`, with one change from the founder: no Sarvam until buildathon day, ElevenLabs covers everything.
Done: T1 to T4, T7, T8 (skipped, no reports), T9a. Partly done: T6 (Anthropic key stored; ElevenLabs key missing). Not started: T5 Supabase (CLI not logged in), T9b, T9c.

## Branches and PRs
None open. main only.

## Running
- GitHub: https://github.com/Zugzwang-world/TutorGrandma
- Production: https://tutor-grandma.vercel.app (`/`, `/home-base`)
- Vercel: project tutor-grandma (prj_Fk2AIqrl3S9XeUi0aiXY6uuQRyVm), team hrizzup (team_m0d8TiC9xuPrm9qI8ob6byBM), root apps/web, Git connected
- Env, in .env.local and in Vercel (all three environments): ANTHROPIC_API_KEY. .env.local also has VERCEL_OIDC_TOKEN from `vercel link`.

## Next actions, in order
1. Store the ElevenLabs key as ELEVENLABS_API_KEY in .env.local, then in Vercel: `printf %s "$VAL" | vercel env add ELEVENLABS_API_KEY -e production,preview,development --no-sensitive --yes --force --scope hrizzup`.
2. T5 Supabase, after the founder runs `supabase login`:
   - Run `supabase orgs list` and pick the Pro org. If there are several, check the plan through the management API.
   - Run `supabase projects create tutor-grandma --org-id <id> --region ap-south-1 --db-password <generated>` and save SUPABASE_DB_PASSWORD in .env.local.
   - Wait for ACTIVE_HEALTHY, then run `supabase projects api-keys --project-ref <ref>`.
   - Put NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY in .env.local and Vercel. No tables.
3. Run /preflight: Anthropic with max_tokens 1, and ElevenLabs `GET /v1/user/subscription` for characters used and the limit. Record the result in NOW.md.
4. T9b: the builder adds a "Grandma is on her way" line to /home-base in a worktree. Then PR, squash-merge, `git pull --ff-only`, and check that https://tutor-grandma.vercel.app/home-base shows it.
5. T9c: the scout looks up the current stable Next.js version. Note in NOW.md which model each T9 task ran on.
6. Update NOW.md and this file, then send the T10 report.

## Gotchas
- GitHub blocks pushes that use the founder's private email. This repo's local git config uses the GitHub noreply address, and worktrees share it.
- After every squash-merge, run `git pull --ff-only` on local main, or the next S commit diverges.
- The Vercel MCP connection has no access to team hrizzup. Use the Vercel CLI with `--scope hrizzup`. To add env vars, pipe the value in with `printf %s` so no newline is stored.
- Preview and per-deployment URLs sit behind Vercel auth and return 401. Check the production alias instead.
- Next.js 16.4.6 has cacheComponents on. apps/web/AGENTS.md says to read node_modules/next/dist/docs before writing Next code.
- Anthropic credit was empty on 2026-11-16, so any Haiku call fails until the founder tops it up.
