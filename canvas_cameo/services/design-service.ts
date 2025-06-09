import { Canvas } from "fabric";
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

export async function saveCanvasState(
  canvas: Canvas,
  designId = null,
  title = "Untitled Design"
) {
  if (!canvas) return false;

  try {
    const canvasData = canvas.toJSON(["id", "filters"]);

    const designData = {
      name: title,
      canvasData: JSON.stringify(canvasData),
      width: canvas.width,
      height: canvas.height,
    };

    return saveDesign(designData, designId);
  } catch (error) {
    console.error("Error saving canvas state:", error);
    throw error;
  }
}
