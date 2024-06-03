const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", productController.getAllProducts);
router.get("/:productId", productController.getProductById);
router.get("/myproducts", authMiddleware(["supplier"]), productController.getProducts);
router.post("/add", authMiddleware(["supplier"]), productController.addProduct);
router.put("/update/:productId", authMiddleware(["supplier"]), productController.updateProduct);
router.delete("/delete/:productId", authMiddleware(["supplier"]), productController.deleteProduct);

module.exports = router;
