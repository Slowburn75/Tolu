"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { reviewsApi } from "@/lib/api";
import toast from "react-hot-toast";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("tolumak-auth") : null;
    if (!token) {
      toast.error("Please login to submit a review");
      return;
    }
    setLoading(true);
    try {
      await reviewsApi.createReview({ productId, rating, comment });
      toast.success("Review submitted! It will appear after approval.");
      setRating(0);
      setComment("");
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-6">
      <h3 className="font-semibold text-lg">Write a Review</h3>
      <div>
        <span className="text-sm font-medium block mb-2">Rating</span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHover(i + 1)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(i + 1)}
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-all",
                  (hover || rating) > i ? "fill-foreground text-foreground" : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <span className="text-sm font-medium block mb-2">Review</span>
        <Textarea
          placeholder="Share your thoughts about this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
