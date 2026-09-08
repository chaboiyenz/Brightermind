import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui";
import { QueryProvider } from "@/components/QueryProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BrighterMind",
  description: "Mental health support platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {/*
          RoleProvider from components/ui goes here, wrapping ToastProvider
          (or nested inside it), once it's fed by real auth/session data.
          It's blocked on Ticket 2 (see the TODO in RoleGate.tsx) — that
          provider currently has no backend role model to call, so it isn't
          wired in yet. Do not wrap children in RoleProvider with a
          hardcoded role in the meantime.
        */}
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
