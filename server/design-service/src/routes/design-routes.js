const express = require("express");

// CONTROLLERS
const designController = require("../controllers/design-controller");
const authenticatedRequest = require("../middlewares/auth-middleware");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticatedRequest);

router.get("/", designController.getUserDesigns);
router.get("/search", designController.searchDesigns);
router.post("/", designController.saveDesign);
router.get("/:id", designController.getUserDesignsById);
router.delete("/:id", designController.deleteDesign);

module.exports = router;

// Add this to your design-controller.js
exports.searchDesigns = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { q } = req.query;

    if (!q || typeof q !== "string" || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchRegex = new RegExp(q, "i"); // Case-insensitive search

    const designs = await DesignModel.find({
      userId,
      $or: [
        { name: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
      ],
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: "Designs fetched successfully",
      data: designs,
    });
  } catch (err) {
    console.error(err, "Error searching designs");
    res.status(500).json({
      success: false,
      message: "Failed to search designs",
    });
  }
};
