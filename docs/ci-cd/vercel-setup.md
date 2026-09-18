# Vercel Setup — web prototype

How `apps/web` gets a public URL. Do this once, in the Vercel dashboard; there is
no workflow file for it, because Vercel's Git integration handles the trigger
itself.

This covers the **web app only**. The API's deployment story is AWS, is not built
yet, and is documented separately in `environment-setup.md`.

## Why Vercel and not the AWS pipeline

The `deploy-*.yml` workflows only ever built `apps/api`. Nothing in them touches
`apps/web`, and their deploy steps are still `TODO` placeholders waiting on
`infra/` (TDD §9). Rather than block a shareable prototype on infrastructure
decisions that are still open, the web app deploys to Vercel, which needs no AWS
account and no Terraform.

This is deliberately not a staging environment. It runs in mock mode, with no
database, no Django and no real authentication. Treat it as a clickable
prototype for demos and feedback, not as an environment to test the API against.

## One-time project setup

1. **Add New → Project**, import this repository.
2. **Root Directory: `apps/web`.** This is the setting that matters — without it
   Vercel builds from the repo root and finds no Next.js app. Leave "Include
   files outside root directory" enabled so the root `pnpm-lock.yaml` and
   `pnpm-workspace.yaml` resolve.
3. **Framework preset:** Next.js, auto-detected. Accept the defaults; the build
   command (`next build`) and output directory need no overrides.
4. **Environment variables** (Settings → Environment Variables), for all
   environments:

   | Variable | Value | Why |
   |---|---|---|
   | `NEXT_PUBLIC_MOCK_MODE` | `true` | Serves every page from static fixtures, so no backend is required. Without it the app tries to reach `NEXT_PUBLIC_API_URL` and pages that fetch will fail. |

   Leave `NEXT_PUBLIC_API_URL` unset while mock mode is on. It is only needed if
   you later point a deployment at a real, publicly reachable API.

pnpm version is taken from `packageManager` in the root `package.json`, so it
matches local development without extra configuration.

## What deploys when

`dev` is this repository's default branch, and Vercel treats the default branch
as production. That means:

- **Push or merge to `dev`** → deploys to the project's main URL.
- **Open a pull request** → gets its own preview URL, posted as a comment on the
  PR. Useful for reviewing UI changes without pulling the branch.
- **Other branches** → preview deployments, not the main URL.

Nothing needs to be added to `.github/workflows/` for any of this.

## Known caveats

- **Video calls behave differently on a public URL.** Rooms live on
  `meet.jit.si`, whose public server requires the first participant in an
  anonymously-created room to sign in with Google/GitHub before the room starts.
  On localhost this is easy to miss; over a shared link it is the first thing a
  reviewer hits. See the docblock in `apps/web/src/app/call/[sessionId]/CallRoom.tsx`.
- **Mock data is not shared between visitors.** Community posts, journal entries
  and mood check-ins live in the browser, so two people opening the same link see
  different state. That is expected for a prototype.
- **The deployment is public by default.** Anyone with the URL can open it. There
  is no real authentication — the `/login` role cards are a prototype switcher,
  not a security boundary. Use Vercel's Deployment Protection if the demo should
  not be publicly reachable.
