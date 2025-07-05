"use client";

import { error } from "console";
import React, { useEffect, useRef, useState } from "react";

import { StaticCanvas } from "fabric";

const DesignPreview = ({ design }) => {
  const [canvasId] = useState(`canvas-${design._id}-${Date.now()}`);
  const fabricCanvasRef = useRef<StaticCanvas | null>(null);
  useEffect(() => {
    // if (!design.canvasData) return;

    const timer = setTimeout(async () => {
      try {
        if (
          fabricCanvasRef.current &&
          typeof fabricCanvasRef.current === "function"
        ) {
          try {
            (fabricCanvasRef.current as StaticCanvas).dispose();
            fabricCanvasRef.current = null;
          } catch (err) {
            console.error(err, "Error while disposing canvas");
          }
        }

        const fabric = await import("fabric");
        const canvasElement = document.getElementById(canvasId);

        if (!canvasElement) return;

        const designPreviewCanvas = new fabric.StaticCanvas(canvasId, {
          width: 300,
          height: 300,
          renderOnAddRemove: true,
        });

        fabricCanvasRef.current = designPreviewCanvas;

        let canvasData;

        try {
          canvasData =
            typeof design.canvasData === "string"
              ? JSON.parse(design.canvasData)
              : design.canvasData;
        } catch (innerErr) {
          console.error(innerErr, "Error from parsing canvas");
          return;
        }

        if (
          canvasData === undefined ||
          canvasData === null ||
          canvasData?.objects?.length === 0
        ) {
          designPreviewCanvas.backgroundColor = "#21f365";
          designPreviewCanvas.requestRenderAll();
          return;
        }

        // RENDER BG
        if (canvasData.background) {
          designPreviewCanvas.backgroundColor === canvasData.background;
          designPreviewCanvas.requestRenderAll();
        }

        // RENDER CONTENT

        designPreviewCanvas.loadFromJSON(canvasData, () => {
          designPreviewCanvas.requestRenderAll();
        });
      } catch (err) {
        console.error(err, "Error from initCanvas");
      }
    }, 100);

    //  CLEAR CANVAS
    return () => {
      clearTimeout(timer);
      if (
        !fabricCanvasRef.current &&
        typeof fabricCanvasRef.current === "function"
      ) {
        try {
          (fabricCanvasRef.current as StaticCanvas).dispose();
          fabricCanvasRef.current = null;
        } catch (err) {
          console.error(err, "Error while disposing canvas");
        }
      }
    };
  }, [design?._id, canvasId]);

  return (
    <canvas
      id={canvasId}
      width={300}
      height={300}
      className="w-full h-full object-contain"
    />
  );
};

export default DesignPreview;
