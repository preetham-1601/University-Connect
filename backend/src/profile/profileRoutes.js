const express = require("express");
const { getProfile, updateProfile } = require("./profileController");
const router = express.Router();

router.get("/", getProfile);
router.put("/", updateProfile);

module.exports = router;
