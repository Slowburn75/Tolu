"use client";

import { useState, useEffect } from "react";
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
import { formatPrice } from "@/lib/utils";
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
    return (
      <StoreLayout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-muted rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
              <div className="h-10 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (!product) {
    return (
      <StoreLayout>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery images={productImages} productName={product.name} />
          {product.video && (
            <div className="mt-4 rounded-lg overflow-hidden">
              <video controls className="w-full rounded-lg" style={{ maxHeight: 400 }}>
                <source src={product.video} />
              </video>
            </div>
          )}
          <div className="space-y-6">
            <ProductInfo product={product} />
            <Separator />

            {availableSizes.length > 0 && (
              <SizeSelector selectedSize={selectedSize} onSelect={setSelectedSize} availableSizes={availableSizes} />
            )}

            {availableColors.length > 0 && (
              <ColorSelector selectedColor={selectedColor} onSelect={setSelectedColor} />
            )}

            <QuantitySelector value={quantity} onChange={setQuantity} max={availableStock} />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="flex-1 h-14 text-base" onClick={handleAddToCart} disabled={availableStock <= 0}>
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1 h-14 text-base" onClick={handleBuyNow} disabled={availableStock <= 0}>
                Buy Now
              </Button>
              <WishlistButton isInWishlist={isInWishlist(product.id)} onClick={handleWishlist} size="icon" />
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {product.material && <span>Material: {product.material}</span>}
              {product.weight && <span>Weight: {product.weight}</span>}
            </div>
          </div>
        </div>

        <Tabs defaultValue="description" className="mt-16">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="delivery">Delivery & Returns</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </TabsContent>
          <TabsContent value="specifications" className="py-6">
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {product.material && <div><span className="text-sm font-medium">Material</span><p className="text-sm text-muted-foreground">{product.material}</p></div>}
              {product.weight && <div><span className="text-sm font-medium">Weight</span><p className="text-sm text-muted-foreground">{product.weight}</p></div>}
              {product.careInstructions && <div className="col-span-2"><span className="text-sm font-medium">Care Instructions</span><p className="text-sm text-muted-foreground">{product.careInstructions}</p></div>}
              {product.gender && <div><span className="text-sm font-medium">Gender</span><p className="text-sm text-muted-foreground capitalize">{product.gender}</p></div>}
              {product.ageGroup && <div><span className="text-sm font-medium">Age Group</span><p className="text-sm text-muted-foreground capitalize">{product.ageGroup}</p></div>}
            </div>
          </TabsContent>
          <TabsContent value="delivery" className="py-6">
            <div className="space-y-4 max-w-lg">
              <div className="border rounded-lg p-4"><h4 className="font-medium mb-1">Standard Delivery</h4><p className="text-sm text-muted-foreground">5-7 business days - ₦1,500</p></div>
              <div className="border rounded-lg p-4"><h4 className="font-medium mb-1">Express Delivery</h4><p className="text-sm text-muted-foreground">1-2 business days - ₦3,500</p></div>
              <div className="border rounded-lg p-4"><h4 className="font-medium mb-1">Free Shipping</h4><p className="text-sm text-muted-foreground">On orders above ₦50,000</p></div>
              <div className="border rounded-lg p-4"><h4 className="font-medium mb-1">Returns</h4><p className="text-sm text-muted-foreground">30-day hassle-free return policy. Items must be unworn with tags attached.</p></div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-6">
            <div className="space-y-6">
              <ReviewForm productId={product.id} />
              <div className="space-y-4">
                {product.reviews?.map((review: any) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
                {(!product.reviews || product.reviews.length === 0) && (
                  <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <RelatedProducts products={related} />
      </div>
      </StoreLayout>
    );
  }

  const productImages = (product.images?.map((img: any) => img.url || img).filter(Boolean) || []) as string[];
  const availableStock = product.stockQuantity ?? product.stock ?? 0;
