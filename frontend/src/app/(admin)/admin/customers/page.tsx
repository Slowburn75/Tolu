"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AdminDataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getCustomers().then((res) => setCustomers((res as { data: User[] }).data || [])).finally(() => setLoading(false));
  }, []);

  const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone", cell: ({ row }) => row.original.phone || "-" },
    { accessorKey: "role", header: "Role", cell: ({ row }) => <Badge variant={row.original.role === "ADMIN" ? "default" : "secondary"}>{row.original.role}</Badge> },
    { accessorKey: "createdAt", header: "Joined", cell: ({ row }) => formatDate(row.original.createdAt) },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <AdminDataTable columns={columns} data={customers} searchKey="name" pageSize={15} onRowClick={(row) => window.location.href = `/admin/customers/${(row as User).id}`} />
      </div>
    </AdminLayout>
  );
}
