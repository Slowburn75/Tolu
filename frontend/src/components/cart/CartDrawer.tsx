"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQuantity, getSubtotal, getTotal } = useCart();
  const activeItems = items.filter((i) => !i.savedForLater);
  const subtotal = getSubtotal();
  const freeShippingTarget = 50000;
  const progress = Math.min(100, Math.round((subtotal / freeShippingTarget) * 100));

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 pb-4 pt-6"><SheetTitle className="flex items-center gap-2 text-lg"><ShoppingBag className="h-5 w-5" /> Shopping Cart ({activeItems.length})</SheetTitle></SheetHeader>
        {activeItems.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center"><ShoppingBag className="h-16 w-16 text-muted-foreground" /><div><p className="font-medium">Your cart is empty</p><p className="mt-1 text-sm text-muted-foreground">Build a look from the latest Tolumak edit.</p></div><Button asChild className="rounded-full" onClick={() => setOpen(false)}><Link href="/shop">Continue Shopping</Link></Button></div> : <>
          <div className="border-b px-6 py-4"><div className="mb-2 flex items-center gap-2 text-sm"><Truck className="h-4 w-4" />{subtotal >= freeShippingTarget ? "You unlocked free shipping" : formatPrice(freeShippingTarget - subtotal) + " away from free shipping"}</div><div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-foreground transition-all" style={{ width: progress + "%" }} /></div></div>
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">{activeItems.map((item) => <div key={item.productId + "-" + item.size + "-" + item.color} className="grid grid-cols-[88px_1fr] gap-4"><div className="relative h-28 overflow-hidden bg-muted"><Image src={item.product.images?.[0]?.url || item.product.images?.[0] || "/placeholder.svg"} alt={item.product.name} fill className="object-cover" sizes="88px" /></div><div className="min-w-0"><Link href={"/products/" + item.product.slug} className="line-clamp-2 text-sm font-medium hover:text-muted-foreground">{item.product.name}</Link>{(item.size || item.color) && <p className="mt-1 text-xs text-muted-foreground">{item.size && "Size: " + item.size} {item.color && " | Color: " + item.color}</p>}<p className="mt-2 text-sm font-semibold">{formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}</p><div className="mt-3 flex items-center justify-between"><div className="flex items-center rounded-full border"><button className="p-2 hover:bg-accent" onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size, item.color)} aria-label="Decrease quantity"><Minus className="h-3 w-3" /></button><span className="px-2 text-xs font-medium">{item.quantity}</span><button className="p-2 hover:bg-accent" onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size, item.color)} aria-label="Increase quantity"><Plus className="h-3 w-3" /></button></div><button onClick={() => removeItem(item.productId, item.size, item.color)} className="text-muted-foreground hover:text-destructive" aria-label="Remove item"><Trash2 className="h-4 w-4" /></button></div></div></div>)}</div>
          <div className="border-t px-6 py-5"><div className="mb-4 grid grid-cols-[1fr_auto] gap-2"><Input placeholder="Coupon code" className="rounded-full" /><Button variant="outline" className="rounded-full">Apply</Button></div><div className="space-y-2"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>Calculated at checkout</span></div><Separator /><div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatPrice(getTotal())}</span></div></div><div className="mt-4 space-y-2"><Button asChild className="h-12 w-full rounded-full" onClick={() => setOpen(false)}><Link href="/checkout">Checkout</Link></Button><Button variant="outline" asChild className="w-full rounded-full" onClick={() => setOpen(false)}><Link href="/cart">View Cart</Link></Button></div></div>
        </>}
      </SheetContent>
    </Sheet>
  );
}
