"use client";

import { StoreLayout } from "@/components/layout/StoreLayout";

export default function AboutPage() {
  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16">
        <h1 className="text-4xl font-bold font-display mb-6">About Tolumak</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Tolumak is a premier fashion destination dedicated to bringing you the finest in contemporary style.
            We curate collections that blend sophistication with everyday wearability, ensuring every piece
            in your wardrobe reflects your unique personality.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-muted rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                To make premium fashion accessible to everyone. We believe that style should never be compromised,
                and everyone deserves to look and feel their best.
              </p>
            </div>
            <div className="bg-muted rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground">
                To become Africa&apos;s most trusted fashion destination, setting the standard for quality,
                style, and customer experience in the continent.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-4">Our Story</h2>
          <p className="text-muted-foreground">
            Founded with a passion for fashion and a commitment to quality, Tolumak has grown from a small
            boutique to a leading online fashion destination. We partner with trusted brands and artisans to
            bring you collections that are carefully curated for the modern African wardrobe.
          </p>
          <p className="text-muted-foreground">
            Every item we sell is selected with care, ensuring it meets our standards for quality, style, and
            value. We&apos;re not just selling clothes - we&apos;re helping you express your unique style.
          </p>

          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="text-center"><div className="text-4xl font-bold text-primary mb-2">5000+</div><p className="text-muted-foreground">Happy Customers</p></div>
            <div className="text-center"><div className="text-4xl font-bold text-primary mb-2">10000+</div><p className="text-muted-foreground">Products Delivered</p></div>
            <div className="text-center"><div className="text-4xl font-bold text-primary mb-2">100+</div><p className="text-muted-foreground">Partner Brands</p></div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
