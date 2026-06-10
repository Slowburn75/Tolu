"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { AdminDataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    adminApi.getProducts().then((res: any) => {
      const data = res.data || res;
      setProducts(Array.isArray(data) ? data : []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const columns: ColumnDef<Product>[] = [
    { accessorKey: "name", header: "Product", cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-muted rounded-md overflow-hidden shrink-0">
          <img src={row.original.images?.[0]?.url || "/placeholder.png"} alt="" className="w-full h-full object-cover" />
        </div>
        <span className="font-medium">{row.original.name}</span>
      </div>
    )},
    { accessorKey: "price", header: "Price", cell: ({ row }) => formatPrice(row.original.discountPrice || row.original.price) },
    { accessorKey: "stockQuantity", header: "Stock" },
    { id: "isFeatured", header: "Featured", cell: ({ row }) => row.original.isFeatured ? <Badge variant="default">Yes</Badge> : <Badge variant="outline">No</Badge> },
    { id: "actions", cell: ({ row }) => (
      <div className="flex gap-1">
        <Link href={`/admin/products/${row.original.id}/edit`}><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button></Link>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(row.original.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Products</h1>
          <Link href="/admin/products/new"><Button className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button></Link>
        </div>
        <AdminDataTable columns={columns} data={products} searchKey="name" pageSize={10} />
      </div>
    </AdminLayout>
  );
}
