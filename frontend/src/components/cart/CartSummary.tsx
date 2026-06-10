"use client";

import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
  discount?: number;
  total?: number;
}

export function CartSummary({ subtotal, shipping = 0, discount = 0, total }: CartSummaryProps) {
  const finalTotal = total ?? subtotal + shipping - discount;
  const freeShippingThreshold = 50000;
  const remainingForFree = freeShippingThreshold - subtotal;

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h3 className="font-semibold text-lg">Order Summary</h3>

      {subtotal < freeShippingThreshold && (
        <div className="bg-muted rounded-md p-3 text-sm">
          <p>Add <span className="font-medium text-primary">{formatPrice(remainingForFree)}</span> more for free shipping</p>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>{formatPrice(finalTotal)}</span>
      </div>
    </div>
  );
}
