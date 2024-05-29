const express = require("express");
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware(["user", "supplier"]), productController.getAllProducts);
router.get("/myproducts", authMiddleware(["supplier"]), productController.getProducts);
router.get("/:productId", authMiddleware(["user", "supplier"]),productController.getProductById);
router.post("/add", authMiddleware(["supplier"]), productController.addProduct);
router.put("/update/:productId", authMiddleware(["supplier"]), productController.updateProduct);
router.delete("/delete/:productId", authMiddleware(["supplier"]), productController.deleteProduct);

module.exports = router;
