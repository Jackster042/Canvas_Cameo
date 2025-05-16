"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/store";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FabricObject } from "fabric";

function Properties() {
  const { canvas } = useEditorStore();

  // ACTIVE OBJECT
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(
    null
  );

  // TODO:  LIST OF PROPERTIES TO BE ADDED

  // COMMON
  const [opacity, setOpacity] = useState(100);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  //  TEXT

  // SHAPES

  // IMAGE

  // ADDITIONAL

  // OPACITY

  const updateObjectProperty = (property: string, value: number) => {
    // console.log(property, value, "property and value");
    if (!canvas || !selectedObject) return;

    selectedObject.set(property, value);
    canvas.renderAll();
  };

  const handleOpacityChange = (value: number[]) => {
    // console.log(value, "VALUE FROM OPACITY");
    const newValue = value[0];
    setOpacity(newValue);
    updateObjectProperty("opacity", newValue / 100);
  };

  useEffect(() => {
    if (!canvas) return;

    const handleSelectionCreated = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        setSelectedObject(activeObject);
      }
      // console.log(activeObject, "active object");

      setOpacity(Math.round(activeObject?.opacity! * 100) || 100);
      setWidth(Math.round(activeObject.width * activeObject.scaleX));
      setHeight(Math.round(activeObject.height * activeObject.scaleY));
      // UPDATE COMMON PROPERTIES
    };
    const handleSelectionCleared = () => {};

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      // setSelectedObject(activeObject); // TODO: ERROR
      handleSelectionCreated();
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

  // console.log(selectedObject, "selected object");

  return (
    <div className="fixed right-0 top-[56px] bottom-[0px] w-[280px] bg-white border border-gray-200 z-10">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <span className="font-medium">Properties</span>
        </div>
      </div>
      <div className="h-[calc(100% - 96px)] overflow-auto p-4 space-y-6">
        <h3 className="text-sm font-medium">Size & Position</h3>
        {/* WIDTH AND HEIGHT PROPERTY */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className={"text-xs"}>Width</Label>
            <div className="h-9 px-3 py-2 border rounded-md flex items-center">
              {width}
            </div>
          </div>
          <div className="space-y-1">
            <Label className={"text-xs"}>Height</Label>
            <div className="h-9 px-3 py-2 border rounded-md flex items-center">
              {height}
            </div>
          </div>
        </div>
        {/* OPACITY PROPERTY */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="opacity" className={"text-xs"}>
              Opacity
            </Label>
            <span>{opacity}%</span>
          </div>
          <Slider
            id="opacity"
            min={0}
            max={100}
            step={1}
            value={[opacity]}
            onValueChange={handleOpacityChange} // excepts a function that takes an array of numbers as an argument
          />
        </div>
      </div>
    </div>
  );
}

export default Properties;
