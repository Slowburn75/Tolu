"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function ProductSearch({ onSearch, placeholder = "Search products..." }: ProductSearchProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/shop?search=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        name="search"
        placeholder={placeholder}
        className="pl-10 h-10"
      />
    </form>
  );
}
