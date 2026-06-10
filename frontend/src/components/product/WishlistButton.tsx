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
      className={cn("gap-2", isInWishlist && "bg-red-500 hover:bg-red-600 border-red-500")}
    >
      <Heart className={cn("h-4 w-4", isInWishlist && "fill-white")} />
      {isInWishlist ? "Saved" : "Save to Wishlist"}
    </Button>
  );
}
