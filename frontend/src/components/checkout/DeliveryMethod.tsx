"use client";

import { Truck, Zap, Store } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { deliveryMethods } from "@/lib/constants";

interface DeliveryMethodProps {
  value: string;
  onChange: (value: string) => void;
}

const icons: Record<string, React.ReactNode> = {
  standard: <Truck className="h-5 w-5" />,
  express: <Zap className="h-5 w-5" />,
  pickup: <Store className="h-5 w-5" />,
};

export function DeliveryMethod({ value, onChange }: DeliveryMethodProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
      {deliveryMethods.map((method) => (
        <Label
          key={method.id}
          className={cn(
            "flex items-center gap-4 border rounded-lg p-4 cursor-pointer transition-all hover:border-primary",
            value === method.id && "border-primary bg-primary/5"
          )}
        >
          <RadioGroupItem value={method.id} className="mt-0" />
          <div className="flex-1 flex items-center gap-3">
            {icons[method.id]}
            <div className="flex-1">
              <p className="text-sm font-medium">{method.name}</p>
              <p className="text-xs text-muted-foreground">{method.days}</p>
            </div>
            <span className="font-medium text-sm">
              {method.price === 0 ? "Free" : formatPrice(method.price)}
            </span>
          </div>
        </Label>
      ))}
    </RadioGroup>
  );
}
