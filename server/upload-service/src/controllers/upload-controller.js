const { uploadMediaToCloudinary } = require("../utils/cloudinary");
const MediaModel = require("../models/media");

// UPLOAD MEDIA
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { originalName, mimetype, size, height, width } = req.file;

    const { userId } = req.user;

    const cloudinaryResult = await uploadMediaToCloudinary(req.file);

    const newlyCreatedMedia = new MediaModel({
      userId,
      name: originalName,
      cloudinaryId: cloudinaryResult.public_id,
      url: cloudinaryResult.secure_url,
      mimetype,
      size,
      width,
      height,
    });

    await newlyCreatedMedia.save();

    return res.status(200).json({
      success: true,
      data: newlyCreatedMedia,
    });
  } catch (err) {
    console.log(err, "Error from UPLOAD MEDIA");
    return res.status(500).json({
      success: false,
      message: "Error creating image",
    });
  }
};

// GET ALL MEDIA FROM A USER
const getAllMediaByUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const medias = await MediaModel.find({ userId }).sort({ createdAt: -1 });
    console.log(medias, "Media from GET ALL MEDIA BY USER");

    return res.status(200).json({
      success: true,
      data: medias,
    });
  } catch (err) {
    console.error(err, "Error from GET ALL MEDIA BY USER");
    return res.status(500).json({
      success: false,
      message: "Error fetching media",
    });
  }
};

module.exports = { uploadMedia, getAllMediaByUser };
