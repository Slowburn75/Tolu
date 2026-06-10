"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Separator } from "@/components/ui/separator";
import { ordersApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { ArrowLeft, Package, Truck, MapPin, CreditCard } from "lucide-react";
import type { Order } from "@/types";

const statusSteps = ["pending", "processing", "shipped", "delivered"];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    if (!id) return;
    ordersApi.getOrder(id).then((res) => {
      setOrder((res as { data: Order }).data);
    }).catch(() => {
      router.push("/dashboard/orders");
    }).finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) return <DashboardLayout><div className="text-center py-12 text-muted-foreground">Loading...</div></DashboardLayout>;
  if (!order) return <DashboardLayout><div className="text-center py-12 text-muted-foreground">Order not found</div></DashboardLayout>;

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link href="/dashboard/orders" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Order #{order.orderNumber}</CardTitle>
              <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative py-4">
              <div className="flex justify-between">
                {statusSteps.map((step, i) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      i <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </div>
                    <span className="text-xs mt-2 capitalize">{step}</span>
                  </div>
                ))}
              </div>
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
                <div className="h-full bg-primary transition-all" style={{ width: `${((currentStep + 1) / statusSteps.length) * 100}%` }} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 border rounded-lg p-4">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Shipping Address</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress?.fullName}<br />
                    {order.shippingAddress?.street}<br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 border rounded-lg p-4">
                <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Payment</h4>
                  <p className="text-sm text-muted-foreground capitalize">{order.paymentMethod}</p>
                  <OrderStatusBadge status={order.paymentStatus} />
                </div>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="flex items-center gap-3 bg-muted rounded-lg p-4">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Tracking Number</p>
                  <p className="text-sm text-muted-foreground">{order.trackingNumber}</p>
                </div>
              </div>
            )}

            <Separator />

            <div>
              <h4 className="font-medium mb-4">Order Items ({order.items.length})</h4>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border rounded-lg p-4">
                    <div className="w-16 h-16 bg-muted rounded-md overflow-hidden shrink-0">
                      <img src={item.product.images?.[0]?.url || item.product.images?.[0] || "/placeholder.png"} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.product.name}</p>
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
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
              <Separator />
              <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
