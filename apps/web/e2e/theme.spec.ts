import { expect, test, type Page } from "@playwright/test";
import { signInAsPsychologist } from "./helpers";

// (d) Light/dark screenshot comparison — scoped to exactly the surfaces the
// retheme audit found a miss on (Modal, Toast-adjacent chart), plus the home
// page as a general baseline, rather than a full-app snapshot matrix.
// docs/project-overview.md §3/§5.

async function setTheme(page: Page, theme: "light" | "dark"): Promise<void> {
  await page.addInitScript((value) => {
    window.localStorage.setItem("bm-theme", value);
  }, theme);
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} theme`, () => {
    test(`home page renders correctly`, async ({ page }) => {
      await setTheme(page, theme);
      await page.goto("/");
      await expect(page).toHaveScreenshot(`home-${theme}.png`, { fullPage: true });
    });

    test(`Modal (RoutineTimerModal) matches the theme, not a raw default shadow`, async ({
      page,
    }) => {
      await setTheme(page, theme);
      await page.goto("/coping/exercise");
      await page.getByRole("button", { name: "Start" }).first().click();
      const modal = page.getByRole("dialog");
      await expect(modal).toBeVisible();
      await expect(modal).toHaveScreenshot(`modal-${theme}.png`);
    });

    test(`psych analytics severity chart re-themes instead of staying frozen light`, async ({
      page,
    }) => {
      await setTheme(page, theme);
      await signInAsPsychologist(page);
      await page.goto("/psych/analytics");
      const chart = page.locator("figure").first();
      await expect(chart).toBeVisible();
      await expect(chart).toHaveScreenshot(`analytics-chart-${theme}.png`);
    });

    test(`Toast matches the theme, not a raw default shadow`, async ({ page }) => {
      await setTheme(page, theme);
      await page.goto("/community");
      // A guest's vote tap is the simplest reliable toast trigger already
      // in the app — see VoteButton.tsx. The visible toast is Radix
      // Toast.Root's own <li data-state="open">; role="status" belongs to
      // a separate, visually-hidden screen-reader announcer element Radix
      // renders alongside it, which never gets dimensions to screenshot.
      await page.getByRole("button", { name: /^Support/ }).first().click();
      const toast = page.locator('li[data-state="open"]').filter({ hasText: "Log in to show support" });
      await expect(toast).toBeVisible();
      await expect(toast).toHaveScreenshot(`toast-${theme}.png`);
    });
  });
}
