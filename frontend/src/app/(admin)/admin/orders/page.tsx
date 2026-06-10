"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AdminDataTable } from "@/components/admin/DataTable";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { adminApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getOrders().then((res) => setOrders((res as { data: Order[] }).data || [])).finally(() => setLoading(false));
  }, []);

  const columns: ColumnDef<Order>[] = [
    { accessorKey: "orderNumber", header: "Order #" },
    { accessorKey: "user", header: "Customer", cell: ({ row }) => row.original.user?.name || "Guest" },
    { accessorKey: "total", header: "Total", cell: ({ row }) => formatPrice(row.original.total) },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <OrderStatusBadge status={row.original.status} /> },
    { accessorKey: "paymentStatus", header: "Payment", cell: ({ row }) => <OrderStatusBadge status={row.original.paymentStatus} /> },
    { accessorKey: "createdAt", header: "Date", cell: ({ row }) => formatDate(row.original.createdAt) },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <AdminDataTable
          columns={columns}
          data={orders}
          searchKey="orderNumber"
          pageSize={15}
          onRowClick={(row) => window.location.href = `/admin/orders/${(row as Order).id}`}
        />
      </div>
    </AdminLayout>
  );
}
