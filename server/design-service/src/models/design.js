const { Schema, model, models } = require("mongoose");

const DesignSchema = new Schema({
  userId: String,
  name: String,
  canvasData: String,
  width: Number,
  height: Number,
  category: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const DesignModel = models.design || model("design", DesignSchema);

module.exports = DesignModel;
