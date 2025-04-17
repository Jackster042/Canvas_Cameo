const { Schema, model, models } = require("mongoose");

const MediaSchema = new Schema({
  userId: String,
  name: String,
  cloudinaryId: String,
  url: String,
  mimetype: String,
  size: Number,
  width: Number,
  height: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  //   update at ??
});

const MediaModel = models.media || model("media", MediaSchema);

module.exports = MediaModel;
