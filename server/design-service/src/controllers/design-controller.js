const DesignModel = require("../models/design");

exports.getUserDesigns = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    console.log(userId, "userId from GET USER DESIGNS CONTROLLER ");

    const designs = await DesignModel.find({ userId }).sort({ createdAt: -1 }); // most recent one

    return res.status(200).json({
      success: true,
      message: "Designs fetched successfully",
      data: designs,
    });
  } catch (err) {
    console.error(err, "Error fetching designs");
    res.status(500).json({
      success: false,
      message: "Failed to fetch designs",
    });
  }
};

exports.getUserDesignsById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const designId = req.params.id;
    console.log(userId, "userId from GET USER DESIGNS BY ID CONTROLLER ");
    console.log(designId, "designId from GET USER DESIGNS BY ID CONTROLLER ");

    const design = await DesignModel.findOne({ _id: designId, userId });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Design fetched successfully",
      data: design,
    });
  } catch (err) {
    console.error(err, "Error fetching designs by id");
    res.status(500).json({
      success: false,
      message: "Failed to fetch designs by id",
    });
  }
};

exports.saveDesign = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { designId, name, canvasData, width, height, category } = req.body;

    if (designId) {
      const design = await DesignModel.findOne({ _id: designId, userId });
      if (!design) {
        return res.status(404).json({
          success: false,
          message: "Design not found",
        });
      }

      if (name) design.name = name;
      if (canvasData) design.canvasData = canvasData;
      if (width) design.width = width;
      if (height) design.height = height;
      if (category) design.category = category;

      design.updatedAt = Date.now();

      const updatedDesign = await design.save();

      return res.status(200).json({
        success: true,
        message: "Design updated successfully",
        data: updatedDesign,
      });
    } else {
      const newDesign = new DesignModel({
        userId,
        name: name || "Untitled Design",
        width,
        height,
        canvasData,
        category,
      });

      const saveDesign = await newDesign.save();

      return res.status(201).json({
        success: true,
        message: "Design saved successfully",
        data: saveDesign,
      });
    }
  } catch (err) {
    console.error(err, "Error saving designs");
    res.status(500).json({
      success: false,
      message: "Failed to save designs",
    });
  }
};

exports.deleteDesign = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const designId = req.params.id;

    const design = await DesignModel.findOne({ _id: designId, userId });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    await DesignModel.deleteOne({ _id: designId });

    return res.status(200).json({
      success: true,
      message: "Design deleted successfully",
    });
  } catch (err) {
    console.error(err, "Error deleting designs");
    res.status(500).json({
      success: false,
      message: "Failed to delete designs",
    });
  }
};
