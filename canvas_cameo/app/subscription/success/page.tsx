"use client";

import { capturePaypalOrder } from "@/services/subscription-service";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PaymentProcessor() {
  const router = useRouter();
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("token");

    const processPayment = async () => {
      try {
        if (!orderId) {
          throw new Error("Missing order token");
        }

        const response = await capturePaypalOrder(orderId);

        if (response.success) {
          router.push("/");
        } else {
          throw new Error(response.message || "Payment verification failed");
        }
      } catch (e) {
        setStatus("error");
        setError(e instanceof Error ? e.message : "Unknown error occurred");
        console.error("Payment processing error:", e);
      }
    };

    processPayment();
  }, [router]);

  if (status === "error") {
    return (
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold mb-2 text-red-600">Payment Error</h1>
          <p className="text-muted-foreground mb-4">
            {error || "Failed to process your payment"}
          </p>
          <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
    );
  }

  return (
      <div className="flex flex-col items-center text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
        <p className="text-muted-foreground mb-4">
          Please wait while we confirm your payment
        </p>
      </div>
  );
}

export default function SubscriptionSuccess() {
  return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-lg">
          <Suspense fallback={<div>Loading payment processor...</div>}>
            <PaymentProcessor />
          </Suspense>
        </div>
      </div>
  );
}