import { createShape } from "./shapes/shapes-factory";
import { shapeDefinitions } from "./shapes/shapes-definitions";
import { TextPreset } from "@/config";
interface InitializeFabricProps {
  canvasEl: any;
  containerEl: any;
}
``;
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

interface AddShapeToCanvasProps {
  canvas: any;
  shapeTypes: any;
  customProps?: Record<string, any>;
}

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

interface AddTextToCanvasProps {
  canvas: any;
  text: string;
  options: {};
  whiteBackground?: boolean;
  preset?: TextPreset;
}

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
