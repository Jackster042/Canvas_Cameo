"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/store";

function Properties() {
  const { canvas } = useEditorStore();

  // ACTIVE OBJECT
  const [selectedObject, setSelectedObject] = useState(null);

  useEffect(() => {
    if (!canvas) return;

    const handleSelectionCreated = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        setSelectedObject(activeObject);
      }
    };
    const handleSelectionCleared = () => {};

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      setSelectedObject(activeObject);
    }

    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:updated", handleSelectionCreated);
    canvas.on("object:modified", handleSelectionCreated);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("selection:created", handleSelectionCreated);
      canvas.off("selection:updated", handleSelectionCreated);
      canvas.off("object:modified", handleSelectionCreated);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [canvas]);

  console.log(selectedObject, "selected object");

  return (
    <div className="fixed right-0 top-[56px] bottom-[0px] w-[280px] bg-white border border-gray-200 z-10">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <span className="font-medium">Properties</span>
        </div>
      </div>
    </div>
  );
}

export default Properties;
