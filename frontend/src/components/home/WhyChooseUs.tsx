"use client";

import { Truck, Shield, RefreshCw, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", description: "Free shipping on orders above ₦50,000" },
  { icon: Shield, title: "Secure Payment", description: "100% secure payment processing" },
  { icon: RefreshCw, title: "Easy Returns", description: "30-day hassle-free return policy" },
  { icon: Headphones, title: "24/7 Support", description: "Round-the-clock customer support" },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold font-display mb-3">Why Shop with Tolumak?</h2>
          <p className="text-muted-foreground">We provide the best shopping experience</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <Icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
