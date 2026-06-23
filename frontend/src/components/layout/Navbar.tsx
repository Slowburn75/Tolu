"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Men", href: "/shop?gender=male", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=500&q=80", links: ["T-Shirts", "Shorts", "Sneakers", "Bags"] },
  { label: "Women", href: "/shop?gender=female", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=500&q=80", links: ["Dresses", "Tops", "Yoga", "Accessories"] },
  { label: "Kids", href: "/shop?ageGroup=kids", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=500&q=80", links: ["New In", "School", "Playwear", "Shoes"] },
  { label: "Shoes", href: "/shop?category=shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80", links: ["Running", "Lifestyle", "Canvas", "Slides"] },
  { label: "Bags", href: "/shop?category=bags", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=500&q=80", links: ["Totes", "Crossbody", "Travel", "Work"] },
  { label: "New Arrivals", href: "/shop?isNewArrival=true", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=80", links: ["This Week", "Trending", "Premium Edit", "Gifts"] },
  { label: "Sale", href: "/shop?sale=true", image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=500&q=80", links: ["Last Chance", "20% Off", "Best Deals", "Clearance"] },
];

const bg = (image: string) => ({ backgroundImage: "url(" + image + ")" });

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const cartCount = getItemCount();
  const overHero = pathname === "/" && !isScrolled && !isSearchOpen;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const submitSearch = () => {
    const query = searchQuery.trim();
    if (query) window.location.href = "/shop?search=" + encodeURIComponent(query);
  };

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", overHero ? "border-transparent bg-transparent text-white" : "border-b border-border/70 bg-background/92 text-foreground shadow-sm backdrop-blur-xl")}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <button className={cn("-ml-2 rounded-full p-2 transition-colors lg:hidden", overHero ? "hover:bg-white/10" : "hover:bg-accent")} onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu"><Menu className="h-6 w-6" /></button>
            <Link href="/" className="font-display text-2xl font-semibold tracking-normal lg:text-3xl" aria-label="Tolumak home">TOLUMAK</Link>
            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <div key={item.label} className="group/item py-7">
                  <Link href={item.href} className={cn("rounded-full px-3 py-2 text-sm font-medium transition-colors", overHero ? "text-white/86 hover:bg-white/10 hover:text-white" : "text-foreground/78 hover:bg-accent hover:text-foreground")}>{item.label}</Link>
                  <div className="pointer-events-none absolute left-1/2 top-full w-[min(980px,calc(100vw-3rem))] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover/item:pointer-events-auto group-hover/item:translate-y-0 group-hover/item:opacity-100">
                    <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-6 border border-border bg-background p-5 text-foreground shadow-2xl">
                      <Link href={item.href} className="group relative min-h-[250px] overflow-hidden bg-muted">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={bg(item.image)} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 p-5 text-white"><p className="text-xs uppercase tracking-[0.24em] text-white/70">Featured</p><h3 className="mt-2 text-2xl font-semibold">Shop {item.label}</h3></div>
                      </Link>
                      <div className="space-y-3 py-2"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Categories</p>{item.links.map((link) => <Link key={link} href={item.href} className="block text-sm font-medium hover:text-muted-foreground">{link}</Link>)}</div>
                      <div className="space-y-3 py-2"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Quick links</p><Link href="/shop?isNewArrival=true" className="block text-sm font-medium hover:text-muted-foreground">New arrivals</Link><Link href="/shop?isBestSeller=true" className="block text-sm font-medium hover:text-muted-foreground">Best sellers</Link><Link href="/shop?sale=true" className="block text-sm font-medium hover:text-muted-foreground">Sale edit</Link></div>
                    </div>
                  </div>
                </div>
              ))}
            </nav>
            <div className="flex items-center gap-1 sm:gap-2">
              <button className={cn("rounded-full p-2 transition-colors", overHero ? "hover:bg-white/10" : "hover:bg-accent")} onClick={() => setIsSearchOpen((value) => !value)} aria-label="Search"><Search className="h-5 w-5" /></button>
              <Link href="/wishlist" className={cn("relative hidden rounded-full p-2 transition-colors sm:block", overHero ? "hover:bg-white/10" : "hover:bg-accent")} aria-label="Wishlist"><Heart className="h-5 w-5" />{wishlistItems.length > 0 && <Badge variant="destructive" className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs">{wishlistItems.length}</Badge>}</Link>
              <CartButton count={cartCount} overHero={overHero} />
              {isAuthenticated ? (
                <DropdownMenu><DropdownMenuTrigger asChild><button className={cn("rounded-full p-1 transition-colors", overHero ? "hover:bg-white/10" : "hover:bg-accent")}><Avatar className="h-8 w-8"><AvatarImage src={user?.avatar} /><AvatarFallback className="bg-primary text-xs text-primary-foreground">{user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}</AvatarFallback></Avatar></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56"><DropdownMenuLabel><p className="font-medium">{user?.name}</p><p className="text-xs text-muted-foreground">{user?.email}</p></DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem><DropdownMenuItem asChild><Link href="/dashboard/orders">My Orders</Link></DropdownMenuItem><DropdownMenuItem asChild><Link href="/dashboard/wishlist">Wishlist</Link></DropdownMenuItem><DropdownMenuItem asChild><Link href="/dashboard/profile">Profile</Link></DropdownMenuItem>{user?.role === "ADMIN" && <><DropdownMenuSeparator /><DropdownMenuItem asChild><Link href="/admin">Admin Dashboard</Link></DropdownMenuItem></>}<DropdownMenuSeparator /><DropdownMenuItem onClick={logout} className="text-destructive">Logout</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
              ) : (
                <Link href="/login"><Button variant="ghost" size="icon" className={cn("rounded-full", overHero ? "text-white hover:bg-white/10 hover:text-white" : "")}><User className="h-5 w-5" /></Button></Link>
              )}
            </div>
          </div>
        </div>
        {isSearchOpen && <div className="border-t border-border bg-background text-foreground shadow-xl"><div className="mx-auto max-w-3xl px-4 py-4"><div className="relative"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitSearch()} placeholder="Search dresses, sneakers, bags..." className="h-12 rounded-full border-border pl-12 pr-14 text-base" autoFocus /><Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full" onClick={() => setIsSearchOpen(false)}><X className="h-5 w-5" /></Button></div></div></div>}
      </header>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />
    </>
  );
}

function CartButton({ count, overHero }: { count: number; overHero: boolean }) {
  const { toggleCart } = useCart();
  return <button onClick={toggleCart} className={cn("relative rounded-full p-2 transition-colors", overHero ? "hover:bg-white/10" : "hover:bg-accent")} aria-label="Open cart"><ShoppingBag className="h-5 w-5" />{count > 0 && <Badge variant="default" className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs">{count}</Badge>}</button>;
}
