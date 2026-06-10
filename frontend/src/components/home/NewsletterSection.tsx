"use client";

import { useState } from "react";
import { Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterApi } from "@/lib/api";
import toast from "react-hot-toast";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await newsletterApi.subscribe(email);
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch {
      toast.error("Subscription failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold font-display text-white mb-3">
          Stay in the Loop
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
          Subscribe to our newsletter for exclusive offers, new arrivals, and fashion inspiration.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/60" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 bg-white text-foreground border-0"
              required
            />
          </div>
          <Button type="submit" variant="secondary" className="h-12 px-6" disabled={loading}>
            <Send className="h-4 w-4 mr-2" />
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
