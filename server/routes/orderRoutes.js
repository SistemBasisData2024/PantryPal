const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  makeOrder,
  cancelOrder,
  getOrders,
  getSupplierOrders,
  getOrderAddress,
  acceptOrder,
  deliverOrder,
  completeOrder
} = require("../controllers/orderController");
const router = express.Router();

router.get("/", authMiddleware(["user"]), getOrders);
router.get("/myorders", authMiddleware(["supplier"]), getSupplierOrders);
router.get(
  "/orderaddress/:orderId",
  authMiddleware(["supplier"]),
  getOrderAddress
);

router.post("/makeorder", authMiddleware(["user"]), makeOrder);

router.put(
  "/cancelorder/:orderId",
  authMiddleware(["user", "supplier"]),
  cancelOrder
);
router.put("/acceptorder/:orderId", authMiddleware(["supplier"]), acceptOrder);
router.put("/deliverorder/:orderId", authMiddleware(["supplier"]), deliverOrder);
router.put("/completeorder/:orderId", authMiddleware(["user"]), completeOrder);

module.exports = router;
