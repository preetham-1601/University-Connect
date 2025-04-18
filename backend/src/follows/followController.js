const supabase = require("../supabaseClient");

// Normalize any two UUIDs so user_a < user_b
function normalizePair(id1, id2) {
  return id1 < id2 ? [id1, id2] : [id2, id1];
}

// 1️⃣ Send (or re‑send) a follow request
exports.sendFollowRequest = async (req, res) => {
  const { requester_id, target_id } = req.body;
  if (!requester_id || !target_id) {
    return res.status(400).json({ error: "Missing requester_id or target_id" });
  }

  const [user_a, user_b] = normalizePair(requester_id, target_id);

  const { data, error } = await supabase
    .from("follow_requests")
    .upsert(
      { user_a, user_b, sender: requester_id, status: "pending" },
      { onConflict: ["user_a", "user_b"] }
    )
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ request: data });
};

// 2️⃣ Get pending incoming requests for me
exports.getPendingFollowRequests = async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: "Missing user_id" });

  const { data, error } = await supabase
    .from("follow_requests")
    .select(`
      id,
      sender,
      status,
      profiles:sender ( email )
    `)
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .eq("status", "pending");

  if (error) return res.status(500).json({ error: error.message });

  const pending = data
    .filter((r) => r.sender !== userId)
    .map((r) => ({
      id: r.id,
      requester_id: r.sender,
      requester_email: r.profiles.email,
    }));

  res.json({ pending });
};

// 3️⃣ Get accepted connections for me
exports.getAcceptedFollowRequests = async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: "Missing user_id" });

  const { data, error } = await supabase
    .from("follow_requests")
    .select("*")
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .eq("status", "accepted");

  if (error) return res.status(500).json({ error: error.message });

  const accepted = data.map((r) => {
    const other = r.user_a === userId ? r.user_b : r.user_a;
    return other;
  });

  res.json({ accepted });
};

// 4️⃣ Accept (approve) a request
exports.acceptFollowRequest = async (req, res) => {
  const { requestId, user_id } = req.body;
  if (!requestId || !user_id) {
    return res.status(400).json({ error: "Missing requestId or user_id" });
  }
  const { data, error } = await supabase
    .from("follow_requests")
    .update({ status: "accepted", updated_at: new Date().toISOString() })
    .eq("id", requestId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ accepted: data });
};

// 5️⃣ Reject (delete) a request
exports.rejectFollowRequest = async (req, res) => {
  const { requestId } = req.body;
  if (!requestId) return res.status(400).json({ error: "Missing requestId" });

  const { error } = await supabase
    .from("follow_requests")
    .delete()
    .eq("id", requestId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ rejected: true });
};
