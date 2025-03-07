// /backend/src/auth/authRoutes.js
const express = require("express");
const { signupUser, loginUser } = require("./authController");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);

module.exports = router;
