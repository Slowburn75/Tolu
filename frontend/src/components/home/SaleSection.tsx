"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SaleSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary/80">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1920')] bg-cover bg-center opacity-20" />
          <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-8">
            <p className="text-sm uppercase tracking-widest mb-4 font-medium">Limited Time Offer</p>
            <h2 className="text-4xl md:text-6xl font-bold font-display mb-4">Sale Up to 50% Off</h2>
            <p className="text-lg text-white/80 mb-8 max-w-lg">
              Don&apos;t miss out on amazing deals on selected items. Shop now before they&apos;re gone!
            </p>
            <Link href="/shop?sale=true">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-base">
                Shop the Sale
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
