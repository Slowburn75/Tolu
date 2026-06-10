"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { ordersApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { Package, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Order } from "@/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    ordersApi.getMyOrders().then((res) => {
      setOrders((res as { data: Order[] }).data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl">My Orders</CardTitle>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium mb-1">{search ? "No orders found" : "No orders yet"}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {search ? "Try a different search term" : "Start shopping to see your orders here"}
              </p>
              {!search && <Link href="/shop"><Button>Browse Products</Button></Link>}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((order) => (
                <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg"><Package className="h-5 w-5 text-primary" /></div>
                    <div>
                      <p className="text-sm font-medium">Order #{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)} | {order.items.length} item(s)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
