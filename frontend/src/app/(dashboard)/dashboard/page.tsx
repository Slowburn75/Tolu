"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, MapPin, User, ArrowRight, Package, Clock, CreditCard } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { ordersApi } from "@/lib/api";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

const quickLinks = [
  { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag, color: "text-blue-600 bg-blue-100" },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart, color: "text-red-600 bg-red-100" },
  { label: "Addresses", href: "/dashboard/addresses", icon: MapPin, color: "text-green-600 bg-green-100" },
  { label: "Profile", href: "/dashboard/profile", icon: User, color: "text-purple-600 bg-purple-100" },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    ordersApi.getMyOrders({ limit: 5 }).then((res: any) => {
      setRecentOrders(Array.isArray(res) ? res : res?.data || []);
    }).catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Hello, {user?.name?.split(" ")[0] || "there"}!</h1>
          <p className="text-muted-foreground">Welcome to your dashboard</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${link.color} flex items-center justify-center mb-3`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="font-medium">{link.label}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="gap-1">View All <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No orders yet</p>
                <Link href="/shop"><Button variant="link">Start Shopping</Button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg"><Package className="h-5 w-5 text-primary" /></div>
                      <div>
                        <p className="text-sm font-medium">#{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
