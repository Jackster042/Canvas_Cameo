const SubscriptionModel = require("../models/subscription");
const axios = require("axios");

const PAYPAL_API =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ACCESS TOKEN
async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const response = await axios({
    method: "post",
    url: `${PAYPAL_API}/v1/oauth2/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    data: "grant_type=client_credentials",
  });

  return response.data.access_token;
}

// CREATE ORDER
exports.createOrder = async (req, res, next) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios({
      method: "post",
      url: `${PAYPAL_API}/v2/checkout/orders`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "500",
            },
            description: "Canvas Premium Membership",
          },
        ],
        application_context: {
          return_url: `${FRONTEND_URL}/subscription/success`,
          cancel_url: `${FRONTEND_URL}/subscription/cancel`,
        },
      },
    });

    const order = response.data;
    console.log(order, "ORDER FORM CREATE ORDER - BACKEND");

    const approvalLink = order.links.find(
      (link) => link.rel === "approve"
    ).href;

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        approvalLink,
      },
    });
  } catch (error) {
    console.error(error, "Error from creating paypal order");
    res.status(500).json({
      success: false,
      message: "Error while creating paypal order!",
    });
  }
};

exports.capturePayment = async (req, res, next) => {
  try {
    const { orderId, userId } = req.body;

    const accessToken = await getAccessToken();

    const response = await axios({
      method: "post",
      url: `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = response.data;
    const captureId = captureData.purchase_units[0].payments.captures[0].id;

    let subscription = await SubscriptionModel.findOne({ userId });

    if (!subscription) {
      subscription = new SubscriptionModel({ userId });
    }

    subscription.isPremium = true;
    subscription.premiumSince = new Date();
    subscription.paymentId = captureId;

    await subscription.save();

    res.status(200).json({
      success: true,
      data: {
        isPremium: true,
        paymentId: captureId,
      },
    });
  } catch (error) {
    error(error, "Error trying to capture payment");
    res.status(500).json({
      success: false,
      message: "Error while capturing paypal order",
    });
  }
};
