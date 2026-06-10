"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable } from "@/components/admin/DataTable";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import type { Subscriber } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => { adminApi.getSubscribers().then((res) => setSubscribers((res as { data: Subscriber[] }).data || [])).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try { await adminApi.deleteSubscriber(id); toast.success("Deleted"); fetch(); } catch { toast.error("Failed to delete"); }
  };

  const columns: ColumnDef<Subscriber>[] = [
    { accessorKey: "email", header: "Email" },
    { header: "Status", cell: ({ row }) => row.original.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="destructive">Unsubscribed</Badge> },
    { header: "Date", cell: ({ row }) => formatDate(row.original.createdAt) },
    { id: "actions", cell: ({ row }) => (
      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(row.original.id)}><Trash2 className="h-4 w-4" /></Button>
    )},
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Newsletter Subscribers ({subscribers.length})</h1>
        <AdminDataTable columns={columns} data={subscribers} searchKey="email" pageSize={20} />
      </div>
    </AdminLayout>
  );
}
