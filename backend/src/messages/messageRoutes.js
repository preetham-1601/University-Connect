const express = require("express");
const { sendMessage, getMessages } = require("./messageController");
const router = express.Router();

router.post("/send", sendMessage);
router.get("/between/:user1/:user2", getMessages);

module.exports = router;
