"use client";

import { useState } from "react";
import { Check, Palette, Plus } from "lucide-react";
import { colorPresets } from "@/config";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store";
import { centerCanvas } from "@/fabric/fabric-utils";

function SettingsPanel() {
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const { canvas, markAsModified } = useEditorStore();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(e.target.value);
  };

  const handleApplyChanges = () => {
    if (!canvas) return;
    canvas.set("backgroundColor", backgroundColor);
    canvas.renderAll();

    centerCanvas(canvas);

    markAsModified();
  };

  const handleColorPresetApply = (color: string) => {
    setBackgroundColor(color);
  };

  return (
    <div className="p-4 space-x-6">
      <div className="flex items-center space-x-2 mb-4">
        <Palette className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Choose Background Color</h3>
      </div>
      <div className="space-x-2">
        <div className="grid grid-cols-6 gap-2 mb-3">
          {colorPresets.map((color) => (
            <TooltipProvider key={color}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`w-8 h-8 rounded-md border transition-transform hover:scale-110 duration-300 
                    ${
                      color === backgroundColor
                        ? "ring-2 ring-offset-2 ring-primary"
                        : ""
                    }
                  `}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorPresetApply(color)}
                  >
                    {color === backgroundColor && (
                      <Check className="w-4 h-4 text-white mx-auto drop-shadow-md" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{color}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        <div className="flex mt-3 space-x-2">
          <div className="relative">
            <Input
              type="color"
              value={backgroundColor}
              onChange={handleColorChange}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={backgroundColor}
              onChange={handleColorChange}
              className="flex-1"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <Separator className="my-4" />

        <Button
          variant="outline"
          className="w-full"
          onClick={handleApplyChanges}
        >
          Apply Changes
        </Button>
      </div>
    </div>
  );
}

export default SettingsPanel;
