// const SubscriptionModel = require("../models/subscription");
// const axios = require("axios");

exports.createOrder = async (req, res, next) => {
  console.log("Creating order");
  res.send("Create Order");
};

exports.capturePayment = async (req, res, next) => {
  console.log("Capturing payment");
  res.send("Capture Payment");
};
