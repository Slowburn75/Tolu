"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div>
      <span className="text-sm font-medium mb-2 block">Quantity</span>
      <div className="flex items-center border rounded-md w-32">
        <button
          className={cn(
            "p-2 hover:bg-accent transition-colors rounded-l-md",
            value <= min && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => value > min && onChange(value - 1)}
          disabled={value <= min}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="flex-1 text-center font-medium text-sm">{value}</span>
        <button
          className={cn(
            "p-2 hover:bg-accent transition-colors rounded-r-md",
            value >= max && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => value < max && onChange(value + 1)}
          disabled={value >= max}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
