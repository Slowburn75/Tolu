"use client";

import { RefreshCw, Shield, Star, Truck } from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const availableStock = product.stockQuantity ?? product.stock ?? 0;
  const rating = product.averageRating ?? product.rating ?? 0;
  const reviewCount = product.reviewCount ?? product._count?.reviews ?? 0;
  const discountPrice = Number(product.discountPrice || 0);
  const hasDiscount = discountPrice > 0 && discountPrice < Number(product.price);
  const discount = hasDiscount ? calculateDiscount(product.price, discountPrice) : 0;

  return (
    <div className="space-y-6">
      {product.brand && <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{product.brand.name}</p>}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold leading-tight tracking-normal lg:text-5xl">{product.name}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={"h-4 w-4 " + (i < Math.round(rating) ? "fill-foreground text-foreground" : "text-muted-foreground")} />)}</div>
          <span className="text-sm text-muted-foreground">{reviewCount > 0 ? rating.toFixed(1) + " - " + reviewCount + (reviewCount === 1 ? " review" : " reviews") : "No reviews yet"}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-baseline gap-3">
        {hasDiscount ? <><span className="text-3xl font-semibold">{formatPrice(discountPrice)}</span><span className="text-xl text-muted-foreground line-through">{formatPrice(product.price)}</span><span className="rounded-full bg-[#174c3c] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">{discount}% off</span></> : <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>}
      </div>
      <p className="max-w-2xl leading-7 text-muted-foreground">{product.description}</p>
      <p className={"inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium " + (availableStock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}><span className="h-2 w-2 rounded-full bg-current" />{availableStock > 0 ? "In Stock (" + availableStock + " available)" : "Out of Stock"}</p>
      <div className="grid gap-3 pt-2 sm:grid-cols-3">
        <div className="border border-border p-4"><Shield className="mb-3 h-5 w-5" /><p className="text-sm font-medium">Secure checkout</p><p className="mt-1 text-xs text-muted-foreground">Protected payment flow</p></div>
        <div className="border border-border p-4"><Truck className="mb-3 h-5 w-5" /><p className="text-sm font-medium">Delivery estimate</p><p className="mt-1 text-xs text-muted-foreground">Shown at checkout</p></div>
        <div className="border border-border p-4"><RefreshCw className="mb-3 h-5 w-5" /><p className="text-sm font-medium">Easy returns</p><p className="mt-1 text-xs text-muted-foreground">30-day policy</p></div>
      </div>
    </div>
  );
}
