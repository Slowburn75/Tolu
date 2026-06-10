"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
}

export function StatsCard({ icon, label, value, trend, trendLabel }: StatsCardProps) {
  const isUp = trend && trend > 0;
  const isDown = trend && trend < 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 text-sm">
                {isUp && <TrendingUp className="h-4 w-4 text-green-500" />}
                {isDown && <TrendingDown className="h-4 w-4 text-red-500" />}
                <span className={cn(isUp && "text-green-600", isDown && "text-red-600")}>
                  {Math.abs(trend)}%
                </span>
                {trendLabel && <span className="text-muted-foreground">{trendLabel}</span>}
              </div>
            )}
          </div>
          <div className="p-3 rounded-lg bg-primary/10 text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
