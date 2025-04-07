const supabase = require("../supabaseClient");

exports.sendMessage = async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  if (!sender_id || !receiver_id || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Use the 'representation' option to return the inserted row(s)
  const { data, error } = await supabase
    .from("messages")
    .insert([{ sender_id, receiver_id, content }], { returning: 'representation' });

  if (error) return res.status(500).json({ error: error.message });
  
  // Check if data is not null and has at least one element
  if (!data || data.length === 0) {
    return res.status(500).json({ error: "No message data returned after insertion" });
  }

  res.json({ message: "Message sent", newMessage: data[0] });
};

exports.getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    
    // Query messages where sender = user1 and receiver = user2
    const { data: messages1, error: error1 } = await supabase
      .from("messages")
      .select("*")
      .eq("sender_id", user1)
      .eq("receiver_id", user2);
    
    // Query messages where sender = user2 and receiver = user1
    const { data: messages2, error: error2 } = await supabase
      .from("messages")
      .select("*")
      .eq("sender_id", user2)
      .eq("receiver_id", user1);
    
    if (error1 || error2) {
      const err = error1 || error2;
      return res.status(500).json({ error: err.message });
    }
    
    // Merge both sets of messages and sort them by created_at
    const messages = [...(messages1 || []), ...(messages2 || [])].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    
    return res.json({ messages });
  } catch (err) {
    console.error("Get messages error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
