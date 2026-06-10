"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

export function SaveForLater() {
  const { items, toggleSaveForLater, addItem } = useCart();
  const savedItems = items.filter((i) => i.savedForLater);

  if (savedItems.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="font-semibold text-lg mb-4">Saved for Later ({savedItems.length})</h3>
      <div className="space-y-3">
        {savedItems.map((item) => (
          <div key={item.productId} className="flex items-center justify-between border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                <img
                  src={item.product.images?.[0]?.url || item.product.images?.[0] || "/placeholder.png"}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">
                  ₦{(item.product.discountPrice || item.product.price).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => {
                addItem(item.product);
                toggleSaveForLater(item.productId);
              }}>
                Move to Cart
              </Button>
              <Button size="sm" variant="ghost" onClick={() => toggleSaveForLater(item.productId)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
