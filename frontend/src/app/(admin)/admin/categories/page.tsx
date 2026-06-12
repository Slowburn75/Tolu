"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { AdminDataTable } from "@/components/admin/DataTable";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { adminApi } from "@/lib/api";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    adminApi.getCategories().then((res) => setCategories((res as { data: Category[] }).data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editing) { await adminApi.updateCategory(editing.id, data); } else { await adminApi.createCategory(data); }
      toast.success(editing ? "Category updated" : "Category created");
      setIsOpen(false);
      setEditing(null);
      fetch();
    } catch { toast.error("Failed to save category"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try { await adminApi.deleteCategory(id); toast.success("Category deleted"); fetch(); } catch { toast.error("Failed to delete"); }
  };

  const columns: ColumnDef<Category>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "slug", header: "Slug" },
    { accessorKey: "description", header: "Description", cell: ({ row }) => row.original.description || "-" },
    { id: "actions", cell: ({ row }) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(row.original); setIsOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(row.original.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => { setEditing(null); }}><Plus className="h-4 w-4" /> Add Category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle></DialogHeader>
              <CategoryForm defaultValues={editing || undefined} categories={categories} onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>
        <AdminDataTable columns={columns} data={categories} searchKey="name" />
      </div>
    </AdminLayout>
  );
}
