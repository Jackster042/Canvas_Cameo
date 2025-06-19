const SubscriptionModel = require("../models/subscription");

exports.getSubscription = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    let subscription = await SubscriptionModel.findOne({ userId });
    if (!subscription) {
      subscription = new SubscriptionModel({ userId });
    }

    return res.status(200).json({
      success: true,
      message: "Subscription fetched successfully",
      data: {
        isPremium: subscription.isPremium,
        premiumSince: subscription.premiumSince,
      },
    });
  } catch (err) {
    console.error(err, "Error getting subscription");
    return res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};
