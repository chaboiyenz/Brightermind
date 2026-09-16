import { expect, type Page } from "@playwright/test";

// Shared helpers for the demo-polish smoke suite. Mirrors the real UI paths
// (role cards, avatar menu) rather than poking localStorage directly, so
// these tests fail the same way a demo viewer's click would.

export async function signInAsPatient(page: Page): Promise<void> {
  await page.goto("/login");
  await page.getByRole("button", { name: "Continue as a patient" }).click();
  await page.waitForURL("/home");
}

export async function signInAsPsychologist(page: Page): Promise<void> {
  await page.goto("/login");
  await page.getByRole("button", { name: "Continue as a psychologist" }).click();
  await page.waitForURL("/psych");
}

export async function signOut(page: Page): Promise<void> {
  // AvatarMenu's trigger has no text label of its own beyond the display
  // name, but it's the one button in the header with aria-haspopup="menu".
  // SiteHeader renders both a desktop and a mobile copy (CSS-hidden, not
  // DOM-removed, at this viewport) — `:visible` picks the one actually on
  // screen instead of hitting a strict-mode "2 elements" error.
  await page.locator('button[aria-haspopup="menu"]:visible').click();
  await page.getByRole("menuitem", { name: "Log out" }).click();
  await page.waitForURL("/");
}

export async function expectSignedInSession(page: Page): Promise<void> {
  const signedIn = await page.evaluate(() => window.localStorage.getItem("bm_session_signed_in"));
  expect(signedIn).toBe("true");
}

export async function expectGuestSession(page: Page): Promise<void> {
  const signedIn = await page.evaluate(() => window.localStorage.getItem("bm_session_signed_in"));
  expect(signedIn).not.toBe("true");
}
