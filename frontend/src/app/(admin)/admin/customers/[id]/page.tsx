"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { adminApi } from "@/lib/api";
import { formatDate, formatPrice, getInitials } from "@/lib/utils";
import { ArrowLeft, Mail, Phone, Calendar, Package } from "lucide-react";
import type { User, Order } from "@/types";

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [customer, setCustomer] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getCustomer(customerId),
      adminApi.getOrders({ userId: customerId }),
    ]).then(([customerRes, ordersRes]) => {
      setCustomer((customerRes as any)?.data || customerRes as User);
      setOrders((ordersRes as { data: Order[] }).data || []);
    }).catch(() => router.push("/admin/customers")).finally(() => setLoading(false));
  }, [customerId]);

  if (loading) return <AdminLayout><div className="text-center py-12">Loading...</div></AdminLayout>;
  if (!customer) return <AdminLayout><div className="text-center py-12">Customer not found</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Link href="/admin/customers" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Customers
        </Link>

        <Card>
          <CardContent className="p-6 flex items-center gap-6">
            <Avatar className="h-16 w-16"><AvatarFallback className="text-lg bg-primary text-primary-foreground">{getInitials(customer.name)}</AvatarFallback></Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{customer.name}</h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {customer.email}</span>
                {customer.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {customer.phone}</span>}
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined {formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Order History ({orders.length})</CardTitle></CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-primary" />
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
    </AdminLayout>
  );
}
