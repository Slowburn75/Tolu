"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.user?.avatar} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getInitials(review.user?.name || "Anonymous")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{review.user?.name || "Anonymous"}</p>
            <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              )}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2">
          {review.images.map((img, i) => (
            <img key={i} src={img} alt="Review" className="w-16 h-16 object-cover rounded-md" />
          ))}
        </div>
      )}
    </div>
  );
}
