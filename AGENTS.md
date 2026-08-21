# Agent boundaries

Two agents work this repo at the same time, in the **same working tree** on `main`.
There is no merge step between them: whoever writes a file last wins, silently.
Stay inside your lane.

## Ownership

| Path | Owner |
|---|---|
| `src/sections/portal/**` | Codex |
| `src/contexts/AuthContext.tsx` | Codex |
| `src/components/RequireAuth.tsx` | Codex |
| `src/lib/supabase.ts` | Codex |
| everything else | Claude |

Need a file outside your lane? Say so and hand it over. Do not edit it silently.

## Commit discipline

Uncommitted work is invisible to the other agent, and looks like corruption when
it appears mid-edit. Commit small and often.

- `git add <paths>` — never `git add -A`, it sweeps up the other agent's work.
- Do not revert or "fix" a change you did not make. Ask.
- `npx tsc --noEmit -p tsconfig.app.json` before you commit. `npm run build` runs
  `tsc`, so a type error anywhere fails the Vercel deploy for everyone.

## Working as a pair

Every task is split between both agents, roughly half each. Neither is the
other's reviewer by default — both write code.

1. **Plan before building.** Agree what each half is and where the seam runs,
   then state the plan before either agent edits a file.
2. **Split along file boundaries, never inside one file.** The seam has to fall
   where the ownership table already falls, or one agent's save silently
   overwrites the other's.
3. **Say so when a task will not halve.** A three-line CSS fix has no seam.
   Inventing one costs more than doing the work.

Claude reaches Codex through the `codex` MCP server (`claude mcp add codex --
codex mcp-server`), not by driving the desktop app.

## Project facts

- Vite 7 + React 19 + TS, Tailwind 3.4, React Router 7 lazy routes.
- Supabase for auth and the course catalogue. RLS is the filter — do not add
  `.eq('user_id', …)` on top of it.
- Brand tokens are RGB channel triplets: `rgb(var(--color-x) / <alpha-value>)`.
  A navy-ground container needs the `on-navy` class or its text resolves to the
  light-theme values and comes out navy-on-navy.
- The React Compiler lint rules are on: no `setState` in an effect body, no
  mutating a ref inside a callback body.
