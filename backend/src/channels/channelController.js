// backend/src/channels/channelController.js
const supabase = require("../supabaseClient");

// Retrieve all channels.
exports.getChannels = async (req, res) => {
  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ channels: data });
};

// Create a new channel.
exports.createChannel = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Channel name is required" });

  const { data, error } = await supabase
    .from("channels")
    .insert([{ name, description }], { returning: "representation" });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ channel: data[0] });
};

// Retrieve messages for a given channel.
exports.getChannelMessages = async (req, res) => {
  const { channelId } = req.params;
  const { data, error } = await supabase
    .from("channel_messages")
    .select("*")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ messages: data });
};

// Send a new channel message.
exports.sendChannelMessage = async (req, res) => {
  const { channel_id, sender_id, content } = req.body;
  if (!channel_id || !sender_id || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data, error } = await supabase
    .from("channel_messages")
    .insert([{ channel_id, sender_id, content }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(500).json({ error: "No message data returned after insertion" });
  return res.json({ message: "Message sent", newMessage: data[0] });
};
