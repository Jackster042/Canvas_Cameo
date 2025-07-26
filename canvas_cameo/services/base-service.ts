import { getSession } from "next-auth/react";
import axios, {AxiosRequestConfig, AxiosHeaders, AxiosError, RawAxiosRequestHeaders} from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized access");

  try {
    const headers: RawAxiosRequestHeaders = {
      Authorization: `Bearer ${session.idToken}`,
      ...((options.headers as Record<string, string>) || {}),
    };

    // Remove leading slash from endpoint if it exists
    const cleanEndpoint = endpoint.startsWith("/")
        ? endpoint.slice(1)
        : endpoint;

    const config: AxiosRequestConfig = {
      url: `${API_URL}/${cleanEndpoint}`,
      method: options.method || "GET",
      headers,
      data: options.body,
      params: (options as any).params,
    };

    const response = await axios(config);
    return response.data;
  } catch (err) {
    console.error(err, "Error fetching data");
    throw new Error("API request failed");
  }
}