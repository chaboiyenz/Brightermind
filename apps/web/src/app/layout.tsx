import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui";
import { QueryProvider } from "@/components/QueryProvider";
import { AuthRoleProvider } from "@/components/AuthRoleProvider";
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
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {/*
          AuthRoleProvider wires RoleGate/RoleProvider to the real
          GET /api/v2/auth/me/ endpoint (Phase 3) — replacing the mocked
          role from Phase 0/2. Needs QueryProvider above it (it uses
          React Query).
        */}
        <QueryProvider>
          <AuthRoleProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthRoleProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
