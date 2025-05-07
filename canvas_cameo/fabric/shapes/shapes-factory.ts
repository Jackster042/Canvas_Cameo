interface CreateShapeProps {
  fabric: any;
  type: string;
  shapeDefinitions: any;
  customProps?: Record<string, any>;
}

export const createShape = ({
  fabric,
  type,
  shapeDefinitions,
  customProps = {},
}: CreateShapeProps) => {
  const definition = shapeDefinitions[type as keyof typeof shapeDefinitions];
  if (!definition) return null;

  const props = {
    ...definition.defaultProps,
    ...customProps,
  };

  switch (definition.type) {
    case "rect":
      return new fabric.Rect(props);
    case "circle":
      return new fabric.Circle(props);
    case "triangle":
      return new fabric.Triangle(props);
    default:
      return null;
  }
};
