// backend/src/users/userRoutes.js
const express = require("express");
const { getUsers } = require("./userController");
const router = express.Router();

// GET /api/users will return all profiles
router.get("/", getUsers);

module.exports = router;
