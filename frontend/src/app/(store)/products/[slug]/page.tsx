"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { SizeSelector } from "@/components/product/SizeSelector";
import { ColorSelector } from "@/components/product/ColorSelector";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { WishlistButton } from "@/components/product/WishlistButton";
import { ReviewCard } from "@/components/product/ReviewCard";
import { ReviewForm } from "@/components/product/ReviewForm";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { productsApi } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>();
  const [selectedColor, setSelectedColor] = useState<string>();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();
  const availableSizes = Array.from(new Set(product?.variants?.map((v: any) => v.size).filter(Boolean) || [])) as string[];
  const availableColors = Array.from(new Set(product?.variants?.map((v: any) => v.color).filter(Boolean) || [])) as string[];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res: any = await productsApi.getProduct(slug);
        setProduct(res?.data || res);
      } catch {
        setProduct(null);
      }
      try {
        const relatedRes: any = await productsApi.getRelated(slug);
        setRelated(Array.isArray(relatedRes) ? relatedRes : relatedRes?.data || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, selectedSize, selectedColor);
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, quantity, selectedSize, selectedColor);
    window.location.href = "/checkout";
  };

  const handleWishlist = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  if (loading) {
    return <StoreLayout><div className="mx-auto max-w-7xl px-4 py-28"><div className="grid gap-12 lg:grid-cols-2"><div className="aspect-[3/4] animate-pulse bg-muted" /><div className="space-y-4"><div className="h-6 w-1/4 animate-pulse rounded bg-muted" /><div className="h-12 w-3/4 animate-pulse rounded bg-muted" /><div className="h-6 w-1/3 animate-pulse rounded bg-muted" /><div className="h-28 animate-pulse rounded bg-muted" /></div></div></div></StoreLayout>;
  }

  if (!product) {
    return <StoreLayout><div className="mx-auto max-w-7xl px-4 py-28 text-center"><h1 className="text-2xl font-semibold">Product not found</h1></div></StoreLayout>;
  }

  const productImages = (product.images?.map((img: any) => img.url || img).filter(Boolean) || []) as string[];
  const availableStock = product.stockQuantity ?? product.stock ?? 0;
  const reviewCount = product.reviewCount ?? product._count?.reviews ?? product.reviews?.length ?? 0;

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
          <div className="min-w-0 space-y-4">
            {productImages.length > 0 && <ProductGallery images={productImages} productName={product.name} />}
            {product.video && <div className={(productImages.length > 0 ? "aspect-video" : "aspect-[3/4]") + " overflow-hidden bg-muted"}><video controls className="h-full w-full object-contain"><source src={product.video} /></video></div>}
            {productImages.length === 0 && !product.video && <ProductGallery images={[]} productName={product.name} />}
          </div>
          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <ProductInfo product={product} />
            <Separator />
            {availableSizes.length > 0 && <SizeSelector selectedSize={selectedSize} onSelect={setSelectedSize} availableSizes={availableSizes} />}
            {availableColors.length > 0 && <ColorSelector selectedColor={selectedColor} onSelect={setSelectedColor} />}
            <QuantitySelector value={quantity} onChange={setQuantity} max={availableStock} />
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <Button size="lg" className="h-14 rounded-full text-base" onClick={handleAddToCart} disabled={availableStock <= 0}>Add to Cart</Button>
              <Button size="lg" variant="outline" className="h-14 rounded-full text-base" onClick={handleBuyNow} disabled={availableStock <= 0}>Buy Now</Button>
              <WishlistButton isInWishlist={isInWishlist(product.id)} onClick={handleWishlist} size="icon" />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">{product.material && <span>Material: {product.material}</span>}{product.weight && <span>Weight: {product.weight}</span>}</div>
          </div>
        </div>

        <Tabs defaultValue="description" className="mt-16">
          <TabsList className="flex h-auto flex-wrap justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent px-0 py-4 mr-8 data-[state=active]:border-foreground data-[state=active]:bg-transparent">Description</TabsTrigger>
            <TabsTrigger value="specifications" className="rounded-none border-b-2 border-transparent px-0 py-4 mr-8 data-[state=active]:border-foreground data-[state=active]:bg-transparent">Specifications</TabsTrigger>
            <TabsTrigger value="delivery" className="rounded-none border-b-2 border-transparent px-0 py-4 mr-8 data-[state=active]:border-foreground data-[state=active]:bg-transparent">Delivery & Returns</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent px-0 py-4 data-[state=active]:border-foreground data-[state=active]:bg-transparent">Reviews ({reviewCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-8"><p className="max-w-3xl leading-8 text-muted-foreground">{product.description}</p></TabsContent>
          <TabsContent value="specifications" className="py-8"><div className="grid max-w-2xl gap-4 sm:grid-cols-2">{product.material && <div><span className="text-sm font-medium">Material</span><p className="text-sm text-muted-foreground">{product.material}</p></div>}{product.weight && <div><span className="text-sm font-medium">Weight</span><p className="text-sm text-muted-foreground">{product.weight}</p></div>}{product.careInstructions && <div className="sm:col-span-2"><span className="text-sm font-medium">Care Instructions</span><p className="text-sm text-muted-foreground">{product.careInstructions}</p></div>}{product.gender && <div><span className="text-sm font-medium">Gender</span><p className="text-sm capitalize text-muted-foreground">{product.gender}</p></div>}{product.ageGroup && <div><span className="text-sm font-medium">Age Group</span><p className="text-sm capitalize text-muted-foreground">{product.ageGroup}</p></div>}</div></TabsContent>
          <TabsContent value="delivery" className="py-8"><div className="grid max-w-3xl gap-4 sm:grid-cols-2"><div className="border p-5"><h4 className="font-medium">Standard Delivery</h4><p className="mt-1 text-sm text-muted-foreground">5-7 business days</p></div><div className="border p-5"><h4 className="font-medium">Express Delivery</h4><p className="mt-1 text-sm text-muted-foreground">1-2 business days</p></div><div className="border p-5"><h4 className="font-medium">Free Shipping</h4><p className="mt-1 text-sm text-muted-foreground">On qualifying orders</p></div><div className="border p-5"><h4 className="font-medium">Returns</h4><p className="mt-1 text-sm text-muted-foreground">30-day return policy</p></div></div></TabsContent>
          <TabsContent value="reviews" className="py-8"><div className="space-y-6"><ReviewForm productId={product.id} /><div className="space-y-4">{product.reviews?.map((review: any) => <ReviewCard key={review.id} review={review} />)}{(!product.reviews || product.reviews.length === 0) && <p className="py-8 text-center text-muted-foreground">No reviews yet. Be the first to review!</p>}</div></div></TabsContent>
        </Tabs>
        <RelatedProducts products={related} />
      </div>
    </StoreLayout>
  );
}
