"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  exportAsJson,
  exportAsPdf,
  exportAsPng,
  exportAsSvg,
} from "@/services/export-service";
import { useEditorStore } from "@/store";
import { FileImage, FileJson, FileIcon, Loader2, Download } from "lucide-react";
import { useState } from "react";

function ExportModal({ isOpen, onClose }) {
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [isExporting, setIsExporting] = useState(false);

  const { canvas } = useEditorStore();

  // CREATE FORMATS
  const exportFormats = [
    {
      id: "png",
      name: "PNG Image",
      icon: FileImage,
      description: "Best for web and social media",
    },
    {
      id: "svg",
      name: "SVG Image",
      icon: FileIcon,
      description: "Scalable vector graphic, best for illustrations",
    },
    {
      id: "pdf",
      name: "PDF Document",
      icon: FileIcon,
      description: "Portable Document Format, ideal for documents",
    },
    {
      id: "json",
      name: "JSON File",
      icon: FileJson,
      description: "JavaScript Object Notation, useful for data interchange",
    },
  ];

  //   EXPORT FILE HANDLING FUNCTION
  const handleExport = async () => {
    if (!canvas) return;
    setIsExporting(true);

    try {
      let successFlag: boolean | null | undefined | void = false;

      switch (selectedFormat) {
        case "png":
          successFlag = exportAsPng(canvas, "PNG Filename");
          break;

        case "svg":
          successFlag = exportAsSvg(canvas, "SVG Filename");
          break;

        case "pdf":
          successFlag = exportAsPdf(canvas, "PDF Filename");
          break;

        case "json":
          successFlag = exportAsJson(canvas, "JSON Filename");
          break;

        default:
          break;
      }

      if (successFlag) {
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (err) {
      console.error(err, "Error from handleExport");
      throw new Error("Error from handleExport");
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={"sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle className={"text-xl"}>Export</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <h3 className="text-sx font-medium mb-3">Choose format</h3>
          <div className="grid grid-cols-2 gap-3">
            {exportFormats.map((exportFormat) => (
              <Card
                key={exportFormat.id}
                className={
                  (cn(
                    "cursor-pointer border transition-colors hover:bg-accent hover:text-accent-foreground"
                  ),
                  selectedFormat === exportFormat.id
                    ? "bg-accent border-primary"
                    : "border-border")
                }
                onClick={() => setSelectedFormat(exportFormat.id)}
              >
                <CardContent
                  className={"flex flex-col items-center text-center p-4"}
                >
                  <exportFormat.icon
                    className={
                      (cn("w-8 h-8 mb-2"),
                      selectedFormat === exportFormat.id
                        ? "text-primary"
                        : "text-muted-foreground")
                    }
                  />
                  <h4 className="font-medium text-sm">{exportFormat.name}</h4>
                  <p className="mt-1 font-medium text-muted-foreground">
                    {exportFormat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* CARD FOOTER CONTENT */}
        <DialogFooter>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full min-w-[120px] bg-purple-700 text-white"
            variant="default"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2" />
                Exporting ...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export {selectedFormat.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExportModal;
