"use client";

import { Button } from "@/components/ui/button";
import { paymentsApi } from "@/lib/api";
import toast from "react-hot-toast";

interface FlutterwaveButtonProps {
  orderId: string;
  amount: number;
  email: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    FlutterwaveCheckout: (config: {
      public_key: string;
      tx_ref: string;
      amount: number;
      currency: string;
      payment_options: string;
      customer: { email: string; name: string };
      callback: (response: { status: string; transaction_id: string }) => void;
      onclose: () => void;
    }) => void;
  }
}

export function FlutterwaveButton({ orderId, amount, email, onSuccess, onError }: FlutterwaveButtonProps) {
  const handlePayment = async () => {
    try {
      const res = await paymentsApi.initializeFlutterwave({
        orderId,
        provider: "flutterwave",
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
    <Button onClick={handlePayment} className="w-full bg-blue-600 hover:bg-blue-700">
      Pay with Flutterwave
    </Button>
  );
}
