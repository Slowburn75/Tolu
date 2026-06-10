"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { productsApi } from "@/lib/api";
import { useEffect, useState } from "react";
import type { Product } from "@/types";

export function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getBestSellers(8).then((res: any) => {
      setProducts(Array.isArray(res) ? res : res?.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold font-display mb-2">Best Sellers</h2>
            <p className="text-muted-foreground">Our most popular products</p>
          </div>
          <Link href="/shop?isBestSeller=true">
            <Button variant="ghost" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <ProductGrid products={products} isLoading={loading} />
      </div>
    </section>
  );
}
