"use client";

import { useRef, useState, useEffect } from "react";
import { useEditorStore } from "@/store";
import {
  shapeDefinitions,
  shapeTypes,
} from "@/fabric/shapes/shapes-definitions";
import { StaticCanvas } from "fabric";
import { addShapeToCanvas } from "@/fabric/fabric-utils";

function ElementsPanel() {
  const [isInitialized, setIsInitialized] = useState(false);

  const { canvas } = useEditorStore();

  const miniCanvasRef = useRef<Record<string, StaticCanvas>>({});
  const canvasElementRef = useRef<Record<string, HTMLElement>>({});

  useEffect(() => {
    if (isInitialized) return;

    const timer = setTimeout(async () => {
      try {
        const fabric = await import("fabric");

        for (const shapeType of shapeTypes) {
          const canvasElement = canvasElementRef.current[shapeType];
          if (!canvasElement) continue;
          const canvasId = `mini-canvas-${shapeType}-${Date.now()}`;
          // canvasElementRef.current[shapeType] =
          //   document.createElement("canvas");//TODO: CHECK IF THIS IS NEEDED
          // canvasElementRef.current[shapeType].id = canvasId;
          canvasElement.id = canvasId;

          try {
            const definition =
              shapeDefinitions[shapeType as keyof typeof shapeDefinitions]; // TODO: CHECK FOR TYPE

            const miniCanvas = new fabric.StaticCanvas(canvasId, {
              width: 100,
              height: 100,
              backgroundColor: "transparent",
              renderOnAndRemove: true,
              centeredScaling: true,
              centeredRotation: true,
            });

            miniCanvasRef.current[shapeType] = miniCanvas;
            definition.thumbnail(fabric, miniCanvas);
            miniCanvas.centerObject(miniCanvas.getObjects()[0]); //TODO : ADDED TO CENTER CANVAS OBJECT AFTER ITS ADDED
            miniCanvas.renderAll();
          } catch (definitionError) {
            console.error(
              definitionError,
              "Error while creating definition for shape"
            );
          }
        }
      } catch (err) {
        console.error(err, "Failed to initialize elements panel");
      }
      setIsInitialized(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [isInitialized]);

  useEffect(() => {
    return () => {
      Object.values(miniCanvasRef.current).forEach((miniCanvas) => {
        if (miniCanvas && typeof miniCanvas.dispose === "function") {
          try {
            miniCanvas.dispose();
          } catch (err) {
            console.error(err, "Failed to dispose mini canvas");
          }
        }
      });

      miniCanvasRef.current = {};
      setIsInitialized(false);
    };
  }, []);

  const setCanvasRef = (el: HTMLCanvasElement | null, shapeType: string) => {
    if (el) {
      canvasElementRef.current[shapeType] = el;
    }
  };

  const handleShapeClick = (shapeType: string) => {
    addShapeToCanvas({
      canvas,
      shapeTypes: shapeType,
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <div className="grid grid-cols-3 gap-1">
          {shapeTypes.map((shapeType) => (
            <div
              style={{ height: "90px" }}
              className="cursor-pointer flex flex-col items-center justify-center"
              key={shapeType}
              onClick={() => handleShapeClick(shapeType)}
            >
              <canvas
                width="100"
                height="100"
                ref={(el) => setCanvasRef(el, shapeType)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ElementsPanel;
