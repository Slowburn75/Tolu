"use client";

import { useEffect, useState } from "react";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductSort } from "@/components/product/ProductSort";
import { ProductSearch } from "@/components/product/ProductSearch";
import { Button } from "@/components/ui/button";
import { productsApi } from "@/lib/api";
import type { Product, ProductFilters as Filters } from "@/types";
import { useSearchParams } from "next/navigation";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState<Filters>({
    category: searchParams.get("category") || undefined,
    gender: searchParams.get("gender") || undefined,
    search: searchParams.get("search") || undefined,
    isOnSale: searchParams.get("sale") === "true" || undefined,
    isNewArrival: searchParams.get("isNewArrival") === "true" || undefined,
    isBestSeller: searchParams.get("isBestSeller") === "true" || undefined,
  });
  const [sort, setSort] = useState("latest");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const apiFilters: Record<string, string | number | boolean | undefined> = {
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { categorySlug: filters.category }),
        ...(filters.gender && { gender: filters.gender.toUpperCase() }),
        ...(filters.ageGroup && { ageGroup: filters.ageGroup }),
        ...(filters.minPrice !== undefined && { minPrice: filters.minPrice }),
        ...(filters.maxPrice !== undefined && { maxPrice: filters.maxPrice }),
        ...(filters.brand && { brandSlug: filters.brand }),
        ...(filters.colors && filters.colors.length > 0 && { colors: filters.colors.join(",") }),
        ...(filters.sizes && filters.sizes.length > 0 && { sizes: filters.sizes.join(",") }),
        sort: sort === "latest" ? undefined : sort,
        page: pagination.page,
        limit: 12,
      };
      const res: any = await productsApi.getProducts(apiFilters);
      const data = Array.isArray(res) ? res : res?.data || [];
      setProducts(data);
      if (res?.meta) setPagination({ page: res.meta.page || 1, totalPages: res.meta.totalPages || 1 });
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [filters, sort, pagination.page]);

  return (
    <StoreLayout>
      <div className="border-b bg-[#111] px-4 pb-12 pt-28 text-white sm:px-6 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/55">Tolumak shop</p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold sm:text-6xl">Premium product discovery.</h1>
              <p className="mt-4 max-w-2xl text-white/68">Filter cleanly, compare quickly, and move from inspiration to checkout without friction.</p>
            </div>
            <ProductSearch onSearch={(q) => setFilters((f) => ({ ...f, search: q }))} />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:sticky lg:top-24 lg:self-start"><ProductFilters filters={filters} onChange={(f) => { setFilters(f); setPagination((p) => ({ ...p, page: 1 })); }} /></aside>
          <div className="min-w-0 flex-1">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-sm text-muted-foreground">{loading ? "Curating products..." : products.length + " products shown"}</p><h2 className="text-2xl font-semibold">All Products</h2></div>
              <ProductSort value={sort} onChange={setSort} />
            </div>
            <ProductGrid products={products} isLoading={loading} />
            {pagination.totalPages > 1 && <div className="mt-10 flex justify-center gap-3"><Button variant="outline" className="rounded-full" onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1}>Previous</Button><span className="flex items-center text-sm text-muted-foreground">Page {pagination.page} of {pagination.totalPages}</span><Button variant="outline" className="rounded-full" onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages}>Next</Button></div>}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
