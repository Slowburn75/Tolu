"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { ArrowLeft, Package, Truck, MapPin, CreditCard } from "lucide-react";
import type { Order } from "@/types";
import { orderStatuses } from "@/lib/constants";
import toast from "react-hot-toast";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = () => {
    adminApi.getOrder(params.id as string).then((res: any) => {
      setOrder(res?.data || res as Order);
    }).catch(() => router.push("/admin/orders")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrder(); }, [params.id]);

  const handleStatusChange = async (status: string) => {
    try {
      await adminApi.updateOrderStatus(params.id as string, status);
      toast.success("Status updated");
      fetchOrder();
    } catch { toast.error("Failed to update status"); }
  };

  if (loading) return <AdminLayout><div className="text-center py-12 text-muted-foreground">Loading...</div></AdminLayout>;
  if (!order) return <AdminLayout><div className="text-center py-12 text-muted-foreground">Order not found</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Order #{order.orderNumber}</CardTitle>
              <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <OrderStatusBadge status={order.status} />
              <Select value={order.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {orderStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4 text-primary" /><h4 className="font-medium">Shipping Address</h4></div>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress?.fullName}<br />{order.shippingAddress?.street}<br />{order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2"><CreditCard className="h-4 w-4 text-primary" /><h4 className="font-medium">Payment</h4></div>
                <p className="text-sm text-muted-foreground capitalize">{order.paymentMethod}</p>
                <OrderStatusBadge status={order.paymentStatus} />
                {order.paymentReference && <p className="text-xs text-muted-foreground mt-1">Ref: {order.paymentReference}</p>}
              </div>
            </div>

            {order.trackingNumber && (
              <div className="flex items-center gap-3 bg-muted rounded-lg p-4">
                <Truck className="h-5 w-5 text-primary" />
                <div><p className="text-sm font-medium">Tracking: {order.trackingNumber}</p></div>
              </div>
            )}

            <Separator />

            <div>
              <h4 className="font-medium mb-4">Items ({order.items.length})</h4>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border rounded-lg p-4">
                    <div className="w-16 h-16 bg-muted rounded-md overflow-hidden shrink-0">
                      <img src={item.product?.images?.[0]?.url || item.product?.images?.[0] || "/placeholder.png"} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.product?.name || item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} x {formatPrice(item.price)}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>{(order.shippingFee ?? order.shipping ?? 0) === 0 ? "Free" : formatPrice(order.shippingFee ?? order.shipping ?? 0)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
              <Separator />
              <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
