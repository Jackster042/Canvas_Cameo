const express = require("express");
const multer = require("multer");
const router = express.Router();

const authenticatedRequest = require("../middlewares/auth-middleware");

const {
  uploadMedia,
  getAllMediaByUser,
} = require("../controllers/upload-controller");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
}).single("file");

router.get("/get", authenticatedRequest, getAllMediaByUser);
router.post(
  "/upload",
  authenticatedRequest,
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      } else if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }
      next();
    });
  },
  uploadMedia
);

module.exports = router;
