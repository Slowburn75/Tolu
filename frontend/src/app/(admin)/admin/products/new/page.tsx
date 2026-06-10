"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { useRouter } from "next/navigation";
import { adminApi, uploadsApi, categoriesApi, brandsApi } from "@/lib/api";
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
      const files = formData.getAll("images") as File[];
      if (files.length > 0) {
        const imagesFormData = new FormData();
        files.forEach((f) => imagesFormData.append("files", f));
        const uploadRes = await uploadsApi.uploadImages(imagesFormData) as any;
        const uploaded = uploadRes.data || uploadRes;
        if (Array.isArray(uploaded)) {
          uploaded.forEach((img: any, i: number) => {
            imageUrls.push({ url: img.url || img.secure_url, order: i, alt: formData.get("name") as string });
          });
        }
      }

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
        gender: formData.get("gender") || undefined,
        ageGroup: formData.get("ageGroup") || undefined,
        brandId: formData.get("brandId") || undefined,
        categoryIds: formData.get("categoryId") ? [formData.get("categoryId") as string] : [],
        isFeatured: formData.get("isFeatured") === "true",
        isNewArrival: formData.get("isNewArrival") === "true",
        isBestSeller: formData.get("isBestSeller") === "true",
        isSale: formData.get("isOnSale") === "true",
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
