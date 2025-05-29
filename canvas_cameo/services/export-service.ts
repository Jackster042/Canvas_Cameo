import { Canvas, ImageFormat } from "fabric";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

export function exportAsJson(canvas: Canvas, fileName = "FileName") {
  if (!canvas) return;
  try {
    const canvasData = canvas.toJSON(["id", "filters"]);
    const jsonStringify = JSON.stringify(canvasData, null, 2);
    const canvasJsonBlob = new Blob([jsonStringify], {
      type: "application/json",
    });

    saveAs(canvasJsonBlob, `${fileName}.json`);
  } catch (err) {
    console.error(err, "Error from exportAsJson");
    return null;
  }
}

export function exportAsPng(
  canvas: Canvas,
  fileName = "PNG Filename",
  options?: {}
) {
  if (!canvas) return;

  try {
    const defaultOptions = {
      format: "png" as ImageFormat,
      quality: 1,
      multiplier: 1,
      enableRetinaScaling: true,
      ...options,
    };

    const dataUrl = canvas.toDataURL(defaultOptions);

    saveAs(dataUrl, `${fileName}.png`);
  } catch (err) {
    console.error(err, "Error from exportAsPng");
  }
}

export function exportAsSvg(canvas: Canvas, fileName = "SVG Filename") {
  if (!canvas) return;

  try {
    const svgData = canvas.toSVG();

    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });

    saveAs(blob, `${fileName}.svg`);

    return true;
  } catch (err) {
    console.error(err, "Error from exportAsSvg");
    return false;
  }
}

export function exportAsPdf(
  canvas: Canvas,
  fileName = "PDF Filename",
  options?: {}
) {
  if (!canvas) return;

  try {
    const defaultOptions = {
      format: "a4",
      orientation: "landscape",
      unit: "mm",
      ...options,
    };

    const pdf = new jsPDF(
      defaultOptions.orientation as "landscape" | "p" | "portrait" | "l", // TODO: TYPE GUARD
      defaultOptions.unit as "px" | "in" | "cm" | "mm",
      defaultOptions.format
    );

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const scale =
      Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight) * 0.9; //90% available space

    const x = (pdfWidth - canvasWidth * scale) / 2;
    const y = (pdfHeight - canvasHeight * scale) / 2;

    const imgData = canvas.toDataURL("image/png", 1.0); // TODO: TS TYPE ERROR ?

    pdf.addImage(
      imgData,
      "PNG",
      x,
      y,
      canvasWidth * scale,
      canvasHeight * scale
    );

    pdf.save(`${fileName}.pdf`);

    return true;
  } catch (err) {
    console.error(err, "Error from exportAsPdf");
    return false;
  }
}
