import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ToastProvider } from "@/components/ui";
import { QueryProvider } from "@/components/QueryProvider";
import { SessionProvider } from "@/components/SessionProvider";
import { THEME_INIT_SCRIPT } from "@/components/site/themeStorage";
import { SiteChrome } from "@/components/site/SiteChrome";
import "./globals.css";

// docs/DESIGN.md typography: Plus Jakarta Sans for display/labels, Inter for body.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "BrighterMind",
  description:
    "Mental health support for students: screening, mood tracking, coping techniques, and registered psychologists.",
  // No explicit `icons` override — apps/web/src/app/icon.png is picked up
  // automatically by Next.js's file-convention metadata (an explicit
  // `icons` entry here takes precedence over that and was pointing at
  // public/logo/logo.png, a file that no longer exists — hence the 404).
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the theme script below may stamp data-theme
    // before React hydrates, which is expected and must not be "repaired".
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        {/* Applies the stored theme choice before first paint so a dark-mode
            user never sees a linen flash. See components/site/themeStorage.ts. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/*
          SessionProvider (docs/role-based-system-plan.md §4) owns "who is
          signed in": the prototype role picked on /login, or the real
          GET /api/v2/auth/me/ user when no prototype session exists. It feeds
          RoleProvider so RoleGate keeps working. Needs QueryProvider above it.
        */}
        <QueryProvider>
          <SessionProvider>
            <ToastProvider>
              <SiteChrome>{children}</SiteChrome>
            </ToastProvider>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
