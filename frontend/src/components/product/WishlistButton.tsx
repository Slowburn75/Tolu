"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  isInWishlist: boolean;
  onClick: () => void;
  size?: "default" | "sm" | "lg" | "icon";
}

export function WishlistButton({ isInWishlist, onClick, size = "default" }: WishlistButtonProps) {
  return (
    <Button
      variant={isInWishlist ? "default" : "outline"}
      size={size}
      onClick={onClick}
      className={cn("gap-2", isInWishlist && "bg-primary text-primary-foreground")}
    >
      <Heart className={cn("h-5 w-5", isInWishlist && "fill-primary-foreground")} />
      <span className={size === "icon" ? "sr-only" : ""}>{isInWishlist ? "Saved" : "Save to Wishlist"}</span>
    </Button>
  );
}
