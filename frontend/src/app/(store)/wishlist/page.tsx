"use client";

import Link from "next/link";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl font-bold mb-8">My Wishlist ({items.length} items)</h1>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Save your favorite items here.</p>
            <Link href="/shop">
              <Button className="gap-2"><ArrowLeft className="h-4 w-4" /> Browse Products</Button>
            </Link>
          </div>
        ) : (
          <ProductGrid products={items} />
        )}
      </div>
    </StoreLayout>
  );
}
