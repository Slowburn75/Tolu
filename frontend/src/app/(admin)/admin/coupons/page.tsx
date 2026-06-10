"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable } from "@/components/admin/DataTable";
import { CouponForm } from "@/components/admin/CouponForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { adminApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Coupon } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetch = () => { adminApi.getCoupons().then((res) => setCoupons((res as { data: Coupon[] }).data || [])); };
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editing) { await adminApi.updateCoupon(editing.id, data); } else { await adminApi.createCoupon(data); }
      toast.success(editing ? "Coupon updated" : "Coupon created");
      setIsOpen(false); setEditing(null); fetch();
    } catch { toast.error("Failed to save coupon"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try { await adminApi.deleteCoupon(id); toast.success("Deleted"); fetch(); } catch { toast.error("Failed to delete"); }
  };

  const columns: ColumnDef<Coupon>[] = [
    { accessorKey: "code", header: "Code", cell: ({ row }) => <Badge variant="outline" className="uppercase font-mono">{row.original.code}</Badge> },
    { accessorKey: "type", header: "Type", cell: ({ row }) => <Badge variant="secondary">{row.original.type}</Badge> },
    { accessorKey: "value", header: "Value", cell: ({ row }) => row.original.type === "percentage" ? `${row.original.value}%` : formatPrice(row.original.value) },
    { accessorKey: "usedCount", header: "Used" },
    { accessorKey: "isActive", header: "Active", cell: ({ row }) => row.original.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="destructive">Inactive</Badge> },
    { accessorKey: "expiresAt", header: "Expires", cell: ({ row }) => row.original.expiresAt ? formatDate(row.original.expiresAt) : "Never" },
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
          <h1 className="text-2xl font-bold">Coupons</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => { setEditing(null); }}><Plus className="h-4 w-4" /> Add Coupon</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Edit Coupon" : "New Coupon"}</DialogTitle></DialogHeader>
              <CouponForm defaultValues={editing || undefined} onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>
        <AdminDataTable columns={columns} data={coupons} searchKey="code" />
      </div>
    </AdminLayout>
  );
}
