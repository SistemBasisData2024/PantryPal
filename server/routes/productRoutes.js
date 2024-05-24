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

router.get("/", authMiddleware(["user", "supplier"]), getAllProducts);
router.get("/myproducts", authMiddleware(["supplier"]), getProducts);
router.get("/:productId", authMiddleware(["user", "supplier"]),getProductById);
router.post("/add", authMiddleware(["supplier"]), addProduct);
router.put("/update/:productId", authMiddleware(["supplier"]), updateProduct);
router.delete("/delete/:productId", authMiddleware(["supplier"]), deleteProduct);

module.exports = router;
