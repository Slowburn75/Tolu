"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice, calculateDiscount, cn } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

function SafeImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || src.includes("placehold.co") || failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <svg width="60" height="60" viewBox="0 0 800 800" fill="none" className="opacity-20 text-muted-foreground">
          <rect x="300" y="300" width="200" height="200" rx="8" fill="currentColor"/>
          <path d="M350 450L400 380L450 450H350Z" fill="currentColor"/>
          <circle cx="370" cy="350" r="20" fill="currentColor"/>
        </svg>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      onError={() => setFailed(true)}
    />
  );
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const discount = product.discountPrice ? calculateDiscount(product.price, product.discountPrice) : 0;
  const imgUrl = product.images?.[0]?.url || (typeof product.images?.[0] === "string" ? product.images[0] : "");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success("Added to cart");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-3">
        <SafeImage src={imgUrl} alt={product.name} />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && <Badge variant="destructive">{discount}% OFF</Badge>}
          {product.isNewArrival && <Badge variant="default">New</Badge>}
          {product.isBestSeller && <Badge variant="secondary">Best Seller</Badge>}
        </div>
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <Heart className={cn("h-4 w-4", inWishlist ? "fill-primary text-primary" : "text-muted-foreground")} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" className="w-full gap-2" onClick={handleAddToCart}>
            <ShoppingBag className="h-4 w-4" /> Quick Add
          </Button>
        </div>
      </div>
      <div className="space-y-1">
        {product.brand && (
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand.name}</p>
        )}
        <h3 className={cn("font-medium line-clamp-2", variant === "compact" ? "text-sm" : "text-base")}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("h-3 w-3", i < Math.round(product.averageRating || product.rating || 0) ? "fill-foreground text-foreground" : "text-muted-foreground")} />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviewCount || product._count?.reviews || 0})</span>
        </div>
        <div className="flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="font-semibold text-primary">{formatPrice(product.discountPrice)}</span>
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-semibold">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
