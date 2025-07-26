import { Canvas } from "fabric";
import { fetchWithAuth } from "./base-service";

interface Design {
  id: string;
  name: string;
  canvasData: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
}

export async function getUserDesigns(): Promise<Design[]> {
  return fetchWithAuth("/v1/designs");
}

export async function getUserDesignsByID(designId: string): Promise<Design> {
  return fetchWithAuth(`/v1/designs/${designId}`);
}

export async function saveDesign(
    designData: Omit<Design, 'id' | 'createdAt' | 'updatedAt'>,
    designId: string | null
): Promise<Design> {
  return fetchWithAuth("/v1/designs", {
    method: designId ? "PUT" : "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...designData,
      designId
    })
  });
}

export async function deleteDesign(designId: string): Promise<void> {
  return fetchWithAuth(`/v1/designs/${designId}`, {
    method: "DELETE"
  });
}

export async function saveCanvasState(
    canvas: Canvas,
    designId: string | null = null,
    title: string = "Untitled Design"
): Promise<Design> {
  if (!canvas) {
    throw new Error("Canvas is required");
  }

  const canvasData = canvas.toJSON(["id", "filters"]);

  const designData = {
    name: title,
    canvasData: JSON.stringify(canvasData),
    width: canvas.width,
    height: canvas.height,
  };

  return saveDesign(designData, designId);
}