"use client";

import { cn } from "@/lib/utils";
import { colors as colorOptions } from "@/lib/constants";

interface ColorSelectorProps {
  selectedColor?: string;
  onSelect: (color: string) => void;
}

export function ColorSelector({ selectedColor, onSelect }: ColorSelectorProps) {
  return (
    <div>
      <span className="text-sm font-medium mb-2 block">
        Color: <span className="text-muted-foreground font-normal">{selectedColor || "Select"}</span>
      </span>
      <div className="flex flex-wrap gap-2">
        {colorOptions.map((color) => (
          <button
            key={color.hex}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-all",
              selectedColor === color.name
                ? "border-primary scale-110 ring-2 ring-primary/20"
                : "border-gray-200 hover:border-gray-400"
            )}
            style={{ backgroundColor: color.hex }}
            title={color.name}
            onClick={() => onSelect(color.name)}
          />
        ))}
      </div>
    </div>
  );
}
