"use client";

import { useState } from "react";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Truck } from "lucide-react";
import { ordersApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order } from "@/types";
import toast from "react-hot-toast";

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) return;
    setLoading(true);
    try {
      const res = await ordersApi.trackOrder({ orderNumber, email }) as Order | { data: Order };
      setOrder("data" in res ? res.data : res);
    } catch {
      toast.error("Order not found");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <StoreLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
        <div className="text-center mb-8">
          <Package className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
          <p className="text-muted-foreground">Enter your order number to track your package</p>
        </div>

        <form onSubmit={handleTrack} className="grid gap-3 max-w-md mx-auto mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Order number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Input
            type="email"
            placeholder="Email used for the order"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
          />
          <Button type="submit" className="h-12 px-6" disabled={loading}>
            {loading ? "Searching..." : "Track"}
          </Button>
        </form>

        {order && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order #{order.orderNumber}</span>
                <Badge variant={order.status === "DELIVERED" ? "success" : order.status === "CANCELLED" ? "destructive" : "info"}>
                  {order.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-medium">{formatPrice(order.total)}</p>
                </div>
              </div>

              <div className="relative">
                <div className="flex justify-between">
                  {statusSteps.map((step, i) => (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        i <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        {i + 1}
                      </div>
                      <span className="text-xs mt-2 capitalize">{step.toLowerCase().replace(/_/g, " ")}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
                  <div className="h-full bg-primary transition-all" style={{ width: `${((currentStep + 1) / statusSteps.length) * 100}%` }} />
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

              <div className="space-y-3">
                <h3 className="font-medium">Order Items</h3>
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <p className="text-sm font-medium">{item.product?.name || item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </StoreLayout>
  );
}
