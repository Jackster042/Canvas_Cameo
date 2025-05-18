"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/store";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FabricObject } from "fabric";
import { Button } from "@/components/ui/button";
import {
  Copy,
  FlipHorizontal,
  FlipVertical,
  MoveDown,
  MoveUp,
  Trash,
} from "lucide-react";
import {
  cloneSelectedObject,
  deleteSelectedObject,
} from "@/fabric/fabric-utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { fontFamilies } from "@/config";

function Properties() {
  const { canvas } = useEditorStore();

  // ACTIVE OBJECT
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(
    null
  );
  const [objectType, setObjectType] = useState<string>("");

  // TODO:  LIST OF PROPERTIES TO BE ADDED

  // COMMON
  const [opacity, setOpacity] = useState(100);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  //  TEXT
  const [text, setText] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(24);
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [fontWeight, setFontWeight] = useState<string>("normal");
  const [fontStyle, setFontStyle] = useState<string>("normal");
  const [underline, setUnderline] = useState<boolean>(false);
  const [textColor, setTextColor] = useState<string>("#000000");
  const [textBackgroundColor, setTextBackgroundColor] = useState<string>("");
  const [letterSpacing, setLetterSpacing] = useState<number>(0);

  // SHAPES

  // IMAGE

  // ADDITIONAL

  // OPACITY

  const updateObjectProperty = (
    property: string,
    value: number | boolean | string
  ) => {
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

  // DUPLICATE
  const handleDuplicate = async () => {
    if (!canvas || !selectedObject) return;
    await cloneSelectedObject(canvas);
  };

  // DELETE
  const handleDelete = () => {
    if (!canvas || !selectedObject) return;
    deleteSelectedObject(canvas);
  };

  // ARRANGEMENT
  const handleBringToFront = () => {
    if (!canvas || !selectedObject) return;
    canvas.bringObjectToFront(selectedObject);
    canvas.renderAll();
  };
  const handleSendToBack = () => {
    if (!canvas || !selectedObject) return;
    canvas.sendObjectToBack(selectedObject);
    canvas.renderAll();
  };

  // FLIP X & FLIP Y
  const handleFlipObjectX = () => {
    if (!canvas || !selectedObject) return;
    const flipX = !selectedObject.flipX;
    updateObjectProperty("flipX", flipX);
  };
  const handleFlipObjectY = () => {
    if (!canvas || !selectedObject) return;
    const flipY = !selectedObject.flipY;
    updateObjectProperty("flipY", flipY);
  };

  // TEXT HANDLERS
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {};
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    updateObjectProperty("fontFamily", value);
  };
  const handleToggleBold = () => {
    const newWeight = fontWeight === "bold" ? "normal" : "bold";
    setFontWeight(newWeight);
    updateObjectProperty("fontWeight", newWeight);
  };
  const handleToggleItalic = () => {
    const newStyle = fontStyle === "italic" ? "normal" : "italic";
    setFontStyle(newStyle);
    updateObjectProperty("fontStyle", newStyle);
  };
  const handleToggleUnderline = () => {
    const newUnderline = !underline;
    setUnderline(newUnderline);
    updateObjectProperty("underline", newUnderline);
  };
  const handleToggleTextColorChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTextColor = e.target.value;
    setTextColor(newTextColor);
    updateObjectProperty("fill", newTextColor);
  };
  const handleToggleTextBackgroundColorChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTextBgColor = e.target.value;
    setTextBackgroundColor(newTextBgColor);
    updateObjectProperty("backgroundColor", newTextBgColor);
  };
  const handleLetterSpacingChange = (value: number[]) => {
    const newLetterSpacing = value[0];
    setLetterSpacing(newLetterSpacing);
    updateObjectProperty("charSpacing", newLetterSpacing);
  };

  useEffect(() => {
    if (!canvas) return;

    const handleSelectionCreated = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        // console.log(activeObject.type, "active object type");
        setSelectedObject(activeObject);
        // console.log(activeObject, "active object");
        // UPDATE COMMON PROPERTIES
        setOpacity(Math.round(activeObject?.opacity! * 100) || 100);
        setWidth(Math.round(activeObject.width * activeObject.scaleX));
        setHeight(Math.round(activeObject.height * activeObject.scaleY));

        // CHECK BASED ON TYPE
        if (activeObject.type === "i-text") {
          setObjectType("text");
          // console.log(activeObject.type, "object type");
        } else if (activeObject.type === "image") {
          setObjectType("image");
        } else if (activeObject.type === "path") {
          setObjectType("path");
        } else {
          setObjectType("shape");
        }
      }
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
    <div className="fixed right-0 top-[56px] bottom-[0px] w-[280px] bg-white border-1 border-gray-200 z-10">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <span className="font-medium">Properties</span>
        </div>
      </div>
      <div className="h-[calc(100%-96px)] overflow-auto p-4 space-y-6">
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
        {/* FLIP HORIZONTAL AND VERTICAL */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleFlipObjectX}
            variant={"outline"}
            size="sm"
            className={"h-8 text-sm"}
          >
            <FlipHorizontal className="w-4 h-4 mr-1" />
            Flip - X
          </Button>
          <Button
            onClick={handleFlipObjectY}
            variant={"outline"}
            size="sm"
            className={"h-8 text-sm"}
          >
            <FlipVertical className="w-4 h-4 mr-1" />
            Flip - Y
          </Button>
        </div>
        {/* ARRANGEMENT */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-medium">Layer Position</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleBringToFront}
              variant={"outline"}
              size="sm"
              className={"h-8 text-xs"}
            >
              <MoveUp className="w-4 h-4" />
              <span>Bring To Front</span>
            </Button>
            <Button
              onClick={handleSendToBack}
              variant={"outline"}
              size="sm"
              className={"h-8 text-xs"}
            >
              <MoveDown className="w-4 h-4" />
              <span>Send To Back</span>
            </Button>
          </div>
        </div>
        {/* DUPLICATE AND DELETE */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-medium">Duplicate and Delete</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleDuplicate}
              variant={"default"}
              size="sm"
              className={"h-8 text-xs"}
            >
              <Copy className="w-4 h-4" />
              <span>Duplicate</span>
            </Button>
            <Button
              onClick={handleDelete}
              variant={"destructive"}
              size="sm"
              className={"h-8 text-xs"}
            >
              <Trash className="w-4 h-4" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* TEXT RELATED PROPERTIES */}
        {objectType === "text" && (
          <div className="space-y-4 border-t">
            <h3 className="text-sm font-medium">Text Properties</h3>
            {/* TEXT */}
            <div className="space-y-2">
              <Label className={"text-xs"} htmlFor="text-content">
                Text Content
              </Label>
              <Textarea
                id="text-content"
                value={text}
                onChange={handleTextChange}
                className={"h-20 resize-none"}
              />
            </div>
            {/* FONT SIZE */}
            <div className="space-y-2">
              <Label className={"text-xs"} htmlFor="font-size">
                Font Size
              </Label>
              <Input
                id="font-size"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(e)}
                className={"w-16 h-7 text-xs"}
                type={"number"}
              />
            </div>
            {/* FONT FAMILY */}
            <div className="space-y-2">
              <Label htmlFor="font-family" className="text-sm">
                Font Family
              </Label>
              <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                <SelectTrigger className={"h-10"} id="font-family">
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((fontItem) => (
                    <SelectItem
                      key={fontItem}
                      value={fontItem}
                      style={{ fontFamily: fontItem }}
                    >
                      {fontItem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* TOGGLE STYLE */}
            <div className="space-y-2">
              <Label className="text-sm">Style</Label>
              <div className="flex gap-4">
                <Button
                  variant={fontWeight === "bold" ? "default" : "outline"}
                  onClick={handleToggleBold}
                  size="icon"
                  className={"w-12 h-8"}
                >
                  Bold
                </Button>
                <Button
                  variant={fontStyle === "italic" ? "default" : "outline"}
                  onClick={handleToggleItalic}
                  size="icon"
                  className={"w-12 h-8 items-center"}
                >
                  Italic
                </Button>
                <Button
                  variant={underline ? "default" : "outline"}
                  onClick={handleToggleUnderline}
                  size="icon"
                  className={"w-12 h-8 overflow-hidden"}
                >
                  {"______"}
                </Button>
              </div>
            </div>
            <div className="flex justify-between">
              {/* TEXT COLOR AND BG COLOR */}
              <div className="space-y-2">
                <Label htmlFor="text-color" className="text-sm">
                  Text Color
                </Label>
                <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: textColor }}
                  />
                  <Input
                    id="text-color"
                    type="color"
                    value={textColor}
                    onChange={handleToggleTextColorChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="text-bg-color" className="text-sm">
                  Text BG Color
                </Label>
                <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: textBackgroundColor }}
                  />
                  <Input
                    id="text-bg-color"
                    type="color"
                    value={textBackgroundColor}
                    onChange={handleToggleTextBackgroundColorChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            {/* LETTER SPACING */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="letter-spacing" className="text-sm">
                  Letter Spacing
                </Label>
                <span className="text-xs">{letterSpacing}</span>
                <Slider
                  id="letter-spacing"
                  min={-200}
                  max={800}
                  value={[letterSpacing]}
                  onValueChange={(value) => handleLetterSpacingChange(value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Properties;
