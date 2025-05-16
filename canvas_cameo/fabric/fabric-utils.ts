import { createShape } from "./shapes/shapes-factory";
import { shapeDefinitions } from "./shapes/shapes-definitions";
import { TextPreset } from "@/config";

// INTERFACE
interface InitializeFabricProps {
  canvasEl: any;
  containerEl: any;
}

interface AddShapeToCanvasProps {
  canvas: any;
  shapeTypes: any;
  customProps?: Record<string, any>;
}

interface AddTextToCanvasProps {
  canvas: any;
  text: string;
  options: {};
  whiteBackground?: boolean;
  preset?: TextPreset;
}

interface ToggleDrawingModeProps {
  canvas: any;
  isDrawingMode: boolean;
  drawingColor?: string;
  brushWidth: number;
}

interface ToggleEraseModeProps {
  canvas: any;
  isErasing: boolean;
  previousColor?: string;
  eraseWidth?: number;
}

interface UpdateDrawingBrushProps {
  canvas: any;
  properties: {
    color?: string;
    width?: number;
    opacity?: number;
  };
}

interface AddImageToCanvasProps {
  canvas: any;
  imageUrl: string;
}

// interface CloneSelectedObjectProps {
//   canvas: any;
//   getActiveObject?: () => any;
//   add?: (object: any) => void;
//   renderAll?: () => void;
// }

// FUNCTIONS
export const initializeFabric = async ({
  canvasEl,
  containerEl,
}: InitializeFabricProps) => {
  try {
    const { Canvas, PencilBrush } = await import("fabric");

    const canvas = new Canvas(canvasEl, {
      preserveObjectStacking: true,
      isDrawingMode: false,
      renderOnAddRemove: true,
    });

    // INITIALIZE BRUSH
    const brush = new PencilBrush(canvas);
    brush.color = "#000000";
    brush.width = 5;

    // ADD BRUSH TO CANVAS
    canvas.freeDrawingBrush = brush;

    return canvas;
  } catch (error) {
    console.error(error, "failed to load Fabric");
    return null;
  }
};

export const centerCanvas = (canvas: any) => {
  if (!canvas || !canvas.wrapperEl) return;

  const canvasWrapper = canvas.wrapperEl as HTMLElement;

  canvasWrapper.style.width = `${canvas.width}px`;
  canvasWrapper.style.height = `${canvas.height}px`;

  canvasWrapper.style.position = "absolute";
  canvasWrapper.style.top = "50%";
  canvasWrapper.style.left = "50%";
  canvasWrapper.style.transform = "translate(-50%, -50%)";
};

export const addShapeToCanvas = async ({
  canvas,
  shapeTypes,
  customProps = {},
}: AddShapeToCanvasProps) => {
  if (!canvas) return;

  try {
    const fabricModule = await import("fabric");
    const shape = createShape({
      fabric: fabricModule,
      type: shapeTypes,
      shapeDefinitions,
      customProps: {
        left: 100,
        right: 100,
        ...customProps,
      },
    });

    if (shape) {
      shape.id = `${shapeTypes}-${Date.now()}`;
      canvas.add(shape);
      canvas.renderAll();
      canvas.setActiveObject(shape);
      return shape;
    }
  } catch (err) {
    console.error(err, "failed to add shape to canvas");
    return;
  }
};

export const addTextToCanvas = async ({
  canvas,
  text,
  options,
  whiteBackground = false,
}: AddTextToCanvasProps) => {
  if (!canvas) return;

  try {
    const { IText } = await import("fabric");

    const defaultProps = {
      left: 100,
      right: 100,
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#000000",
      padding: whiteBackground ? 10 : 0,
      textAlign: "left",
      id: `text-${Date.now()}`,
    };

    const textObj = new IText(text, {
      ...defaultProps,
      ...options,
    });

    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();

    return textObj;
  } catch (err) {
    console.error(err, "failed to add text to canvas");
    return null;
  }
};

