"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useWishlist } from "@/hooks/useWishlist";

export default function DashboardWishlistPage() {
  const { items } = useWishlist();

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">My Wishlist ({items.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Your wishlist is empty</p>
            </div>
          ) : (
            <ProductGrid products={items} columns={3} />
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
