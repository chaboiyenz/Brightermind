import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

// Every coping page (library hub, exercise, yoga, aromatherapy, spirituality,
// mini-games) gets the site chrome so a student who arrives from the landing
// page is never stranded on a page with no way back.
export default function CopingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
