"use client";

// LIBRARIES
import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";

// STORE
import { useEditorStore } from "@/store";

// FABRIC
import { customizeBoundingBox, initializeFabric } from "@/fabric/fabric-utils";

function Canvas() {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const initAttemptedRef = useRef(false);

  const { setCanvas, markAsModified } = useEditorStore();

  useEffect(() => {
    // CLEANUP CANVAS
    const cleanupCanvas = () => {
      if (fabricCanvasRef.current) {
        // REMOVE EVENT LISTENERS
        try {
          fabricCanvasRef?.current?.off("object:added");
          fabricCanvasRef?.current?.off("object:modified");
          fabricCanvasRef?.current?.off("object:removed");
          fabricCanvasRef.current?.off("path:created");
        } catch (err) {
          console.error(err, "failed to remove event listeners");
        }

        try {
          (fabricCanvasRef.current as any).dispose();
        } catch (err) {
          console.error(err, "failed to cleanup canvas");
        }

        fabricCanvasRef.current = null;
        setCanvas(null);
      }
    };

    cleanupCanvas();

    // RESET INIT FLAG
    initAttemptedRef.current = false;

    // INIT CANVAS
    const initCanvas = async () => {
      if (
        typeof window === undefined ||
        !canvasRef.current ||
        initAttemptedRef.current
      ) {
        return;
      }
      initAttemptedRef.current = true;

      try {
        const fabricCanvas = await initializeFabric({
          canvasEl: canvasRef.current,
          containerEl: canvasContainerRef.current,
        });

        if (!fabricCanvas) {
          console.error("Failed to initialize canvas");
          return;
        }

        fabricCanvasRef.current = fabricCanvas;

        // SET CANVAS IN STORE
        setCanvas(fabricCanvas);
        console.log("canvas initialized");

        // TODO: APPLY CUSTOM STYLES FOR THE CONTROLS
        customizeBoundingBox(fabricCanvas);

        // TODO: ADD EVENT LISTENERS FOR THE CANVAS

        // IMPLEMENT AUTO-SAVE FEATURE AND SAVE UPDATED CANVAS
        const handleCanvasChange = () => {
          markAsModified();
          console.log("canvas changed || path changed");
        };

        fabricCanvas.on("object:added", handleCanvasChange);
        fabricCanvas.on("object:modified", handleCanvasChange);
        fabricCanvas.on("object:removed", handleCanvasChange);
        fabricCanvas.on("path:created", handleCanvasChange);
      } catch (err) {
        console.error(err, "Error initializing canvas");
      }
    };

    const timer = setTimeout(() => {
      initCanvas();
    }, 50);

    return () => {
      clearTimeout(timer);
      cleanupCanvas();
    };
  }, []);

  return (
    <div
      className="relative w-full h-[600px] overflow-auto"
      ref={canvasContainerRef}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}

export default Canvas;
