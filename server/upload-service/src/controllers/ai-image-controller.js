const axios = require("axios");
const MediaModel = require("../models/media");

const { uploadMediaToCloudinary } = require("../utils/cloudinary");

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const STABILITY_ENGINE_ID = "stable-diffusion-xl-1024-v1-0";
const STABILITY_API_HOST = "https://api.stability.ai";

const generateImageFromAIAndUploadToDb = async (req, res) => {
  const prompt = req.body.prompt;
  const userId = req.user.userId;

  try {
    const response = await axios.post(
      `${STABILITY_API_HOST}/v1/generation/${STABILITY_ENGINE_ID}/text-to-image`,
      {
        text_prompts: [
          {
            text: prompt,
          },
        ],
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
        cfg_scale: 7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${STABILITY_API_KEY}`,
        },
      }
    );

    const generatedImage = response.data.artifacts[0];
    if (!generatedImage) throw new Error("No image generated");

    const imageBuffer = Buffer.from(generatedImage.base64, "base64");
    console.log(imageBuffer, "Image Buffer");

    const file = {
      buffer: imageBuffer,
      originalname: `${Date.now()}-ai-image.png`,
      mimetype: "image/png",
      size: imageBuffer.length,
      height: 1024,
      width: 1024,
    };

    const cloudinaryResult = await uploadMediaToCloudinary(file);
    const newlyCreatedMedia = new MediaModel({
      userId,
      name: `AI GeneratedImage - ${prompt.substring(0, 50)}${
        prompt.length > 50 ? "..." : ""
      }`,
      cloudinaryId: cloudinaryResult.public_id,
      url: cloudinaryResult.secure_url,
      mimetype: "image/png",
      size: imageBuffer.length,
      height: 1024,
      width: 1024,
    });

    await newlyCreatedMedia.save();

    return res.status(201).json({
      success: true,
      data: newlyCreatedMedia,
      prompt,
      seed: generatedImage.seed,
      message: "AI Generated Image Generated and Uploaded Successfully",
    });
  } catch (err) {
    console.error(err, "Error from generateImageFromAIAndUploadToDb");
    return res.status(500).json({
      success: false,
      message: "Error Generating AI Image",
    });
  }
};

module.exports = { generateImageFromAIAndUploadToDb };
