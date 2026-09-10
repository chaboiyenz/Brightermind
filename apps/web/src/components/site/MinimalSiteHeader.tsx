import { Wordmark } from "./Wordmark";

// Auth flow chrome (/login, /signup, /signup/psychologist) — logo only, no
// nav links and no "Login" CTA (redundant while already on the login/signup
// flow), so the flow stays focused rather than inviting a detour through the
// main nav mid-signup. Decided explicitly with the user rather than assumed
// (see the sticky-nav/back-button PR description) — SiteChrome picks this
// over the full SiteHeader specifically for auth routes.
export function MinimalSiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-25/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
        <Wordmark />
      </div>
    </header>
  );
}
