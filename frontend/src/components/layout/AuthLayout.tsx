"use client";

import Link from "next/link";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Link href="/" className="text-3xl font-bold font-display mb-8">
        <span className="text-primary">TOLU</span>MAK
      </Link>
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border p-8">{children}</div>
    </div>
  );
}
