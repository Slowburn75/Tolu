"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable } from "@/components/admin/DataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { adminApi } from "@/lib/api";
import { formatDate, getInitials } from "@/lib/utils";
import { Check, Trash2, Star } from "lucide-react";
import type { Review } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => { adminApi.getReviews().then((res: any) => setReviews(Array.isArray(res) ? res : res?.data || [])).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const handleApprove = async (id: string) => {
    try { await adminApi.approveReview(id); toast.success("Review approved"); fetch(); } catch { toast.error("Failed to approve"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try { await adminApi.deleteReview(id); toast.success("Deleted"); fetch(); } catch { toast.error("Failed to delete"); }
  };

  const columns: ColumnDef<Review>[] = [
    { header: "Product", cell: ({ row }) => row.original.product?.name || "-" },
    { header: "Customer", cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{getInitials(row.original.user?.name || "A")}</AvatarFallback></Avatar>
        <span className="text-sm">{row.original.user?.name || "Anonymous"}</span>
      </div>
    )},
    { header: "Rating", cell: ({ row }) => <div className="flex items-center gap-1">{Array.from({ length: row.original.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-foreground text-foreground" />)}</div> },
    { header: "Comment", cell: ({ row }) => <p className="max-w-xs truncate text-sm">{row.original.comment}</p> },
    { header: "Status", cell: ({ row }) => row.original.isApproved ? <Badge variant="success">Approved</Badge> : <Badge variant="warning">Pending</Badge> },
    { header: "Date", cell: ({ row }) => formatDate(row.original.createdAt) },
    { id: "actions", cell: ({ row }) => (
      <div className="flex gap-1">
        {!row.original.isApproved && <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => handleApprove(row.original.id)}><Check className="h-4 w-4" /></Button>}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(row.original.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <AdminDataTable columns={columns} data={reviews} pageSize={15} />
      </div>
    </AdminLayout>
  );
}
