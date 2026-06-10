"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { useAuthStore } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { isAuthenticated } = useAuthStore();
  const { items } = useCart();
  const router = useRouter();
  const activeItems = items.filter((i) => !i.savedForLater);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <StoreLayout>
        <div className="max-w-md mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Login Required</h1>
          <p className="text-muted-foreground mb-8">Please login to continue with checkout.</p>
          <Link href="/login?redirect=/checkout">
            <Button>Login</Button>
          </Link>
        </div>
      </StoreLayout>
    );
  }

  if (activeItems.length === 0) {
    return (
      <StoreLayout>
        <div className="max-w-md mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/shop">
            <Button>Shop Now</Button>
          </Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <CheckoutForm />
      </div>
    </StoreLayout>
  );
}
