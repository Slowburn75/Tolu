"use client";

import { useState } from "react";
import { Tag, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cartApi } from "@/lib/api";
import toast from "react-hot-toast";

interface CouponInputProps {
  onApply?: (code: string) => void;
  onRemove?: () => void;
  appliedCode?: string;
}

export function CouponInput({ onApply, onRemove, appliedCode }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      await cartApi.applyCoupon(code);
      toast.success("Coupon applied!");
      onApply?.(code);
      setCode("");
    } catch {
      toast.error("Invalid or expired coupon");
    } finally {
      setLoading(false);
    }
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between bg-green-50 dark:bg-green-950 border border-green-200 rounded-md p-3">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">{appliedCode}</span>
        </div>
        <button onClick={onRemove} className="text-green-600 hover:text-green-800">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="pl-10"
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
        />
      </div>
      <Button variant="outline" onClick={handleApply} disabled={loading || !code.trim()}>
        Apply
      </Button>
    </div>
  );
}
