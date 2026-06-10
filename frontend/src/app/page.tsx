"use client";

import { StoreLayout } from "@/components/layout/StoreLayout";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { NewArrivals } from "@/components/home/NewArrivals";
import { BestSellers } from "@/components/home/BestSellers";
import { CollectionSection } from "@/components/home/CollectionSection";
import { SaleSection } from "@/components/home/SaleSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <StoreLayout>
      <HeroBanner />
      <FeaturedCategories />
      <NewArrivals />
      <BestSellers />
      <CollectionSection />
      <SaleSection />
      <WhyChooseUs />
      <CustomerReviews />
      <NewsletterSection />
    </StoreLayout>
  );
}
