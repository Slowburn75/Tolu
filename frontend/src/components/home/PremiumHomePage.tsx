"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { productsApi } from "@/lib/api";
import type { Product } from "@/types";

const bg = (image: string) => ({ backgroundImage: "url(" + image + ")" });

const heroSlides = [
  {
    eyebrow: "New season edit",
    title: "Style that moves like confidence.",
    copy: "Premium fashion, shoes, bags, and everyday essentials curated for a sharper wardrobe.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=85",
    links: [
      { label: "Shop Women", href: "/shop?gender=female" },
      { label: "Shop Men", href: "/shop?gender=male" },
      { label: "Shop Kids", href: "/shop?ageGroup=kids" },
    ],
  },
  {
    eyebrow: "Premium essentials",
    title: "Quiet luxury for real life.",
    copy: "Clean silhouettes, elevated materials, and pieces that look expensive without trying too hard.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=2200&q=85",
    links: [
      { label: "New Arrivals", href: "/shop?isNewArrival=true" },
      { label: "Best Sellers", href: "/shop?isBestSeller=true" },
      { label: "Sale", href: "/shop?sale=true" },
    ],
  },
];

const categories = [
  { name: "Women", href: "/shop?gender=female", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=85", copy: "Dresses, sets, bags, and elevated daily wear." },
  { name: "Men", href: "/shop?gender=male", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=85", copy: "Sharp essentials, sportswear, and confident layers." },
  { name: "Kids", href: "/shop?ageGroup=kids", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=85", copy: "Comfortable style for everyday movement." },
  { name: "Shoes", href: "/shop?category=shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85", copy: "Sneakers, runners, and polished finishing pieces." },
  { name: "Bags", href: "/shop?category=bags", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85", copy: "Carry pieces with structure, texture, and presence." },
];

const promises = [
  { icon: ShieldCheck, title: "Verified quality", copy: "Every listing is checked for presentation and buyer confidence." },
  { icon: Truck, title: "Fast delivery", copy: "Clear delivery expectations before checkout." },
  { icon: CheckCircle2, title: "Easy returns", copy: "A cleaner return flow for safer shopping decisions." },
  { icon: Sparkles, title: "Premium curation", copy: "Fashion-first discovery across men, women, kids, shoes, and bags." },
];

export function PremiumHomePage() {
  const [active, setActive] = useState(0);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    productsApi.getNewArrivals(4).then((res: any) => setNewArrivals(Array.isArray(res) ? res : res?.data || [])).catch(() => setNewArrivals([]));
    productsApi.getBestSellers(4).then((res: any) => setBestSellers(Array.isArray(res) ? res : res?.data || [])).catch(() => setBestSellers([]));
  }, []);

  const slide = heroSlides[active];

  return (
    <main className="overflow-hidden bg-background">
      <section className="relative min-h-[92vh] bg-black text-white">
        {heroSlides.map((item, index) => (
          <div key={item.title} className={"absolute inset-0 transition-opacity duration-1000 " + (index === active ? "opacity-100" : "opacity-0")}>
            <div className="absolute inset-0 bg-cover bg-center" style={bg(item.image)} />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.34),rgba(0,0,0,.12))]" />
          </div>
        ))}
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-32 sm:px-6 lg:px-8 lg:pb-20">
          <div className="max-w-3xl animate-fade-in">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-white/75">{slide.eyebrow}</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-normal sm:text-6xl lg:text-8xl">{slide.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/78 sm:text-lg">{slide.copy}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              {slide.links.map((link, index) => (
                <Button key={link.href} asChild size="lg" variant={index === 0 ? "default" : "outline"} className={index === 0 ? "h-12 rounded-full px-7" : "h-12 rounded-full border-white/50 bg-white/10 px-7 text-white backdrop-blur hover:bg-white hover:text-black"}>
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-12 flex items-center gap-3">
            {heroSlides.map((item, index) => (
              <button key={item.title} aria-label={"Show slide " + (index + 1)} onClick={() => setActive(index)} className={"h-1.5 rounded-full transition-all " + (index === active ? "w-14 bg-white" : "w-7 bg-white/35 hover:bg-white/70")} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Shop the edit</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">Editorial categories</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] hover:text-muted-foreground">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 md:grid-cols-6 lg:gap-5">
            {categories.map((cat, index) => (
              <Link key={cat.name} href={cat.href} className={"group relative min-h-[360px] overflow-hidden rounded-sm bg-muted " + (index < 2 ? "md:col-span-3" : "md:col-span-2")}>
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={bg(cat.image)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/70">Tolumak</p>
                  <h3 className="mt-2 text-3xl font-semibold">{cat.name}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-white/75">{cat.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ProductStrip title="New arrivals" eyebrow="Fresh now" href="/shop?isNewArrival=true" products={newArrivals} />

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <Link href="/shop?isBestSeller=true" className="group relative min-h-[620px] overflow-hidden rounded-sm bg-black text-white">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={bg("https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1500&q=85")} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-0 max-w-xl p-7 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">Trending collection</p>
              <h2 className="mt-4 text-4xl font-semibold sm:text-6xl">Built for the daily spotlight.</h2>
              <p className="mt-4 text-white/75">Discover the pieces customers keep coming back for: easy silhouettes, bold sneakers, polished bags, and refined basics.</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]">Explore best sellers <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {[
              { title: "Weekend bags", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85", href: "/shop?category=bags" },
              { title: "Performance sneakers", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85", href: "/shop?category=shoes" },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="group relative min-h-[300px] overflow-hidden rounded-sm bg-muted">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={bg(item.image)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/75">Shop now</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ProductStrip title="Best sellers" eyebrow="Customer favorites" href="/shop?isBestSeller=true" products={bestSellers} muted />

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl border-y border-border py-10">
          <div className="grid gap-8 md:grid-cols-4">
            {promises.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="space-y-3">
                  <Icon className="h-6 w-6" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#111] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">Social proof</p>
            <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">Real wardrobes. Real confidence.</h2>
            <div className="mt-8 grid gap-4">
              {["The shopping flow feels clean and trustworthy.", "Quality pieces that photograph beautifully.", "Fast delivery and the packaging felt premium."].map((quote) => (
                <div key={quote} className="border border-white/10 p-5">
                  <div className="mb-3 flex gap-1 text-[#d7b56d]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                  <p className="text-sm leading-6 text-white/78">{quote}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=85", "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=85", "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?auto=format&fit=crop&w=700&q=85"].map((image, index) => (
              <div key={image} className={(index === 0 || index === 3 ? "col-span-4" : "col-span-2") + " min-h-[180px] bg-cover bg-center"} style={bg(image)} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductStrip({ title, eyebrow, href, products, muted = false }: { title: string; eyebrow: string; href: string; products: Product[]; muted?: boolean }) {
  return (
    <section className={(muted ? "bg-muted/40" : "bg-background") + " px-4 py-16 sm:px-6 lg:px-8 lg:py-24"}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">{title}</h2>
          </div>
          <Button asChild variant="ghost" className="w-fit rounded-full"><Link href={href}>View all <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
          {!products.length && Array.from({ length: 4 }).map((_, index) => <div key={index} className="aspect-[3/4] animate-pulse rounded-sm bg-muted" />)}
        </div>
      </div>
    </section>
  );
}
