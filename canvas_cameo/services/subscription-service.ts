import { fetchWithAuth } from "./base-service";

interface Subscription {
  // Define your subscription interface
  id: string;
  status: string;
  // ... other fields
}

interface PayPalOrder {
  id: string;
  status: string;
  // ... other fields
}

export async function getUserSubscription(): Promise<Subscription> {
  return fetchWithAuth("/v1/subscription");
}

export async function createPaypalOrder(): Promise<PayPalOrder> {
  return fetchWithAuth("/v1/subscription/create-order", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function capturePaypalOrder(orderId: string): Promise<PayPalOrder> {
  return fetchWithAuth("/v1/subscription/capture-order", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ orderId })
  });
}