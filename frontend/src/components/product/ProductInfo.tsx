"use client";

import { Star, Shield, Truck, RefreshCw } from "lucide-react";
import { formatPrice, getRatingLabel, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const availableStock = product.stockQuantity ?? product.stock ?? 0;
  const rating = product.averageRating ?? product.rating ?? 0;
  const reviewCount = product.reviewCount ?? product._count?.reviews ?? 0;
  const hasDiscount = Number(product.discountPrice || 0) > 0 && Number(product.discountPrice) < Number(product.price);
  const discount = hasDiscount ? calculateDiscount(product.price, product.discountPrice) : 0;

  return (
    <div className="space-y-6">
      {product.brand && (
        <p className="text-sm text-muted-foreground uppercase tracking-wider">{product.brand.name}</p>
      )}

      <h1 className="text-2xl lg:text-3xl font-bold">{product.name}</h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Math.round(rating) ? "fill-foreground text-foreground" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {reviewCount > 0 ? `${rating.toFixed(1)} - ${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}` : "No reviews yet"}
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        {hasDiscount ? (
          <>
            <span className="text-3xl font-bold text-primary">{formatPrice(product.discountPrice)}</span>
            <span className="text-xl text-muted-foreground line-through">{formatPrice(product.price)}</span>
            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
              {discount}% OFF
            </span>
          </>
        ) : (
          <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
        )}
      </div>

      <p className="text-muted-foreground leading-relaxed">{product.description}</p>

      {availableStock > 0 ? (
        <p className="text-sm text-green-600 font-medium flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-600" /> In Stock ({availableStock} available)
        </p>
      ) : (
        <p className="text-sm text-red-600 font-medium flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-600" /> Out of Stock
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Free Shipping</p>
            <p className="text-xs text-muted-foreground">On orders over ₦50,000</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RefreshCw className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Easy Returns</p>
            <p className="text-xs text-muted-foreground">30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
