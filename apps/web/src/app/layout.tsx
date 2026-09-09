import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui";
import { QueryProvider } from "@/components/QueryProvider";
import { AuthRoleProvider } from "@/components/AuthRoleProvider";
import { MockRoleProvider } from "@/components/MockRoleProvider";
import { isMockMode } from "@/lib/mock/mockMode";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BrighterMind",
  description: "Mental health support platform",
  icons: {
    icon: "/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Prototype pivot (.references/roadmap/prototype-roadmap.MD): under
  // NEXT_PUBLIC_MOCK_MODE, RoleGate is fed by a static role switcher instead
  // of the real /auth/me/ check — no login, no token, no backend call.
  const RoleProviderForMode = isMockMode() ? MockRoleProvider : AuthRoleProvider;

  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
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
