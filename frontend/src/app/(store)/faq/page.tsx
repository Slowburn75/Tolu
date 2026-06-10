"use client";

import { StoreLayout } from "@/components/layout/StoreLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How do I place an order?", a: "Browse our catalog, select your items, add them to your cart, and proceed to checkout. Follow the prompts to enter your shipping details and payment information." },
  { q: "What payment methods do you accept?", a: "We accept Paystack (cards, bank transfers, USSD), Flutterwave, and direct bank transfers." },
  { q: "How long does delivery take?", a: "Standard delivery takes 5-7 business days. Express delivery takes 1-2 business days. Store pickup is available same day." },
  { q: "Do you offer free shipping?", a: "Yes! We offer free shipping on all orders above ₦50,000." },
  { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy. Items must be unworn, unwashed, and with tags attached." },
  { q: "How do I track my order?", a: "Use our Order Tracking page with your order number. You'll also receive email updates on your order status." },
  { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 24 hours of placement. Contact our support team for assistance." },
  { q: "Do you ship internationally?", a: "Currently we ship within Nigeria only. International shipping will be available soon." },
  { q: "How do I use a coupon code?", a: "Enter your coupon code at checkout in the coupon field. The discount will be applied to your order total." },
  { q: "Is my payment information secure?", a: "Absolutely. We use industry-standard encryption and secure payment gateways to protect your information." },
];

export default function FAQPage() {
  return (
    <StoreLayout>
      <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16">
        <h1 className="text-4xl font-bold font-display mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mb-8">Find answers to common questions</p>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </StoreLayout>
  );
}
