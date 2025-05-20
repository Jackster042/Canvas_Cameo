"use client";

import * as fabric from "fabric";

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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fontFamilies } from "@/config";

function Properties() {
  const { canvas, markAsModified } = useEditorStore();

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
  const [fillColor, setFillColor] = useState<string>("#ffffff");
  const [borderColor, setBorderColor] = useState<string>("#000000");
  const [borderWidth, setBorderWidth] = useState<number>(0);
  const [borderStyle, setBorderStyle] = useState<string>("solid");

  // IMAGE
  const [filter, setFilter] = useState<string>("");
  const [blur, setBlur] = useState<number>(0);

  // ADDITIONAL

  // OPACITY

  const updateObjectProperty = (
    property: string,
    // value: number | boolean | string
    value: any
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
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    updateObjectProperty("text", newText);
  };
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFontSize = Number(e.target.value);
    setFontSize(newFontSize);
    updateObjectProperty("fontSize", newFontSize);
  };
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

  // SHAPE HANDLERS
  const handleFillColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFillColor = e.target.value;
    setFillColor(newFillColor);
    updateObjectProperty("fill", newFillColor);
  };
  const handleBorderColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBorderColor = e.target.value;
    setBorderColor(newBorderColor);
    updateObjectProperty("stroke", newBorderColor);
  };
  const handleBorderWidthChange = (value: number[]) => {
    const newBorderWidth = value[0];
    setBorderWidth(newBorderWidth);
    updateObjectProperty("strokeWidth", newBorderWidth);
  };
  const handleBorderStyleChange = (value: string) => {
    setBorderStyle(value);

    let strokeDashArray = null;

    if (value === "dashed") {
      strokeDashArray = [5, 5];
    } else if (value === "dotted") {
      strokeDashArray = [2, 2];
    }

    updateObjectProperty("strokeDashArray", strokeDashArray);
  };

  // IMAGE HANDLERS
  function isFabricImage(obj: fabric.Object | undefined): obj is fabric.Image {
    return obj?.type === "image";
  }
  const handleImageFilterChange = async (value: string) => {
    setFilter(value);
    console.log(value, "CHECKING VALUE");
    if (!canvas || !selectedObject || !isFabricImage(selectedObject)) return; //TODO: CHECK THIS FOR TYPE SAFETY
    try {
      canvas.discardActiveObject();

      const { filters } = await import("fabric");

      const image = selectedObject as fabric.Image;
      image.filters = [];

      switch (value) {
        case "grayscale":
          selectedObject.filters.push(new filters.Grayscale());

          break;
        case "sepia":
          selectedObject.filters.push(new filters.Sepia());

          break;
        case "invert":
          selectedObject.filters.push(new filters.Invert());

          break;
        case "blur":
          selectedObject.filters.push(new filters.Blur({ blur: blur / 100 }));

          break;
        case "none":
        default:
          break;
      }

      selectedObject.applyFilters();

      canvas.setActiveObject(selectedObject);
      canvas.renderAll();
      markAsModified();
    } catch (err) {
      console.error(err, "Error from handleImageFilterChange");
    }
  };
  const handleBlurChange = async (value: number[]) => {
    const newBlur = value[0];
    setBlur(newBlur);
    if (
      !canvas ||
      !selectedObject ||
      !isFabricImage(selectedObject) ||
      filter !== "blur"
    )
      return;

    try {
      const { filters } = await import("fabric");

      selectedObject.filters = [new filters.Blur({ blur: newBlur / 100 })];
      selectedObject.applyFilters();
      canvas.renderAll();
      markAsModified();
    } catch (err) {
      console.error(err, "Error from handleBlurChange");
    }
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
          setText(activeObject.text || "");
          setFontSize(activeObject.fontSize || 24);
          setFontFamily(activeObject.fontFamily || "Arial");
          setFontWeight(activeObject.fontWeight || "normal");
          setFontStyle(activeObject.fontStyle || "normal");
          setUnderline(activeObject.underline || false);
          setTextColor(activeObject.fill || "#000000");
          setTextBackgroundColor(activeObject.backgroundColor || "");
          setLetterSpacing(activeObject.charSpacing || 0);
        } else if (activeObject.type === "image") {
          setObjectType("image");

          if (activeObject.filters && activeObject.filters.length > 0) {
            const filterObj = activeObject.filters[0];
            if (filterObj.type === "Grayscale") setFilter("grayscale");
            else if (filterObj.type === "Sepia") setFilter("sepia");
            else if (filterObj.type === "Invert") setFilter("invert");
            else if (filterObj.type === "Blur") {
              setFilter("blur");
              setBlur(filterObj.blur * 100 || 0);
            } else setFilter("none");
          }

          if (activeObject.strokeDashArray) {
            if (
              activeObject.strokeDashArray[0] === 5 &&
              activeObject.strokeDashArray[1] === 5
            ) {
              setBorderStyle("dashed");
            } else if (
              activeObject.strokeDashArray[0] === 2 &&
              activeObject.strokeDashArray[1] === 2
            ) {
              setBorderStyle("dotted");
            } else {
              setBorderStyle("solid");
            }
          }
        } else if (activeObject.type === "path") {
          setObjectType("path");

          if (activeObject.strokeDashArray) {
            if (
              activeObject.strokeDashArray[0] === 5 &&
              activeObject.strokeDashArray[1] === 5
            ) {
              setBorderStyle("dashed");
            } else if (
              activeObject.strokeDashArray[0] === 2 &&
              activeObject.strokeDashArray[1] === 2
            ) {
              setBorderStyle("dotted");
            } else {
              setBorderStyle("solid");
            }
          }
        } else {
          setObjectType("shape");

          if (activeObject.fill && typeof activeObject.fill === "string") {
            setFillColor(activeObject.fill);
          }

          if (activeObject.strokeDashArray) {
            if (
              activeObject.strokeDashArray[0] === 5 &&
              activeObject.strokeDashArray[1] === 5
            ) {
              setBorderStyle("dashed");
            } else if (
              activeObject.strokeDashArray[0] === 2 &&
              activeObject.strokeDashArray[1] === 2
            ) {
              setBorderStyle("dotted");
            } else {
              setBorderStyle("solid");
            }
          }
        }
      }
    };
    const handleSelectionCleared = () => {};

    const activeObject = canvas.getActiveObject();
    console.log(activeObject, "active object");
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
  console.log(objectType, "object type");

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
            <div className="space-y-2 pt-2 border-t">
              <div className="flex justify-between">
                <Label htmlFor="letter-spacing" className={"text-xs"}>
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

        {/* SHAPE RELATED PROPERTIES */}
        {objectType === "shape" && (
          <div className="space-y-4 p-4 border-t">
            <h3 className="text-sm font-medium">Shape Properties</h3>
            {/* FILL COLOR AND BORDER COLOR */}
            <div className="flex justify-between">
              <div className="space-y-2">
                <Label htmlFor="fill-color" className="text-xs">
                  Fill Color
                </Label>
                <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: fillColor }}
                  >
                    <Input
                      id="fill-color"
                      type="color"
                      value={fillColor}
                      onChange={handleFillColorChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="border-color" className="text-xs">
                  Border Color
                </Label>
                <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: borderColor }}
                  >
                    <Input
                      id="border-color"
                      type="color"
                      value={borderColor}
                      onChange={handleBorderColorChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* BORDER WIDTH */}
            <div className="space-y-2">
              <Label htmlFor="border-width" className="text-xs">
                Border Width
              </Label>
              <span className="text-xs mb-2">{borderWidth}%</span>
              <Slider
                id="border-width"
                min={0}
                max={100}
                step={1}
                value={[borderWidth]}
                onValueChange={(e) => handleBorderWidthChange(e)}
              />
            </div>
            {/* BORDER STYLE */}
            <div className="space-y-2">
              <Label htmlFor="border-style" className={"text-xs"}>
                Border Style
              </Label>
              <Select
                value={borderStyle}
                onValueChange={handleBorderStyleChange}
              >
                <SelectTrigger id="border-style" className={"h-10"}>
                  <SelectValue placeholder="Select border style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* IMAGE RELATED PROPERTIES */}
        {objectType === "image" && (
          <div className="space-y-4 p-4 border-t">
            <h3 className="text-sm font-medium">Image Properties</h3>
            <div className="space-y-2">
              <Label htmlFor="border-color" className="text-xs">
                Border Color
              </Label>
              <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: borderColor }}
                />
                <Input
                  id="fill-color"
                  type="color"
                  value={borderColor}
                  onChange={handleBorderColorChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="border-width" className={"text-xs"}>
                Border Width
              </Label>
              <span className={"text-xs mb-2"}>{borderWidth}%</span>
              <Slider
                id="border-width"
                min={0}
                max={20}
                step={1}
                value={[borderWidth]}
                onValueChange={(value) => handleBorderWidthChange(value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="border-style" className={"text-xs"}>
                Border Style
              </Label>
              <Select
                value={borderStyle}
                onValueChange={handleBorderStyleChange}
              >
                <SelectTrigger id="border-style" className={"h-10"}>
                  <SelectValue placeholder="Select Border Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter" className={"text-xs"}>
                Filter
              </Label>
              <Select value={filter} onValueChange={handleImageFilterChange}>
                <SelectTrigger id="filter" className={"h-10"}>
                  <SelectValue placeholder="Select Image Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="grayscale">Grayscale</SelectItem>
                  <SelectItem value="sepia">Sepia</SelectItem>
                  <SelectItem value="invert">Invert</SelectItem>
                  <SelectItem value="blur">Blur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filter === "blur" && (
              <div className="space-y-2">
                <div className="flex justify-between mb-4">
                  <Label htmlFor="blur" className="text-xs">
                    Blur Amount
                  </Label>
                  <span className="font-medium text-xs">{blur}%</span>
                </div>
                <Slider
                  id="blur"
                  min={0}
                  max={100}
                  step={1}
                  value={[blur]}
                  onValueChange={(value) => handleBlurChange(value)}
                />
              </div>
            )}
          </div>
        )}

        {/* PATH RELATED PROPERTIES */}
        {objectType === "path" && (
          <div className="space-y-4 p-4 border-t">
            <h3 className="text-sm font-medium">Path Properties</h3>
            <div className="space-y-2">
              <Label htmlFor="border-color" className="text-xs">
                Border Color
              </Label>
              <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: borderColor }}
                />
                <Input
                  id="fill-color"
                  type="color"
                  value={borderColor}
                  onChange={handleBorderColorChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="border-width" className={"text-xs"}>
                Border Width
              </Label>
              <span className={"text-xs mb-2"}>{borderWidth}%</span>
              <Slider
                id="border-width"
                min={0}
                max={20}
                step={1}
                value={[borderWidth]}
                onValueChange={(value) => handleBorderWidthChange(value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="border-style" className={"text-xs"}>
                Border Style
              </Label>
              <Select
                value={borderStyle}
                onValueChange={handleBorderStyleChange}
              >
                <SelectTrigger id="border-style" className={"h-10"}>
                  <SelectValue placeholder="Select Border Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Properties;
