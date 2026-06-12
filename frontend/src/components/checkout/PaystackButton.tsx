"use client";

import { Button } from "@/components/ui/button";
import { paymentsApi } from "@/lib/api";
import toast from "react-hot-toast";

interface PaystackButtonProps {
  orderId: string;
  amount: number;
  email: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        onClose: () => void;
        callback: (response: { reference: string; status: string }) => void;
      }) => { openIframe: () => void };
    };
  }
}

export function PaystackButton({ orderId, amount, email, onSuccess, onError }: PaystackButtonProps) {
  const handlePayment = async () => {
    try {
      const res = await paymentsApi.initializePaystack({
        orderId,
        provider: "paystack",
        callbackUrl: `${window.location.origin}/checkout/success?orderId=${orderId}`,
      }) as { authorizationUrl?: string; data?: { authorizationUrl?: string } };
      const authorizationUrl = res.authorizationUrl || res.data?.authorizationUrl;

      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      }
    } catch {
      toast.error("Payment initialization failed");
      onError?.("Payment initialization failed");
    }
  };

  return (
    <Button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700">
      Pay with Paystack
    </Button>
  );
}