export const toggleDrawingMode = ({
  canvas,
  isDrawingMode,
  drawingColor = "#000000",
  brushWidth = 5,
}: ToggleDrawingModeProps) => {
  if (!canvas) return;

  try {
    canvas.isDrawingMode = isDrawingMode;
    if (isDrawingMode) {
      canvas.freeDrawingBrush.color = drawingColor;
      canvas.freeDrawingBrush.width = brushWidth;
    }

    return true;
  } catch (err) {
    console.error(err, "failed to toggle drawing mode");
    return false;
  }
};

export const toggleEraseMode = ({
  canvas,
  isErasing,
  previousColor = "#000000",
  eraseWidth = 20,
}: ToggleEraseModeProps) => {
  if (!canvas || !canvas.freeDrawingBrush) return false;

  try {
    if (isErasing) {
      canvas.freeDrawingBrush.color = "#ffffff";
      canvas.freeDrawingBrush.width = eraseWidth;
    } else {
      canvas.freeDrawingBrush.color = previousColor;
      canvas.freeDrawingBrush.width = 5;
    }

    return true;
  } catch (err) {
    console.error(err, "failed to toggle erase mode");
    return false;
  }
};

export const updateDrawingBrush = ({
  canvas,
  properties,
}: UpdateDrawingBrushProps) => {
  if (!canvas || !canvas.freeDrawingBrush) return false;

  try {
    const { color, width, opacity } = properties;

    if (color !== undefined) {
      canvas.freeDrawingBrush.color = color;
    }

    if (width !== undefined) {
      canvas.freeDrawingBrush.width = width;
    }

    if (opacity !== undefined) {
      canvas.freeDrawingBrush.opacity = opacity;
    }
    return true;
  } catch (err) {
    console.error(err, "failed to update drawing brush");
    return false;
  }
};

export const addImageToCanvas = async ({
  canvas,
  imageUrl,
}: AddImageToCanvasProps) => {
  if (!canvas) return;

  try {
    const { Image: FabricImage } = await import("fabric");

    // CREATE IMAGE OBJECT
    let imageObject = new Image();
    imageObject.crossOrigin = "Anonymous";
    imageObject.src = imageUrl;

    return new Promise((resolve, reject) => {
      imageObject.onload = () => {
        let image = new FabricImage(imageObject);
        image.set({
          id: `image-${Date.now()}`,
          top: 100,
          left: 100,
          padding: 10,
          cornerSize: 10,
        });

        const maxDimension = 400;

        if (image.width > maxDimension || image.height > maxDimension) {
          if (image.width > image.height) {
            const scale = maxDimension / image.width;
            image.scale(scale);
          } else {
            const scale = maxDimension / image.height;
            image.scale(scale);
          }
        }

        canvas.add(image);
        canvas.renderAll();
        canvas.setActiveObject(image);
        resolve(image);
      };

      imageObject.onerror = () => {
        reject(new Error("Failed to load image", { cause: imageUrl }));
      };
    });
  } catch (err) {
    console.error(err, "failed to add image to canvas");
    return null; // TODO : DIFF BETWEEN NULL AND FALSE RETURN
  }
};

export const cloneSelectedObject = async (canvas: any) => {
  // TODO: CHECK TYPES FOR THIS FUNCTION
  if (!canvas) return;

  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  try {
    const cloneObject = await activeObject.clone();
    cloneObject.set({
      id: `${activeObject.id || "object"}-${Date.now()}`,
      top: activeObject.top + 10,
      left: activeObject.left + 10,
    });

    canvas.add(cloneObject);
    canvas.renderAll();

    return cloneObject;
  } catch (err) {
    console.error(err, "failed to clone selected object");
    return null;
  }
};

export const deleteSelectedObject = async (canvas: any) => {
  if (!canvas) return;

  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  try {
    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.renderAll();

    return true;
  } catch (err) {
    console.error(err, "failed to delete selected object");
    return null;
  }
};
