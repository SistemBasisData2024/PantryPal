const express = require("express");
const {
  getAllProducts,
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/myproducts", authMiddleware(["supplier"]), getProducts);
router.get("/", authMiddleware(["user", "supplier"]), getAllProducts);
router.get("/:productId", authMiddleware(["user", "supplier"]),getProductById);
router.post("/add", authMiddleware(["supplier"]), addProduct);

module.exports = router;
