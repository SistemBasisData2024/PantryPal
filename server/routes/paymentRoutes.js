const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const { payOrder } = require("../controllers/paymentController")

router.put("/payorder/:orderId", authMiddleware(['user']), payOrder);

module.exports = router;