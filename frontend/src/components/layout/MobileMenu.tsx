"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuthStore } from "@/hooks/useAuth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-background shadow-xl animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" className="text-2xl font-bold" onClick={onClose}>
            <span className="text-primary">TOLU</span>MAK
          </Link>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                  onClose();
                }
              }}
            />
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
          {isAuthenticated ? (
            <div className="space-y-2">
              <p className="text-sm font-medium px-2">{user?.name}</p>
              <Link href="/dashboard" onClick={onClose}>
                <Button variant="outline" className="w-full justify-start">Dashboard</Button>
              </Link>
              <Link href="/dashboard/orders" onClick={onClose}>
                <Button variant="outline" className="w-full justify-start">My Orders</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start text-destructive" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link href="/login" onClick={onClose}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link href="/register" onClick={onClose}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
