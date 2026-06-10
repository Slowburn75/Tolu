"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const couponSchema = z.object({
  code: z.string().min(3),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().min(1),
  minOrderAmount: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  usageLimit: z.coerce.number().min(0).optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional(),
});

interface CouponFormProps {
  defaultValues?: z.infer<typeof couponSchema>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export function CouponForm({ defaultValues, onSubmit }: CouponFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: defaultValues || { code: "", type: "percentage", value: 0, isActive: true },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Code</Label>
          <Input {...register("code")} placeholder="e.g. WELCOME20" />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select onValueChange={(v) => setValue("type", v as "percentage" | "fixed")} defaultValue={defaultValues?.type || "percentage"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Value</Label>
          <Input type="number" {...register("value")} />
        </div>
        <div className="space-y-2">
          <Label>Min Order (₦)</Label>
          <Input type="number" {...register("minOrderAmount")} />
        </div>
        <div className="space-y-2">
          <Label>Max Discount (₦)</Label>
          <Input type="number" {...register("maxDiscount")} />
        </div>
        <div className="space-y-2">
          <Label>Usage Limit</Label>
          <Input type="number" {...register("usageLimit")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Expiry Date</Label>
        <Input type="date" {...register("expiresAt")} />
      </div>
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm font-medium">Active</span>
        <Switch defaultChecked={defaultValues?.isActive ?? true} onCheckedChange={(v) => setValue("isActive", v)} />
      </label>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : defaultValues ? "Update Coupon" : "Create Coupon"}
      </Button>
    </form>
  );
}
