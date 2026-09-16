import { expect, test } from "@playwright/test";
import { expectGuestSession, expectSignedInSession, signInAsPatient, signOut } from "./helpers";

// (a) Mock sign-in via /login's role cards, and (c) sign-out via AvatarMenu.
// docs/role-based-system-plan.md §1/§4; components/SessionProvider.tsx.
test.describe("mock sign-in / sign-out", () => {
  test("signing in as a patient persists the session and swaps the nav", async ({ page }) => {
    await page.goto("/");
    // Guest header: no avatar, no "My care" link.
    await expect(page.getByRole("link", { name: "My care" })).toHaveCount(0);

    await signInAsPatient(page);
    await expectSignedInSession(page);

    // PATIENT_NAV replaces PRIMARY_NAV — "My care" only exists for patients.
    await expect(page.getByRole("link", { name: "My care" })).toBeVisible();

    // Persists across a full reload, not just in React state.
    await page.reload();
    await expectSignedInSession(page);
    await expect(page.getByRole("link", { name: "My care" })).toBeVisible();
  });

  test("signing out clears the session and returns to the guest header", async ({ page }) => {
    await signInAsPatient(page);
    await page.goto("/home");

    await signOut(page);
    await expectGuestSession(page);

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: "My care" })).toHaveCount(0);
    // Guest-only controls are back (scoped to the header — the footer also
    // has its own session-aware "Log in"/"My care" link).
    await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Log in" })).toBeVisible();
  });
});
