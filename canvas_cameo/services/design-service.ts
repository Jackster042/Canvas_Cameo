import { fetchWithAuth } from "./base-service";

export async function getUserDesigns() {
  return fetchWithAuth("/v1/designs");
}

export async function getUserDesignsByID(designId: string) {
  return fetchWithAuth(`/v1/designs/${designId}`);
}

export async function saveDesign(designData: any, designId: string | null) {
  return fetchWithAuth("/v1/designs", {
    method: "POST",
    body: {
      ...designData,
      designId,
    },
  });
}

export async function deleteDesign(designId: string) {
  return fetchWithAuth(`/v1/designs/${designId}`, {
    method: "DELETE",
  });
}
