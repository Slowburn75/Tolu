"use client";

import Link from "next/link";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { CouponInput } from "@/components/cart/CouponInput";
import { SaveForLater } from "@/components/cart/SaveForLater";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const { items, getItemCount, getSubtotal } = useCart();
  const activeItems = items.filter((i) => !i.savedForLater);

  if (activeItems.length === 0) {
    return (
      <StoreLayout>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/shop">
            <Button className="gap-2"><ArrowLeft className="h-4 w-4" /> Continue Shopping</Button>
          </Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({getItemCount()} items)</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-1">
              {activeItems.map((item) => (
                <CartItem key={item.id} item={item as any} />
              ))}
            </div>
            <SaveForLater />
          </div>
          <div className="space-y-4">
            <CartSummary subtotal={getSubtotal()} />
            <CouponInput />
            <Link href="/checkout">
              <Button className="w-full h-12">Proceed to Checkout</Button>
            </Link>
            <Link href="/shop">
              <Button variant="link" className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
