"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/hooks/useAuth";

const bg = (image: string) => ({ backgroundImage: "url(" + image + ")" });
const mobileCategories = [
  { label: "Women", href: "/shop?gender=female", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=500&q=80" },
  { label: "Men", href: "/shop?gender=male", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=500&q=80" },
  { label: "Kids", href: "/shop?ageGroup=kids", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=500&q=80" },
  { label: "Shoes", href: "/shop?category=shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80" },
  { label: "Bags", href: "/shop?category=bags", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=500&q=80" },
  { label: "Sale", href: "/shop?sale=true", image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=500&q=80" },
];

export function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  if (!isOpen) return null;
  const submitSearch = () => {
    const query = searchQuery.trim();
    if (query) {
      window.location.href = "/shop?search=" + encodeURIComponent(query);
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-background">
        <div className="flex h-16 items-center justify-between border-b px-4"><Link href="/" onClick={onClose} className="font-display text-2xl font-semibold">TOLUMAK</Link><button onClick={onClose} className="rounded-full p-2 hover:bg-accent" aria-label="Close menu"><X className="h-6 w-6" /></button></div>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto px-4 pb-32 pt-5">
          <div className="relative mb-5"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitSearch()} placeholder="Search Tolumak" className="h-12 rounded-full pl-11" /></div>
          <div className="grid grid-cols-2 gap-3">{mobileCategories.map((cat) => <Link key={cat.label} href={cat.href} onClick={onClose} className="group relative min-h-[170px] overflow-hidden rounded-sm bg-muted"><div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={bg(cat.image)} /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><span className="absolute bottom-4 left-4 text-lg font-semibold text-white">{cat.label}</span></Link>)}</div>
          <div className="mt-6 grid gap-2 border-t pt-6 text-sm font-medium uppercase tracking-[0.18em]"><Link href="/shop?isNewArrival=true" onClick={onClose} className="py-3">New arrivals</Link><Link href="/shop?isBestSeller=true" onClick={onClose} className="py-3">Best sellers</Link><Link href="/wishlist" onClick={onClose} className="py-3">Wishlist</Link></div>
        </div>
        <div className="absolute inset-x-0 bottom-0 border-t bg-background p-4">{isAuthenticated ? <div className="grid gap-2"><p className="text-sm font-medium">Signed in as {user?.name}</p><Button asChild variant="outline" className="w-full rounded-full"><Link href="/dashboard" onClick={onClose}>Dashboard</Link></Button><Button variant="ghost" className="w-full rounded-full text-destructive" onClick={() => { logout(); onClose(); }}>Logout</Button></div> : <div className="grid grid-cols-2 gap-2"><Button asChild variant="outline" className="rounded-full"><Link href="/login" onClick={onClose}>Login</Link></Button><Button asChild className="rounded-full"><Link href="/register" onClick={onClose}>Sign up</Link></Button></div>}</div>
      </div>
    </div>
  );
}
