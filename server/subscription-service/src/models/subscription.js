const { Schema, model, models } = require("mongoose");

const SubscriptionSchema = new Schema({
  userId: String,
  isPremium: {
    type: Boolean,
    default: false,
  },
  paymentId: String,
  premiumSince: Date,
  createAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// PRE SAVE.
SubscriptionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const SubscriptionModel =
  models.subscription || model("subscription", SubscriptionSchema);

module.exports = SubscriptionModel;
