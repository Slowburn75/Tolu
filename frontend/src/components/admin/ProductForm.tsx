"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Upload } from "lucide-react";
import { sizes, colors, genders, ageGroups } from "@/lib/constants";
import toast from "react-hot-toast";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().min(0),
  discountPrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().min(0),
  material: z.string().optional(),
  weight: z.string().optional(),
  careInstructions: z.string().optional(),
  categoryId: z.string().min(1),
  brandId: z.string().optional(),
  gender: z.string().optional(),
  ageGroup: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  categories?: { id: string; name: string }[];
  brands?: { id: string; name: string }[];
  onSubmit: (data: FormData) => Promise<void>;
}

export function ProductForm({ defaultValues, categories = [], brands = [], onSubmit }: ProductFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      isFeatured: false, isNewArrival: false, isBestSeller: false, isOnSale: false,
    },
  });

  const [images, setImages] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const mappedKey = key === "isOnSale" ? "isSale" : key;
        formData.append(mappedKey, String(value));
      }
    });
    formData.append("sizes", JSON.stringify(selectedSizes));
    formData.append("colors", JSON.stringify(selectedColors));
    images.forEach((img) => formData.append("images", img));
    if (videoFile) formData.append("video", videoFile);
    await onSubmit(formData);
  };

  const isOnSale = watch("isOnSale");

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input {...register("name")} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>SKU (auto-generated if empty)</Label>
                  <Input placeholder="Leave blank for auto-generate" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Full Description</Label>
                <Textarea {...register("description")} rows={5} />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Pricing & Stock</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Price (₦)</Label>
                  <Input type="number" {...register("price")} />
                </div>
                <div className="space-y-2">
                  <Label>Discount Price</Label>
                  <Input type="number" {...register("discountPrice")} disabled={!isOnSale} />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input type="number" {...register("stock")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Images</h3>
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square bg-muted rounded-md overflow-hidden">
                    <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                    <button type="button" className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5" onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-accent">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">Upload</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setImages((prev) => [...prev, ...files]);
                  }} />
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Video</h3>
              <input
                type="file"
                name="video"
                accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,video/avi,video/mov"
                className="text-sm w-full"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setVideoFile(file);
                }}
              />
              <p className="text-xs text-muted-foreground">Supports MP4, MOV, WebM, and AVI. Max 100MB.</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Organization</h3>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select onValueChange={(v) => setValue("categoryId", v)} defaultValue={defaultValues?.categoryId}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select onValueChange={(v) => setValue("brandId", v)} defaultValue={defaultValues?.brandId}>
                  <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select onValueChange={(v) => setValue("gender", v)} defaultValue={defaultValues?.gender}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    {genders.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Age Group</Label>
                <Select onValueChange={(v) => setValue("ageGroup", v)} defaultValue={defaultValues?.ageGroup}>
                  <SelectTrigger><SelectValue placeholder="Select age group" /></SelectTrigger>
                  <SelectContent>
                    {ageGroups.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Flags</h3>
              {(["isFeatured", "isNewArrival", "isBestSeller", "isOnSale"] as const).map((flag) => (
                <label key={flag} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">
                    {flag === "isFeatured" ? "Featured" : flag === "isNewArrival" ? "New Arrival" : flag === "isBestSeller" ? "Best Seller" : "On Sale"}
                  </span>
                  <Switch checked={watch(flag)} onCheckedChange={(v) => setValue(flag, v)} />
                </label>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button key={size} type="button" onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 text-sm rounded-md border ${selectedSizes.includes(size) ? "bg-primary text-primary-foreground" : "hover:border-primary"}`}
                  >{size}</button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button key={color.hex} type="button" onClick={() => toggleColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColors.includes(color.name) ? "border-primary scale-110" : "border-gray-200"}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Additional Info</h3>
              <div className="space-y-2">
                <Label>Material</Label>
                <Input {...register("material")} />
              </div>
              <div className="space-y-2">
                <Label>Weight</Label>
                <Input {...register("weight")} placeholder="e.g. 500g" />
              </div>
              <div className="space-y-2">
                <Label>Care Instructions</Label>
                <Textarea {...register("careInstructions")} rows={3} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : defaultValues ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
