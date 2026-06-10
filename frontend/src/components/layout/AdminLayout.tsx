"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("tolumak-auth") : null;
    const token = stored ? (JSON.parse(stored) as { state?: { token?: string } }).state?.token : null;
    if (!token) {
      router.push("/login?redirect=/admin");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 mt-16 ml-0 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
