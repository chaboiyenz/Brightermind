import { defineConfig, devices } from "@playwright/test";

// Demo-polish smoke suite (docs/project-overview.md §5's Playwright rollout).
// Scope is deliberately bounded: one browser (Chromium), one demo-path-shaped
// suite — sign-in/sign-out, the route-gating matrix, and a light/dark
// screenshot check on the pages the retheme audit actually found a miss on.
// Not a full cross-browser/device matrix; expand projects below if that's
// wanted later.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    // Port 4321, not 3000: this repo's dev environment routinely has
    // something else already bound to 3000 (a concurrently-running `pnpm
    // dev`), which served stale dev-mode assets underneath this suite's own
    // build the first time this was tried — a dedicated port avoids it.
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // The video-call page embeds a real meet.jit.si iframe requesting
    // camera/mic (see CallRoom.tsx) — fake devices + auto-granted permission
    // so it doesn't hang on a real permission prompt or a real camera. See
    // e2e/call.spec.ts for why the suite stops at the page shell rather than
    // asserting a real two-party Jitsi handshake.
    launchOptions: {
      args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"],
    },
    permissions: ["camera", "microphone"],
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    // A production build, not `next dev` — dev mode compiles each route on
    // its first hit, which is slow enough under parallel workers to look
    // like a broken redirect/gate rather than a slow compile (this is what
    // actually happened while first writing this suite: a plain `/mood`
    // request that should redirect just... hadn't finished compiling yet).
    // A build serves pre-compiled pages, which is also the more honest CI
    // check anyway. `reuseExistingServer` still lets `pnpm dev` be used
    // locally if a dev server is already running.
    command: "pnpm build && pnpm start",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      // `next start` honours PORT directly — simpler and more portable
      // across pnpm/npm than threading a `-p` flag through `pnpm start --`.
      PORT: "4321",
      NEXT_PUBLIC_MOCK_MODE: "true",
    },
  },
});
