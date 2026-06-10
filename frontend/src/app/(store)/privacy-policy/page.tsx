"use client";

import { StoreLayout } from "@/components/layout/StoreLayout";

export default function PrivacyPolicyPage() {
  return (
    <StoreLayout>
      <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16 prose prose-gray dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p className="lead">Last updated: January 2024</p>

        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, including name, email address, phone number, shipping address, and payment information when you make a purchase or create an account.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to process orders, communicate with you about your purchases, send marketing communications (with your consent), and improve our services.</p>

        <h2>3. Information Sharing</h2>
        <p>We do not sell your personal information. We may share information with trusted third parties who assist us in operating our website and processing payments.</p>

        <h2>4. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>

        <h2>5. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information at any time. Contact us to exercise these rights.</p>

        <h2>6. Cookies</h2>
        <p>We use cookies to enhance your browsing experience and analyze site traffic. You can control cookie preferences in your browser settings.</p>

        <h2>7. Contact</h2>
        <p>If you have questions about this Privacy Policy, please contact us at hello@tolumak.com.</p>
      </div>
    </StoreLayout>
  );
}
