import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
): Promise<any> {
  try {
    const session = await getSession();

    if (!session?.idToken) {
      throw new Error("No authentication token found");
    }

    // Remove leading slash for consistency
    const normalizedEndpoint = endpoint.startsWith('/')
        ? endpoint.slice(1)
        : endpoint;

    const url = `${API_URL}/${normalizedEndpoint}`;

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${session.idToken}`);
    headers.set('Content-Type', 'application/json');

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error; // Re-throw to let calling code handle it
  }
}