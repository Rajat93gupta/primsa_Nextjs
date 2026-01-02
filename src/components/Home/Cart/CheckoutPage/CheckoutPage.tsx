/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CheckoutPage = ({ amount }: { amount: number }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!amount) return;

    const fetchClientSecret = async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const err =
            (data && data.error) || `Request failed with status ${res.status}`;
          setErrorMessage(err);
          return;
        }

        if (!data || !data.clientSecret) {
          setErrorMessage("No clientSecret returned from server");
          return;
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("fetchClientSecret error", err);
        setErrorMessage("Failed to load payment");
      }
    };

    fetchClientSecret();
  }, [amount]);

  // Payment form is rendered inside <Elements> so hooks like useStripe/useElements
  // must be used in a child component that is wrapped by Elements.
  const PaymentForm = ({ amount }: { amount: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("handleSubmit start", { stripe, elements, clientSecret });

      if (!stripe || !elements || !clientSecret) {
        setErrorMessage("Payment initialization failed");
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      try {
        const result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/success`,
          },
          redirect: "if_required",
        });

        console.log("confirmPayment result", result);

        if (result.error) {
          setErrorMessage(result.error.message || "Payment failed");
          setLoading(false);
          return;
        }

        // result may contain paymentIntent when no redirect required
        const pi = (result as any).paymentIntent;
        console.log("paymentIntent", pi);
        // if (pi) {
        //   const params = `?payment_intent=${encodeURIComponent(pi.id)}`;
        //   if (pi.status === "succeeded" || pi.status === "requires_capture") {
        //     router.push(`/success${params}`);
        //     return;
        //   }

        //   if (pi.status === "processing") {
        //     router.push(`/success${params}`);
        //     return;
        //   }
        // }
        if (pi) {
          try {
            // create server-side order from the user's cart
            await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ stripePaymentId: pi.id }),
            });
          } catch (err) {
            console.error("create order API failed", err);
            // continue to redirect even if order creation failed, but you could surface error
          }

          const params = `?payment_intent=${encodeURIComponent(pi.id)}`;
          if (
            pi.status === "succeeded" ||
            pi.status === "requires_capture" ||
            pi.status === "processing"
          ) {
            router.push(`/success${params}`);
            return;
          }
        }

        // If we reach here, no error but also no final paymentIntent - stop loading
        setLoading(false);
      } catch (err) {
        console.error("confirmPayment threw", err);
        setErrorMessage("Payment failed unexpectedly");
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <PaymentElement />
        </div>

        <Button
          type="submit"
          disabled={!stripe || loading || !clientSecret}
          className="w-full"
        >
          {loading
            ? "Processing payment..."
            : `Pay $${(amount / 100).toFixed(2)}`}
        </Button>

        {errorMessage && (
          <p className="text-red-500 text-sm text-center">{errorMessage}</p>
        )}
      </form>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {!clientSecret ? (
        errorMessage ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-red-500">{errorMessage}</p>
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading payment form...</p>
          </div>
        )
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm amount={amount} />
        </Elements>
      )}
    </div>
  );
};

export default CheckoutPage;
