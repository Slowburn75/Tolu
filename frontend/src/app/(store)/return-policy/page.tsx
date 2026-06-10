"use client";

import { StoreLayout } from "@/components/layout/StoreLayout";

export default function ReturnPolicyPage() {
  return (
    <StoreLayout>
      <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16 prose prose-gray dark:prose-invert max-w-none">
        <h1>Return Policy</h1>
        <p className="lead">Last updated: January 2024</p>

        <h2>30-Day Return Policy</h2>
        <p>We want you to love your purchase. If you&apos;re not completely satisfied, you can return your items within 30 days of delivery for a full refund or exchange.</p>

        <h2>Return Conditions</h2>
        <ul>
          <li>Items must be unworn, unwashed, and in original condition</li>
          <li>All tags must be attached</li>
          <li>Footwear must be returned in the original box</li>
          <li>Sale items are final sale unless otherwise stated</li>
        </ul>

        <h2>How to Return</h2>
        <ol>
          <li>Contact our customer service team to initiate a return</li>
          <li>Pack your items securely in the original packaging</li>
          <li>Include your order number and return reason</li>
          <li>Ship the package to the address provided by our team</li>
        </ol>

        <h2>Refunds</h2>
        <p>Refunds will be processed within 5-7 business days after we receive your return. Refunds are issued to the original payment method.</p>

        <h2>Exchanges</h2>
        <p>For exchanges, please indicate the desired item during the return process. We will ship the exchange item once the return is received.</p>

        <h2>Shipping Costs</h2>
        <p>Return shipping costs are the responsibility of the customer unless the return is due to our error or a defective product.</p>

        <h2>Damaged or Defective Items</h2>
        <p>If you receive a damaged or defective item, please contact us immediately for a full refund or replacement, including return shipping costs.</p>
      </div>
    </StoreLayout>
  );
}
