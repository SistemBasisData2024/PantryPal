const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const foodController = require("../controllers/foodController");

router.get("/", foodController.getFood);
router.get("/:foodId", foodController.getFoodById);
router.get("/getrecipe/:recipeId", foodController.getRecipeById);
router.post("/addfood", authMiddleware(["admin"]), foodController.addFood);
router.post("/addrecipe", authMiddleware(["admin"]), foodController.addRecipe);
router.put("/updatefood/:foodId", authMiddleware(["admin"]), foodController.updateFood);
router.put("/updaterecipe/:recipeId", authMiddleware(["admin"]), foodController.updateRecipe);
router.delete("/deletefood/:foodId", authMiddleware(["admin"]), foodController.deleteFood);
router.delete("/deleterecipe/:recipeId", authMiddleware(["admin"]), foodController.deleteRecipe);

module.exports = router;