import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ToastProvider } from "@/components/ui";
import { QueryProvider } from "@/components/QueryProvider";
import { AuthRoleProvider } from "@/components/AuthRoleProvider";
import { MockRoleProvider } from "@/components/MockRoleProvider";
import { THEME_INIT_SCRIPT } from "@/components/site/themeStorage";
import { isMockMode } from "@/lib/mock/mockMode";
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
  // Prototype pivot (.references/roadmap/prototype-roadmap.MD): under
  // NEXT_PUBLIC_MOCK_MODE, RoleGate is fed by a static role switcher instead
  // of the real /auth/me/ check — no login, no token, no backend call.
  const RoleProviderForMode = isMockMode() ? MockRoleProvider : AuthRoleProvider;

  return (
    // suppressHydrationWarning: the theme script below may stamp data-theme
    // before React hydrates, which is expected and must not be "repaired".
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        {/* Applies the stored theme choice before first paint so a dark-mode
            user never sees a linen flash. See components/site/themeStorage.ts. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/*
          AuthRoleProvider wires RoleGate/RoleProvider to the real
          GET /api/v2/auth/me/ endpoint (Phase 3) — replacing the mocked
          role from Phase 0/2. Needs QueryProvider above it (it uses
          React Query). Swapped for MockRoleProvider in mock mode — see above.
        */}
        <QueryProvider>
          <RoleProviderForMode>
            <ToastProvider>{children}</ToastProvider>
          </RoleProviderForMode>
        </QueryProvider>
      </body>
    </html>
  );
}
