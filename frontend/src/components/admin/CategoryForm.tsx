"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

interface CategoryFormProps {
  defaultValues?: z.infer<typeof categorySchema>;
  categories?: { id: string; name: string }[];
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export function CategoryForm({ defaultValues, categories = [], onSubmit }: CategoryFormProps) {
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues || { name: "", description: "", parentId: "" },
  });

  const handleFormSubmit = async (data: z.infer<typeof categorySchema>) => {
    const payload = Object.fromEntries(Object.entries(data).filter(([, value]) => Boolean(value)));
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input {...register("name")} />
      </div>
      <div className="space-y-2">
        <Label>Parent Category</Label>
        <Select onValueChange={(v) => setValue("parentId", v)} defaultValue={defaultValues?.parentId}>
          <SelectTrigger><SelectValue placeholder="None (top level)" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea {...register("description")} rows={3} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : defaultValues ? "Update Category" : "Create Category"}
      </Button>
    </form>
  );
}
