import { expect, test } from "@playwright/test";
import { signInAsPatient, signInAsPsychologist } from "./helpers";

// (b) Route-gating matrix — mirrors lib/session/access.ts's own rule tables
// and its unit tests (access.test.ts), but exercised end-to-end through
// real navigation/redirects instead of calling the pure functions directly.
test.describe("route gating", () => {
  test("guests are redirected to login with a return path", async ({ page }) => {
    await page.goto("/mood");
    await expect(page).toHaveURL("/login?next=%2Fmood");
  });

  test("guests keep the coping/games trial and the read-only community feed", async ({ page }) => {
    await page.goto("/coping/defusion");
    await expect(page).toHaveURL("/coping/defusion");

    await page.goto("/community");
    await expect(page).toHaveURL("/community");
    await expect(page.getByText("Reading as a guest")).toBeVisible();
  });

  test("signed-in patients reach their personal pages", async ({ page }) => {
    await signInAsPatient(page);
    for (const path of ["/mood", "/journal", "/tools/todo", "/profile", "/care"]) {
      await page.goto(path);
      await expect(page).toHaveURL(path);
    }
  });

  test("signed-in patients are forbidden from the psychologist workspace", async ({ page }) => {
    await signInAsPatient(page);
    await page.goto("/psych");
    await expect(page).toHaveURL("/psych");
    await expect(page.getByText(/this page is for/i)).toBeVisible();
  });

  test("signed-in psychologists are forbidden from patient-only pages", async ({ page }) => {
    await signInAsPsychologist(page);
    await page.goto("/mood");
    await expect(page).toHaveURL("/mood");
    await expect(page.getByText(/this page is for/i)).toBeVisible();
  });

  test("signed-in psychologists reach the workspace, including legacy URLs", async ({ page }) => {
    await signInAsPsychologist(page);
    await page.goto("/psych/inbox");
    await expect(page).toHaveURL("/psych/inbox");

    // LEGACY_REDIRECTS fires regardless of session.
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/psych/inbox");
    await page.goto("/admin/patients");
    await expect(page).toHaveURL("/psych/patients");
  });

  test("signed-in users land on their own home instead of the marketing page", async ({ page }) => {
    await signInAsPatient(page);
    await page.goto("/");
    await expect(page).toHaveURL("/home");
  });
});
