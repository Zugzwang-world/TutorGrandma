# Handoff · 2026-11-16

## State
Step 1 (setup), brief in `~/Downloads/STEP_01_SETUP.md`, with one change from the founder: no Sarvam until buildathon day, ElevenLabs covers everything.
Done: T1 to T4, T7, T8 (skipped, no reports), T9a. Done: T5 Supabase (org Tutor Grandma, project tutor-grandma, repo linked; vars in .env.local only). Partly done: T6 (Anthropic key stored, founder says credit is topped up; ElevenLabs key still missing). Not started: T9b, T9c.

## Branches and PRs
None open. main only.

## Running
- GitHub: https://github.com/Zugzwang-world/TutorGrandma
- Production: https://tutor-grandma.vercel.app (`/`, `/home-base`)
- Vercel: project tutor-grandma (prj_Fk2AIqrl3S9XeUi0aiXY6uuQRyVm), team hrizzup (team_m0d8TiC9xuPrm9qI8ob6byBM), root apps/web, Git connected
- Supabase: org Tutor Grandma (tlwtdcmdpydwzijvfogz, Free), project tutor-grandma (ref kojmjmxnpaiuhswavarm, ap-south-1), no tables. Repo linked via supabase/config.toml; run `supabase link --project-ref kojmjmxnpaiuhswavarm` in any new checkout (link state is gitignored).
- Env, in .env.local and in Vercel (all three environments): ANTHROPIC_API_KEY. In .env.local only: SUPABASE_DB_PASSWORD, SUPABASE_PROJECT_REF, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY, VERCEL_OIDC_TOKEN.

## Next actions, in order
1. ElevenLabs key: the founder pastes it again (it was missing from two messages) or adds it to .env.local. Then store it in Vercel: `printf %s "$VAL" | vercel env add ELEVENLABS_API_KEY -e production,preview,development --no-sensitive --yes --force --scope hrizzup`.
2. After the founder's OK, add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SECRET_KEY to Vercel the same way. The auto-mode permission check blocked it without an explicit ask.
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
- If a key or token arrives in chat, write it to .env.local or export it, and never echo it. The repo is public.
- Supabase: never touch hrizzup-staging or anything in Zugzwang-world's Org (CLAUDE.md). Hosted Supabase CLI changes need `--yes` in agent mode. A brand-new org can return "Not Found" on project create for a few seconds; retry.
