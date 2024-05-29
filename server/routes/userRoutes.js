const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { topUp } = require("../controllers/userController");

router.put("/topup", authMiddleware(["user"]), topUp);

module.exports = router;