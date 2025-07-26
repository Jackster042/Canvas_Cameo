// noinspection TypeScriptValidateTypes

import {getSession} from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
) {
  const session = await getSession();

  if (!session?.idToken) {
    console.error('No session or token found');
    throw new Error("Authentication required");
  }

  // Add token refresh logic
  if (session.expires && new Date(session.expires) < new Date()) {
    console.log('Token expired, attempting refresh...');
    // @ts-ignore
    const newSession = await getSession({ forceRefresh: true });
    if (!newSession?.idToken) {
      throw new Error("Session expired, please re-authenticate");
    }
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${session.idToken}`);
  headers.set('Content-Type', 'application/json');

  try {
    const cleanEndpoint = endpoint.replace(/^\//, '');
    const url = `${API_URL}/${cleanEndpoint}`;

    console.log(`Making request to: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include' // Important for cookies
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Request failed');
    }

    return await response.json();
  } catch (err) {
    // @ts-ignore
    const {message} = err;
    console.error('API request failed:', {
      endpoint,
      error: message
    });
    throw err;
  }
}