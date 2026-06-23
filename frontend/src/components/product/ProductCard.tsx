"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
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
  if (!src || failed) {
    return <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,hsl(var(--muted)),hsl(var(--secondary)))] text-xs uppercase tracking-[0.18em] text-muted-foreground">No image</div>;
  }
  return <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" onError={() => setFailed(true)} />;
}

function SafeVideo({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <SafeImage src="" alt={title} />;
  return <video src={src} title={title} className="absolute inset-0 h-full w-full object-cover" muted playsInline preload="metadata" onError={() => setFailed(true)} />;
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const discountPrice = Number(product.discountPrice || 0);
  const hasDiscount = discountPrice > 0 && discountPrice < Number(product.price);
  const discount = hasDiscount ? calculateDiscount(product.price, discountPrice) : 0;
  const imgUrl = product.images?.[0]?.url || (typeof product.images?.[0] === "string" ? product.images[0] : "");
  const availableStock = product.stockQuantity ?? product.stock ?? 0;
  const reviewCount = product.reviewCount ?? product._count?.reviews ?? 0;
  const rating = product.averageRating ?? product.rating ?? 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (availableStock <= 0) {
      toast.error("This product is out of stock");
      return;
    }
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
    <Link href={"/products/" + product.slug} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-sm bg-muted shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        {imgUrl ? <SafeImage src={imgUrl} alt={product.name} /> : <SafeVideo src={product.video || ""} title={product.name} />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && <Badge variant="destructive" className="rounded-full">{discount}% OFF</Badge>}
          {product.isNewArrival && <Badge className="rounded-full">New</Badge>}
          {product.isBestSeller && <Badge variant="secondary" className="rounded-full bg-white text-black">Best seller</Badge>}
        </div>
        <button onClick={handleWishlist} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-black shadow-sm backdrop-blur transition-all hover:scale-105" aria-label="Toggle wishlist"><Heart className={cn("h-4 w-4", inWishlist && "fill-black")} /></button>
        <div className="absolute inset-x-3 bottom-3 grid grid-cols-[1fr_auto] gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button size="sm" className="h-10 rounded-full gap-2" onClick={handleAddToCart} disabled={availableStock <= 0}><ShoppingBag className="h-4 w-4" /> Quick add</Button>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black"><Eye className="h-4 w-4" /></span>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          {product.brand && <p className="truncate text-xs uppercase tracking-[0.18em] text-muted-foreground">{product.brand.name}</p>}
          <span className={cn("shrink-0 text-[11px] uppercase tracking-[0.16em]", availableStock > 0 ? "text-green-700" : "text-destructive")}>{availableStock > 0 ? "In stock" : "Sold out"}</span>
        </div>
        <h3 className={cn("font-medium leading-snug line-clamp-2", variant === "compact" ? "text-sm" : "text-base")}>{product.name}</h3>
        <div className="flex items-center gap-1 text-muted-foreground">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn("h-3 w-3", i < Math.round(rating) ? "fill-foreground text-foreground" : "")} />)}
          <span className="ml-1 text-xs">({reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
          {hasDiscount ? <><span className="font-semibold">{formatPrice(discountPrice)}</span><span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span></> : <span className="font-semibold">{formatPrice(product.price)}</span>}
        </div>
      </div>
    </Link>
  );
}
