"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { ProductGrid } from "@/components/product/ProductGrid";
import { categoriesApi, productsApi } from "@/lib/api";
import type { Category, Product } from "@/types";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await categoriesApi.getCategory(slug) as { data: Category };
        setCategory(catRes.data);
        const prodRes = await productsApi.getProducts({ category: slug }) as { data: Product[] };
        setProducts(prodRes.data);
      } catch {
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display">{category?.name || slug}</h1>
          {category?.description && <p className="text-muted-foreground mt-2">{category.description}</p>}
        </div>
        <ProductGrid products={products} isLoading={loading} />
      </div>
    </StoreLayout>
  );
}
