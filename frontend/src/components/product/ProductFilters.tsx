"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { categories, colors, sizes, genders, ageGroups } from "@/lib/constants";
import type { ProductFilters as ProductFiltersType } from "@/types";

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onChange: (filters: ProductFiltersType) => void;
}

export function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 500000]);

  const updateFilter = (key: keyof ProductFiltersType, value: unknown) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onChange(updated);
  };

  const clearAll = () => {
    const cleared: ProductFiltersType = {};
    setLocalFilters(cleared);
    setPriceRange([0, 500000]);
    onChange(cleared);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearAll} className="h-auto p-0 text-primary">
          Clear All
        </Button>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={localFilters.category === cat.slug}
                onCheckedChange={() => updateFilter("category", localFilters.category === cat.slug ? undefined : cat.slug)}
              />
              <span className="text-sm">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Gender</h4>
        <div className="space-y-2">
          {genders.map((g) => (
            <label key={g.value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={localFilters.gender === g.value}
                onCheckedChange={() => updateFilter("gender", localFilters.gender === g.value ? undefined : g.value)}
              />
              <span className="text-sm">{g.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Age Group</h4>
        <div className="space-y-2">
          {ageGroups.map((a) => (
            <label key={a.value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={localFilters.ageGroup === a.value}
                onCheckedChange={() => updateFilter("ageGroup", localFilters.ageGroup === a.value ? undefined : a.value)}
              />
              <span className="text-sm">{a.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Price Range</h4>
        <div className="px-2">
          <Slider
            min={0}
            max={500000}
            step={1000}
            value={priceRange}
            onValueChange={(val) => {
              setPriceRange(val);
              updateFilter("minPrice", val[0]);
              updateFilter("maxPrice", val[1]);
            }}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm">₦{priceRange[0].toLocaleString()}</span>
            <span className="text-sm">₦{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Color</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.hex}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                localFilters.colors?.includes(color.name)
                  ? "border-primary scale-110"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              onClick={() => {
                const current = localFilters.colors || [];
                const updated = current.includes(color.name)
                  ? current.filter((c) => c !== color.name)
                  : [...current, color.name];
                updateFilter("colors", updated.length ? updated : undefined);
              }}
            />
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              className={`px-3 py-1.5 text-sm rounded-md border transition-all ${
                localFilters.sizes?.includes(size)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:border-primary"
              }`}
              onClick={() => {
                const current = localFilters.sizes || [];
                const updated = current.includes(size)
                  ? current.filter((s) => s !== size)
                  : [...current, size];
                updateFilter("sizes", updated.length ? updated : undefined);
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={localFilters.isOnSale || false}
            onCheckedChange={(checked) => updateFilter("isOnSale", checked || undefined)}
          />
          <span className="text-sm">On Sale</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={localFilters.isNewArrival || false}
            onCheckedChange={(checked) => updateFilter("isNewArrival", checked || undefined)}
          />
          <span className="text-sm">New Arrivals</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={localFilters.isBestSeller || false}
            onCheckedChange={(checked) => updateFilter("isBestSeller", checked || undefined)}
          />
          <span className="text-sm">Best Sellers</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-64 shrink-0">
        <FilterContent />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="lg:hidden gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
