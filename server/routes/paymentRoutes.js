const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { payOrder } = require("../controllers/paymentController")

router.put("/payorder/:orderId", authMiddleware(['user']), payOrder);

module.exports = router;