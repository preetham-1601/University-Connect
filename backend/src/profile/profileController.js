const supabase = require("../supabaseClient");

exports.getProfile = async (req, res) => {
  try {
    const { token } = req.query;
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user)
      return res.status(401).json({ error: "Invalid token or user not found" });
    return res.json({ user: data.user });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { token, fullName, avatarURL } = req.body;
    const { data, error } = await supabase.auth.updateUser({
      token,
      data: { fullName, avatarURL }
    });
    if (error)
      return res.status(400).json({ error: error.message });
    return res.json({ message: "Profile updated", user: data.user });
  } catch (err) {
    console.error("Profile update error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
