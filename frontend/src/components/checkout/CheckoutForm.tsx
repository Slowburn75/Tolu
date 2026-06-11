"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressForm, type AddressFormData } from "@/components/checkout/AddressForm";
import { DeliveryMethod } from "@/components/checkout/DeliveryMethod";
import { PaymentMethod } from "@/components/checkout/PaymentMethod";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaystackButton } from "@/components/checkout/PaystackButton";
import { FlutterwaveButton } from "@/components/checkout/FlutterwaveButton";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/hooks/useAuth";
import { ordersApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { deliveryMethods } from "@/lib/constants";
import toast from "react-hot-toast";

const steps = ["Shipping", "Delivery", "Payment", "Review"];

export function CheckoutForm() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<AddressFormData | null>(null);
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("paystack");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeItems = items.filter((i) => !i.savedForLater);
  const subtotal = getSubtotal();
  const shipping = deliveryMethods.find((d) => d.id === delivery)?.price || 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await ordersApi.createOrder({
        items: activeItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
        shippingAddress: address,
        paymentMethod: payment,
        deliveryMethod: delivery,
      }) as { data: { id: string } };
      setOrderId(res.data.id);

      if (payment === "bank_transfer") {
        toast.success("Order placed! Awaiting payment confirmation.");
        clearCart();
        router.push(`/checkout/success?orderId=${res.data.id}`);
      }
    } catch {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    router.push(`/checkout/success?orderId=${orderId}`);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "flex items-center gap-2",
                i <= step ? "text-primary" : "text-muted-foreground"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  i < step ? "bg-primary text-primary-foreground" :
                  i === step ? "bg-primary text-primary-foreground" :
                  "bg-muted"
                )}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className="text-sm font-medium hidden sm:block">{s}</span>
              </div>
              {i < steps.length - 1 && <div className="w-8 sm:w-16 h-px bg-muted mx-2" />}
            </div>
          ))}
        </div>

        <div>
          {step === 0 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
              <AddressForm onSubmit={(data) => { setAddress(data); setStep(1); }} defaultValues={address || undefined} />
            </div>
          )}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-6">Delivery Method</h2>
              <DeliveryMethod value={delivery} onChange={setDelivery} />
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)}>Continue to Payment</Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
              <PaymentMethod value={payment} onChange={setPayment} />
              {payment === "bank_transfer" && (
                <div className="bg-muted rounded-lg p-4 mt-4 space-y-2">
                  <h4 className="font-medium text-sm">Bank Transfer Details</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>Bank: GTBank</p>
                    <p>Account Name: Tolumak Fashion Store</p>
                    <p>Account Number: 0123456789</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Please use your order number as the transfer reference.</p>
                </div>
              )}
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Review Order</Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
              <div className="space-y-4 border rounded-lg p-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping To</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{address?.fullName}</p>
                    <p>{address?.street}, {address?.city}</p>
                    <p>{address?.state}, {address?.country}</p>
                    <p>{address?.phone}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Delivery: {deliveryMethods.find(d => d.id === delivery)?.name}</h3>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Payment: {payment === "paystack" ? "Paystack" : payment === "flutterwave" ? "Flutterwave" : "Bank Transfer"}</h3>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                {payment === "bank_transfer" ? (
                  <Button onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? "Processing..." : "Place Order"}
                  </Button>
                ) : payment === "paystack" && orderId ? (
                  <PaystackButton orderId={orderId} amount={total} email={user?.email || ""} onSuccess={handlePaymentSuccess} />
                ) : payment === "flutterwave" && orderId ? (
                  <FlutterwaveButton orderId={orderId} amount={total} email={user?.email || ""} onSuccess={handlePaymentSuccess} />
                ) : (
                  <Button onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <OrderSummary
          items={activeItems}
          subtotal={subtotal}
          shipping={shipping}
          discount={0}
          total={total}
          onPlaceOrder={handlePlaceOrder}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
