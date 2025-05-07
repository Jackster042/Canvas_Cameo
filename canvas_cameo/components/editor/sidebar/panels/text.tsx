"use client";

import { Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextPreset, textPresets } from "@/config";
import { useEditorStore } from "@/store";
import { addTextToCanvas } from "@/fabric/fabric-utils";

function TextPanel() {
  const { canvas } = useEditorStore();

  const handleAddCustomTextBox = () => {
    if (!canvas) return;

    addTextToCanvas({
      canvas,
      text: "Enter Text Here",
      options: { fontSize: 24 },
    });
  };

  const handleAddPresetText = (preset: TextPreset) => {
    if (!canvas) return;

    addTextToCanvas({
      canvas,
      text: preset.text,
      options: preset,
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-auto">
        <Button
          onClick={handleAddCustomTextBox}
          className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center transition-colors"
        >
          <Type className="w-4 h-4 mr-5" />
          <span className="font-medium">Add a text box</span>
        </Button>
      </div>
      <div className="pt-2">
        <h4 className="text-lg font-medium mb-4 text-gray-800 ml-4">
          Default Text Styles
        </h4>
        <div className="space-y-4">
          {textPresets.map((preset, index) => (
            <button
              key={index}
              className="w-full text-left p-3 bg-white border border-gray-200 rounded-md hover:b-gray-50 transition-colors"
              style={{
                fontSize: `${Math.min(preset.fontSize / 1.8, 24)}px`,
                fontWeight: preset.fontWeight,
                fontStyle: preset.fontStyle || "normal",
                fontFamily: preset.fontFamily,
              }}
              onClick={() => handleAddPresetText(preset)}
            >
              {preset.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TextPanel;
