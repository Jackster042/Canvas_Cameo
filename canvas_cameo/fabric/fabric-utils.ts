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
