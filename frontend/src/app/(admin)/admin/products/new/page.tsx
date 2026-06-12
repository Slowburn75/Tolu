"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { useRouter } from "next/navigation";
import { adminApi, categoriesApi, brandsApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    categoriesApi.getCategories().then((res: any) => {
      const data = res.data || res;
      if (Array.isArray(data)) setCategories(data.map((c: any) => ({ id: c.id, name: c.name })));
    }).catch(() => {});
    brandsApi.getBrands().then((res: any) => {
      const data = res.data || res;
      if (Array.isArray(data)) setBrands(data.map((b: any) => ({ id: b.id, name: b.name })));
    }).catch(() => {});
  }, []);

  const handleSubmit = async (formData: FormData) => {
    try {
      const imageUrls: { url: string; order: number; alt: string }[] = [];
      const name = formData.get("name") as string;
      imageUrls.push({ url: `https://placehold.co/800x800/EEE/31343C?text=${encodeURIComponent(name || 'Product')}`, order: 0, alt: name });

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
        description: formData.get("description") || "",
        sku: `SKU-${Date.now()}`,
        price: parseFloat(formData.get("price") as string) || 0,
        discountPrice: formData.get("discountPrice") ? parseFloat(formData.get("discountPrice") as string) : undefined,
        stockQuantity: parseInt(formData.get("stock") as string) || 0,
        material: formData.get("material") || undefined,
        weight: formData.get("weight") ? parseFloat(formData.get("weight") as string) : undefined,
        careInstructions: formData.get("careInstructions") || undefined,
        gender: (formData.get("gender") as string)?.toUpperCase() || undefined,
        ageGroup: (formData.get("ageGroup") as string)?.toUpperCase() || undefined,
        brandId: formData.get("brandId") || undefined,
        categoryIds: formData.get("categoryId") ? [formData.get("categoryId") as string] : [],
        isFeatured: formData.get("isFeatured") === "true",
        isNewArrival: formData.get("isNewArrival") === "true",
        isBestSeller: formData.get("isBestSeller") === "true",
        isSale: formData.get("isSale") === "true",
        images: imageUrls.length > 0 ? imageUrls : undefined,
        variants: variants.length > 0 ? variants : undefined,
      };

      await adminApi.createProduct(payload);
      toast.success("Product created!");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to create product");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">New Product</h1>
        <ProductForm onSubmit={handleSubmit} categories={categories} brands={brands} />
      </div>
    </AdminLayout>
  );
}
