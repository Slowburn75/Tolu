"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package } from "lucide-react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <StoreLayout>
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your purchase. You will receive an email confirmation shortly.
        </p>
        {orderId && (
          <p className="text-sm mb-8">
            Order ID: <span className="font-medium">{orderId}</span>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/orders">
            <Button className="gap-2"><Package className="h-4 w-4" /> View Orders</Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </StoreLayout>
  );
}
