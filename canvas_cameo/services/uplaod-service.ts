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

    return response.data;
  } catch (err) {
    console.error(err, "Error from uploadFileWithAuth");
    throw new Error("Error from uploadFileWithAuth");
  }
}

// export async function getAllUserMedia() {
//   const session = await getSession();
//   console.log(session, "Session from getAllUserMedia");
//   if (!session) throw new Error("Unauthorized access");

//   try {
//     const response = await axios.get(`${API_URL}/api/media/get`, {
//       headers: {
//         Authorization: `Bearer ${session.idToken}`,
//       },
//     });
//     console.log(response, "Response from getAllUserMedia");
//     return response.data;
//   } catch (err) {
//     console.error(err, "Error from getAllUserMedia");
//     throw new Error("Error from getAllUserMedia");
//   }
// }
