import { getSession } from "next-auth/react";
import { fetchWithAuth } from "./base-service";
import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:5000";

export async function uploadFileWithAuth(file: File, metaData = {}) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized access");

  const formData = new FormData();
  formData.append("file", file);

  Object.entries(metaData).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  try {
    const response = await axios.post(`${API_URL}/v1/media/upload`, formData, {
      headers: {
        Authorization: `Bearer ${session.idToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response, "response from uploadFileWithAuth");

    return response.data;
  } catch (err) {
    console.error(err, "Error from uploadFileWithAuth");
    throw new Error("Error from uploadFileWithAuth");
  }
}

export async function generateImageFromAI(prompt: any) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized access");

  try {
    const response = await fetchWithAuth(`/v1/media/ai-image-generate`, {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: {
        "Content-Type": "application/json", // ✅ This is critical
      },
    });

    return response;
  } catch (err) {
    console.error(err, "Error from generateImageFromAI");
    throw new Error("Error from generateImageFromAI");
  }
}
