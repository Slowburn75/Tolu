"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { adminApi, categoriesApi, brandsApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    Promise.all([
      categoriesApi.getCategories().then((res: any) => {
        const data = res.data || res;
        if (Array.isArray(data)) setCategories(data.map((c: any) => ({ id: c.id, name: c.name })));
      }).catch(() => {}),
      brandsApi.getBrands().then((res: any) => {
        const data = res.data || res;
        if (Array.isArray(data)) setBrands(data.map((b: any) => ({ id: b.id, name: b.name })));
      }).catch(() => {}),
      adminApi.getProducts().then((res: any) => {
        const products = res.data || res;
        const found = Array.isArray(products) ? products.find((p: any) => p.id === params.id) : null;
        setProduct(found);
      }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [params.id]);

  const handleSubmit = async (formData: FormData) => {
    try {
      const imageUrls: { url: string; order: number; alt: string }[] = [];
      const name = formData.get("name") as string;
      imageUrls.push({ url: "/placeholder.svg", order: 0, alt: name });

      const sizes = JSON.parse((formData.get("sizes") as string) || "[]");
      const colors = JSON.parse((formData.get("colors") as string) || "[]");
      const variants: { size: string; color: string; stock: number }[] = [];
      sizes.forEach((size: string) => {
        colors.forEach((color: string) => {
          variants.push({ size, color, stock: parseInt(formData.get("stock") as string) || 0 });
        });
      });

      const payload: Record<string, any> = {
        name: formData.get("name"),
        description: formData.get("description") || undefined,
        price: formData.get("price") ? parseFloat(formData.get("price") as string) : undefined,
        discountPrice: formData.get("discountPrice") ? parseFloat(formData.get("discountPrice") as string) : undefined,
        stockQuantity: formData.get("stock") ? parseInt(formData.get("stock") as string) : undefined,
        material: formData.get("material") || undefined,
        weight: formData.get("weight") ? parseFloat(formData.get("weight") as string) : undefined,
        careInstructions: formData.get("careInstructions") || undefined,
        gender: (formData.get("gender") as string)?.toUpperCase() || undefined,
        ageGroup: (formData.get("ageGroup") as string)?.toUpperCase() || undefined,
        brandId: formData.get("brandId") || undefined,
        categoryIds: formData.get("categoryId") ? [formData.get("categoryId") as string] : undefined,
        isFeatured: formData.get("isFeatured") === "true",
        isNewArrival: formData.get("isNewArrival") === "true",
        isBestSeller: formData.get("isBestSeller") === "true",
        isSale: formData.get("isSale") === "true",
        images: imageUrls.length > 0 ? imageUrls : undefined,
        variants: variants.length > 0 ? variants : undefined,
      };

      await adminApi.updateProduct(params.id as string, payload);
      toast.success("Product updated!");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to update product");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <ProductForm
            defaultValues={product ? {
              name: product.name,
              description: product.description,
              price: Number(product.price),
              discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
              stock: product.stockQuantity,
              material: product.material || "",
              weight: product.weight ? String(product.weight) : "",
              careInstructions: product.careInstructions || "",
              categoryId: product.categories?.[0]?.categoryId || "",
              brandId: product.brandId || "",
              gender: product.gender || "",
              ageGroup: product.ageGroup || "",
              isFeatured: product.isFeatured,
              isNewArrival: product.isNewArrival,
              isBestSeller: product.isBestSeller,
              isOnSale: product.isSale,
            } : undefined}
            onSubmit={handleSubmit}
            categories={categories}
            brands={brands}
          />
        )}
      </div>
    </AdminLayout>
  );
}
