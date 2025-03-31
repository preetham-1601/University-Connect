// /backend/src/profile/profileController.js
const supabase = require("../supabaseClient");

// GET /profile?token=xxx -> returns user + user_metadata
exports.getProfile = async (req, res) => {
  try {
    const { token } = req.query;

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: "Invalid token or user not found" });
    }

    return res.json({ user: userData.user });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// PUT /profile -> update user_metadata
exports.updateProfile = async (req, res) => {
  try {
    const { token, fullName, bio, avatarURL, interests } = req.body;

    // Validate token
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: "Invalid token or user not found" });
    }

    // Merge new fields into user_metadata
    const { data, error } = await supabase.auth.updateUser({
      token,
      data: {
        fullName,
        bio,
        avatarURL,
        interests
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: "Profile updated", user: data.user });
  } catch (err) {
    console.error("Profile update error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
