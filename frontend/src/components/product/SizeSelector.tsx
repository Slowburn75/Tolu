"use client";

import { cn } from "@/lib/utils";
import { sizes } from "@/lib/constants";

interface SizeSelectorProps {
  selectedSize?: string;
  onSelect: (size: string) => void;
  availableSizes?: string[];
}

export function SizeSelector({ selectedSize, onSelect, availableSizes = sizes }: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Size</span>
        <button className="text-sm text-primary hover:underline">Size Guide</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {availableSizes.map((size) => (
          <button
            key={size}
            className={cn(
              "w-12 h-10 text-sm font-medium rounded-md border transition-all",
              selectedSize === size
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:border-primary"
            )}
            onClick={() => onSelect(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
