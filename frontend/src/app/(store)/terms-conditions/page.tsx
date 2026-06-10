"use client";

import { StoreLayout } from "@/components/layout/StoreLayout";

export default function TermsPage() {
  return (
    <StoreLayout>
      <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16 prose prose-gray dark:prose-invert max-w-none">
        <h1>Terms & Conditions</h1>
        <p className="lead">Last updated: January 2024</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using Tolumak, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.</p>

        <h2>2. Account Registration</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>

        <h2>3. Products and Pricing</h2>
        <p>We strive to display accurate product information and pricing. Prices are subject to change without notice. We reserve the right to cancel orders containing pricing errors.</p>

        <h2>4. Orders</h2>
        <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order.</p>

        <h2>5. Intellectual Property</h2>
        <p>All content on this website, including images, text, and logos, is the property of Tolumak and protected by copyright laws.</p>

        <h2>6. Limitation of Liability</h2>
        <p>Tolumak shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>

        <h2>7. Changes</h2>
        <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.</p>
      </div>
    </StoreLayout>
  );
}
