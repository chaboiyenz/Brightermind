import { expect, test } from "@playwright/test";
import { signInAsPatient } from "./helpers";

// (e) Video call — scoped down from the original two-context Jitsi
// handshake idea. CallRoom.tsx embeds a REAL meet.jit.si iframe (a public
// third-party service, not a mock/fake room) — see its own docblock. A
// deterministic CI assertion that two contexts actually see each other's
// video would depend on meet.jit.si's live availability and the "first
// participant must sign in" quirk that page documents, which isn't
// something a smoke suite should be flaky against. This checks the page's
// own shell instead: it loads, mounts the iframe container, shows a
// connecting status, and the controls render — everything this app
// actually controls, without asserting on the third-party call itself.
test("call page shell loads and shows a connecting state", async ({ page }) => {
  await signInAsPatient(page);
  await page.goto("/call/1");

  await expect(page.getByRole("status")).toBeVisible();
  await expect(page.getByRole("button", { name: "End call" })).toBeVisible();
  // The iframe container Jitsi mounts into; not asserting the iframe itself
  // connects, per the docblock above.
  await expect(page.locator('[data-call-state]')).toBeVisible();
});
