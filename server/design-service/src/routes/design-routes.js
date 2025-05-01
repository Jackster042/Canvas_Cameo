const express = require("express");

// CONTROLLERS
const designController = require("../controllers/design-controller");
const authenticatedRequest = require("../middlewares/auth-middleware");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticatedRequest);

router.get("/", designController.getUserDesigns);
router.post("/", designController.saveDesign);
router.get("/:id", designController.getUserDesignsById);
router.delete("/:id", designController.deleteDesign);

module.exports = router;
