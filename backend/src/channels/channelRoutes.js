// backend/src/channels/channelRoutes.js
const express = require("express");
const {
  getChannels,
  createChannel,
  getChannelMessages,
  sendChannelMessage,
  getJoinedChannels,
  joinChannel
} = require("./channelController");

const router = express.Router();

// List all channels.
router.get("/", getChannels);

// Create a new channel.
router.post("/", createChannel);
router.get("/joined/:userId", getJoinedChannels);
router.post("/:id/join",joinChannel);
// Get messages for a specific channel.
router.get("/messages/:channelId", getChannelMessages);

// Send a message to a channel.
router.post("/messages", sendChannelMessage);

module.exports = router;
