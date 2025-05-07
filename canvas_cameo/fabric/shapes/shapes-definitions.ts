export const shapeDefinitions = {
  rectangle: {
    type: "rect",
    label: "rectangle",
    defaultProps: {
      width: 100,
      height: 60,
      fill: "#000000",
    },
    thumbnail: (fabric: any, canvas: any) => {
      const { Rect } = fabric;
      const rect = new Rect({
        left: 15,
        tpo: 35,
        width: 70,
        height: 35,
        fill: "#000000",
      });
      canvas.add(rect);
    },
  },
  circle: {
    type: "circle",
    label: "Circle",
    defaultProps: {
      radius: 50,
      fill: "#000000",
    },
    thumbnail: (fabric: any, canvas: any) => {
      const { Circle } = fabric;
      const circle = new Circle({
        left: 20,
        top: 20,
        radius: 30,
        fill: "#000000",
      });
      canvas.add(circle);
    },
  },
  triangle: {
    type: "triangle",
    label: "Triangle",
    defaultProps: {
      width: 100,
      height: 100,
      fill: "#000000",
    },
    thumbnail: (fabric: any, canvas: any) => {
      const { Triangle } = fabric;
      const triangle = new Triangle({
        left: 20,
        top: 20,
        width: 70,
        height: 70,
        fill: "#000000",
      });
      canvas.add(triangle);
    },
  },
};

export const shapeTypes = ["rectangle", "circle", "triangle"];
