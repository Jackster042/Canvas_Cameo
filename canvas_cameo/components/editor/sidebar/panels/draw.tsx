"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { brushSizes, drawingPanelColorPresets } from "@/config";
import {
  toggleDrawingMode,
  toggleEraseMode,
  updateDrawingBrush,
} from "@/fabric/fabric-utils";
import { useEditorStore } from "@/store";
import {
  EraserIcon,
  Eraser,
  Paintbrush,
  Palette,
  PencilIcon,
  Minus,
  Plus,
  Droplets,
} from "lucide-react";
import { useState } from "react";

function DrawPanel() {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  // Drawing properties
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(5);
  const [drawingOpacity, setDrawingOpacity] = useState(100);

  // Drawing tabs
  const [activeTab, setActiveTab] = useState("colors");

  const { canvas } = useEditorStore();

  const handleToggleDrawingMode = () => {
    if (!canvas) return;

    const newMode = !isDrawing;
    setIsDrawing(newMode);

    if (newMode && isErasing) {
      setIsErasing(false);
    }

    // INITIALIZE DRAWING MODE
    toggleDrawingMode({
      canvas,
      isDrawingMode: newMode,
      drawingColor,
      brushWidth,
    });
  };

  const handleDrawingColorChange = (color: string) => {
    setDrawingColor(color);

    if (canvas && isDrawing && !isErasing) {
      updateDrawingBrush({
        canvas,
        properties: { color },
      });
    }
  };

  const handleBrushWidthChange = (width: number) => {
    setBrushWidth(width);

    if (canvas && isDrawing) {
      updateDrawingBrush({
        canvas,
        properties: { width: isErasing ? width * 2 : width },
      });
    }
  };

  const handleDrawingOpacityChange = (value: number) => {
    const opacityValue = Number(value);
    setDrawingOpacity(opacityValue);

    if (canvas && isDrawing) {
      updateDrawingBrush({
        canvas,
        properties: { opacity: opacityValue / 100 },
      });
    }
  };

  const handleToggleErasing = () => {
    if (!canvas && !isDrawing) return;

    const erasingMode = !isErasing;
    setIsErasing(erasingMode);

    toggleEraseMode({
      canvas,
      isErasing: erasingMode,
      previousColor: drawingColor,
      eraseWidth: brushWidth * 2,
    });
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        <Button
          variant={isDrawing ? "default" : "outline"}
          className="w-full group py-6 transition-all cursor-pointer"
          onClick={handleToggleDrawingMode}
        >
          <PencilIcon
            className={`mr-2 w-5 h-5 ${
              isDrawing ? "animate-bounce" : "hover:animate-bounce"
            }`}
          />
          <span className="font-medium">
            {isDrawing ? "Exit Drawing Mode" : "Enter Drawing Mode"}
          </span>
        </Button>
        {/* TABS */}
        {isDrawing && (
          <Tabs
            defaultValue="colors"
            className={"w-full"}
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className={`grid grid-cols-3 mb-4`}>
              <TabsTrigger value="colors">
                <Palette className="w-4 h-4 mr-2" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="brush">
                <Paintbrush className="w-4 h-4 mr-2" />
                Brush
              </TabsTrigger>
              <TabsTrigger value="tools">
                <EraserIcon className="w-4 h-4 mr-2" />
                Tools
              </TabsTrigger>
            </TabsList>

            {/* CONTENT */}
            <TabsContent value="colors">
              <div className="space-y-3">
                <div className="flex justify-between items center">
                  <Label>Color Palette</Label>
                  <div
                    className="w-6 h-6 rounded-full border shadow-sm"
                    style={{ backgroundColor: drawingColor }}
                  />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {drawingPanelColorPresets.map((color) => (
                    <div key={color}>
                      <button
                        className={`w-10 h-10 rounded-full border transition-transform hover:scale-110 ${
                          color === drawingColor
                            ? "ring-1 ring-offset-2 ring-primary"
                            : ""
                        }`}
                        onClick={() => handleDrawingColorChange(color)}
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex mt-5 space-x-2">
                  <div className="relative">
                    <Input
                      type="color"
                      value={drawingColor}
                      onChange={(e) => handleDrawingColorChange(e.target.value)}
                      className={`w-12 h-12 p-1 cursor-pointer`}
                      disabled={isErasing}
                    />
                  </div>
                  <Input
                    type="text"
                    value={drawingColor}
                    onChange={(e) => handleDrawingColorChange(e.target.value)}
                    className={`flex-1`}
                    disabled={isErasing}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="brush" className={`space-y-4`}>
              <div className="space-y-3">
                <Label className={`block text-sm font-semibold`}>
                  Brush Size
                </Label>
                <div className="flex items-center space-x-3">
                  <Minus className="h-4 w-4 text-gray-500" />
                  <Slider
                    min={1}
                    max={30}
                    step={1}
                    value={[brushWidth]}
                    onValueChange={(value) => setBrushWidth(value[0])}
                    className={`flex-1`}
                  />
                  <Plus className="h-4 w-4 text-gray-500" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {brushSizes.map((size) => (
                    <Button
                      key={size.value}
                      variant={
                        size.value === brushWidth ? "default" : "outline"
                      }
                      className={`px-2 py-1`}
                      onClick={() => handleBrushWidthChange(size.value)}
                    >
                      {size.label}
                    </Button>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className={`font-medium`}>
                      <Droplets className="w-4 h-4 mr-2" />
                      Brush Opacity
                    </Label>
                    <span className="text-sm">{drawingOpacity}%</span>
                  </div>
                  <Slider
                    step={1}
                    min={0}
                    max={100}
                    value={[drawingOpacity]}
                    onValueChange={(value) =>
                      handleDrawingOpacityChange(value[0])
                    }
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tools">
              <Button
                variant={isErasing ? "destructive" : "outline"}
                className="w-full group py-6 transition-all"
                onClick={handleToggleErasing}
                size="lg"
              >
                <EraserIcon className="w-4 h-4 mr-2" />
                {isErasing ? "Exit Erasing Mode" : "Enter Erasing Mode"}
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default DrawPanel;
