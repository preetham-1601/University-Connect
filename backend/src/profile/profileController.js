// backend/src/profile/profileController.js
const supabase = require("../supabaseClient");

// GET /api/profile?token=…
exports.getProfile = async (req, res) => {
  try {
    const { token } = req.query;
    const { data: authData, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !authData.user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const user = authData.user;

    // fetch or return null if no profile row
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error && error.code === "PGRST116") {
      // no profile yet
      return res.json({ user, profile: null });
    }
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ user, profile });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/profile
exports.updateProfile = async (req, res) => {
  try {
    const { token, fullName, avatarURL, bannerURL, bio, interests } = req.body;
    // 1) Validate token
    const { data: authData, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !authData.user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const userId = authData.user.id;

    // 2) Build the upsert payload
    const payload = { id: userId };
    if (fullName  !== undefined) payload.full_name  = fullName;
    if (avatarURL !== undefined) payload.avatar_url = avatarURL;
    if (bannerURL !== undefined) payload.banner_url = bannerURL;
    if (bio       !== undefined) payload.bio        = bio;
    if (interests !== undefined) payload.interests  = interests;

    // 3) Execute upsert
    const { data, error } = await supabase
      .from("profiles")
      .upsert([payload], { returning: "representation" });

    if (error) {
      console.error("Supabase upsert error:", error);
      return res.status(500).json({ error: error.message });
    }

    // 4) Safely pull out the new/updated row
    let profileRow = null;
    if (Array.isArray(data) && data.length > 0) {
      profileRow = data[0];
    } else if (data && typeof data === "object") {
      profileRow = data;
    }

    return res.json({ message: "Profile saved", profile: profileRow });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};