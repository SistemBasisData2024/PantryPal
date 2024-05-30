const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const orderRoutes = require("../controllers/orderController");
const router = express.Router();

router.get("/", authMiddleware(["user"]), orderRoutes.getOrders);
router.get(
  "/myorders",
  authMiddleware(["supplier"]),
  orderRoutes.getSupplierOrders
);
router.get(
  "/orderaddress/:orderId",
  authMiddleware(["supplier"]),
  orderRoutes.getOrderAddress
);

router.post(
  "/makeorder", 
  authMiddleware(["user"]), 
  orderRoutes.makeOrder
);

router.put(
  "/cancelorder/:orderId",
  authMiddleware(["user", "supplier"]),
  orderRoutes.cancelOrder
);
router.put(
  "/acceptorder/:orderId",
  authMiddleware(["supplier"]),
  orderRoutes.acceptOrder
);
router.put(
  "/deliverorder/:orderId",
  authMiddleware(["supplier"]),
  orderRoutes.deliverOrder
);
router.put(
  "/completeorder/:orderId",
  authMiddleware(["user"]),
  orderRoutes.completeOrder
);

module.exports = router;
