"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { AdminDataTable } from "@/components/admin/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApi } from "@/lib/api";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Brand } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "" });

  const fetch = () => { adminApi.getBrands().then((res) => setBrands((res as { data: Brand[] }).data || [])); };
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("description", formData.description);
      if (editing) { await adminApi.updateBrand(editing.id, data); } else { await adminApi.createBrand(data); }
      toast.success(editing ? "Brand updated" : "Brand created");
      setIsOpen(false); setEditing(null); setFormData({ name: "", slug: "", description: "" });
      fetch();
    } catch { toast.error("Failed to save brand"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try { await adminApi.deleteBrand(id); toast.success("Brand deleted"); fetch(); } catch { toast.error("Failed to delete"); }
  };

  const columns: ColumnDef<Brand>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "slug", header: "Slug" },
    { id: "actions", cell: ({ row }) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(row.original); setFormData({ name: row.original.name, slug: row.original.slug, description: row.original.description || "" }); setIsOpen(true); }}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(row.original.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Brands</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => { setEditing(null); setFormData({ name: "", slug: "", description: "" }); }}><Plus className="h-4 w-4" /> Add Brand</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Edit Brand" : "New Brand"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Slug</Label><Input value={formData.slug} onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Description</Label><Input value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} /></div>
                <Button className="w-full" onClick={handleSubmit}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <AdminDataTable columns={columns} data={brands} searchKey="name" />
      </div>
    </AdminLayout>
  );
}
