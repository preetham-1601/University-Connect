// backend/src/channels/channelRoutes.js
const express = require("express");
const {
  getChannels,
  createChannel,
  getChannelMessages,
  sendChannelMessage
} = require("./channelController");

const router = express.Router();

// List all channels.
router.get("/", getChannels);

// Create a new channel.
router.post("/", createChannel);

// Get messages for a specific channel.
router.get("/messages/:channelId", getChannelMessages);

// Send a message to a channel.
router.post("/messages", sendChannelMessage);

module.exports = router;
