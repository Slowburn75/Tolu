"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  pending: { label: "Pending", variant: "warning" },
  paid: { label: "Paid", variant: "success" },
  processing: { label: "Processing", variant: "info" },
  packed: { label: "Packed", variant: "info" },
  shipped: { label: "Shipped", variant: "default" },
  out_for_delivery: { label: "Out for Delivery", variant: "default" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  returned: { label: "Returned", variant: "secondary" },
  refunded: { label: "Refunded", variant: "secondary" },
  failed: { label: "Failed", variant: "destructive" },
};

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const key = status.toLowerCase();
  const config = statusConfig[key] || { label: status, variant: "outline" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
