"use client";

import { CreditCard, Landmark, Building2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { paymentMethods } from "@/lib/constants";

interface PaymentMethodProps {
  value: string;
  onChange: (value: string) => void;
}

const icons: Record<string, React.ReactNode> = {
  paystack: <CreditCard className="h-5 w-5" />,
  flutterwave: <Landmark className="h-5 w-5" />,
  bank_transfer: <Building2 className="h-5 w-5" />,
};

export function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
      {paymentMethods.map((method) => (
        <Label
          key={method.id}
          className={cn(
            "flex items-center gap-4 border rounded-lg p-4 cursor-pointer transition-all hover:border-primary",
            value === method.id && "border-primary bg-primary/5"
          )}
        >
          <RadioGroupItem value={method.id} className="mt-0" />
          <div className="flex items-center gap-3 flex-1">
            {icons[method.id]}
            <div>
              <p className="text-sm font-medium">{method.name}</p>
              <p className="text-xs text-muted-foreground">{method.description}</p>
            </div>
          </div>
        </Label>
      ))}
    </RadioGroup>
  );
}
