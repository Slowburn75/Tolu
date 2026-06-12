"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, toggleSaveForLater } = useCart();
  const price = item.product.discountPrice || item.product.price;

  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="relative w-24 h-24 bg-muted rounded-md overflow-hidden shrink-0">
        <Image
          src={item.product.images?.[0]?.url || item.product.images?.[0] || "/placeholder.svg"}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.slug}`} className="text-sm font-medium hover:text-primary line-clamp-1">
          {item.product.name}
        </Link>
        {item.product.brand && (
          <p className="text-xs text-muted-foreground">{item.product.brand.name}</p>
        )}
        {(item.size || item.color) && (
          <p className="text-xs text-muted-foreground">
            {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
          </p>
        )}
        <p className="text-sm font-medium mt-1">{formatPrice(price)}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border rounded-md">
            <button className="p-1 hover:bg-accent" onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size, item.color)}>
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-3 text-sm font-medium">{item.quantity}</span>
            <button className="p-1 hover:bg-accent" onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size, item.color)}>
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => toggleSaveForLater(item.productId, item.size, item.color)}>
              Save for later
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.productId, item.size, item.color)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm font-semibold mt-2">Subtotal: {formatPrice(price * item.quantity)}</p>
      </div>
    </div>
  );
}
