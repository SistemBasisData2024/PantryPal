const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const userRoutes = require("../controllers/userController");

router.get("/getcart", authMiddleware(["user"]), userRoutes.getCart);
router.put("/topup", authMiddleware(["user"]), userRoutes.topUp);
router.post("/postcart", authMiddleware(["user"]), userRoutes.postCart);
router.post("/deleteproduct", authMiddleware(["user"]), userRoutes.postCartDeleteProduct);

module.exports = router;