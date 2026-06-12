"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable } from "@/components/admin/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { adminApi } from "@/lib/api";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import type { Banner } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", subtitle: "", image: "", link: "", order: 1, isActive: true });

  const fetch = () => { adminApi.getBanners().then((res) => setBanners((res as { data: Banner[] }).data || [])); };
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async () => {
    try {
      const data = Object.fromEntries(Object.entries(formData).filter(([, value]) => value !== ""));
      if (editing) { await adminApi.updateBanner(editing.id, data); } else { await adminApi.createBanner(data); }
      toast.success(editing ? "Banner updated" : "Banner created");
      setIsOpen(false); setEditing(null); fetch();
    } catch { toast.error("Failed to save banner"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try { await adminApi.deleteBanner(id); toast.success("Deleted"); fetch(); } catch { toast.error("Failed to delete"); }
  };

  const columns: ColumnDef<Banner>[] = [
    { header: "Order", accessorKey: "order", cell: ({ row }) => <div className="flex items-center gap-1"><GripVertical className="h-4 w-4 text-muted-foreground" />{row.original.order}</div> },
    { header: "Title", accessorKey: "title" },
    { header: "Subtitle", accessorKey: "subtitle", cell: ({ row }) => row.original.subtitle || "-" },
    { header: "Active", cell: ({ row }) => row.original.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="destructive">Inactive</Badge> },
    { id: "actions", cell: ({ row }) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(row.original); setFormData({ title: row.original.title, subtitle: row.original.subtitle || "", image: row.original.image || "", link: row.original.link || "", order: row.original.order, isActive: row.original.isActive }); setIsOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(row.original.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Banners</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => { setEditing(null); setFormData({ title: "", subtitle: "", image: "", link: "", order: 1, isActive: true }); }}><Plus className="h-4 w-4" /> Add Banner</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Edit Banner" : "New Banner"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Title</Label><Input value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Subtitle</Label><Input value={formData.subtitle} onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Image URL</Label><Input value={formData.image} onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Link</Label><Input value={formData.link} onChange={(e) => setFormData((p) => ({ ...p, link: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Order</Label><Input type="number" value={formData.order} onChange={(e) => setFormData((p) => ({ ...p, order: parseInt(e.target.value) }))} /></div>
                <Button className="w-full" onClick={handleSubmit}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <AdminDataTable columns={columns} data={banners} />
      </div>
    </AdminLayout>
  );
}
