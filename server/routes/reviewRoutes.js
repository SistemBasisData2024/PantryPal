const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const reviewController = require("../controllers/reviewController");

router.get("/:entityId", reviewController.getReview);
router.post("/add", authMiddleware(["user"]), reviewController.addReview);

module.exports = router;