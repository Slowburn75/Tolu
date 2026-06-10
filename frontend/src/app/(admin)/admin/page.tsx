"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { SalesChart } from "@/components/admin/SalesChart";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, Package, TrendingUp } from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import type { DashboardStats, Order } from "@/types";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats().then((res: any) => {
      const data = res.stats || res.data || res;
      setStats({
        totalOrders: data.totalOrders || 0,
        totalRevenue: Number(data.totalRevenue || data.totalRevenue?._sum?.total || 0),
        totalCustomers: data.totalUsers || data.totalCustomers || 0,
        totalProducts: data.totalProducts || 0,
        ordersByStatus: data.ordersByStatus || [],
        revenueByMonth: data.revenueByMonth || [],
        recentOrders: res.recentOrders || [],
        topProducts: data.topProducts || [],
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard icon={<DollarSign className="h-6 w-6" />} label="Total Revenue" value={stats ? formatPrice(stats.totalRevenue) : "₦0"} trend={12} />
          <StatsCard icon={<ShoppingBag className="h-6 w-6" />} label="Total Orders" value={stats?.totalOrders || 0} trend={8} />
          <StatsCard icon={<Users className="h-6 w-6" />} label="Customers" value={stats?.totalCustomers || 0} trend={5} />
          <StatsCard icon={<Package className="h-6 w-6" />} label="Products" value={stats?.totalProducts || 0} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SalesChart data={stats?.revenueByMonth?.map((r) => ({ date: r.month, revenue: r.revenue, orders: 0 })) || []} />
          </div>
          <Card>
            <CardHeader><CardTitle className="text-lg">Recent Orders</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentOrders?.slice(0, 5).map((order) => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">#{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </Link>
                ))}
                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent orders</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
