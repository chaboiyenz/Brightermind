import { BrandMark } from "./BrandMark";

// Auth flow chrome (/login, /signup, /signup/psychologist) — logo only, no
// nav links and no "Login" CTA (redundant while already on the login/signup
// flow), so the flow stays focused rather than inviting a detour through the
// main nav mid-signup. Decided explicitly with the user rather than assumed
// (see the sticky-nav/back-button PR description) — SiteChrome picks this
// over the full SiteHeader specifically for auth routes. Same height and
// container as SiteHeader so the mark doesn't jump between the two.
export function MinimalSiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-frost/85 backdrop-blur-[12px]">
      <div className="mx-auto flex h-[68px] max-w-container items-center px-5 sm:px-10 lg:px-14">
        <BrandMark />
      </div>
    </header>
  );
}
