const express = require("express");
const router = express.Router();

const authenticatedRequest = require("../middlewares/auth-middleware");
const subscriptionController = require("../controllers/subscription-controller");
const paymentController = require("../controllers/payment-controller");

router.use(authenticatedRequest);

router.get("/", subscriptionController.getSubscription);
router.post("/create-order", paymentController.createOrder);
router.post("/capture-order", paymentController.capturePayment);

module.exports = router;
