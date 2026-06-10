"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  onPlaceOrder: () => void;
  isLoading?: boolean;
}

export function OrderSummary({ items, subtotal, shipping, discount, total, onPlaceOrder, isLoading }: OrderSummaryProps) {
  return (
    <div className="border rounded-lg p-6 space-y-4 sticky top-24">
      <h3 className="font-semibold text-lg">Order Summary</h3>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-14 h-14 bg-muted rounded-md overflow-hidden shrink-0">
              <Image
                src={item.product.images?.[0]?.url || item.product.images?.[0] || "/placeholder.png"}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              <p className="text-sm font-medium">
                {formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <Button className="w-full h-12" size="lg" onClick={onPlaceOrder} disabled={isLoading}>
        {isLoading ? "Processing..." : "Place Order"}
      </Button>
    </div>
  );
}
