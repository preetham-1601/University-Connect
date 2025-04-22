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

    // Fetch the profile row, if any
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      // If no row exists yet, return null
      if (error.code === "PGRST116") {
        return res.json({ user, profile: null });
      }
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
    const { token, fullName, avatarURL, bannerURL, bio, interests, onboarding_completed } = req.body;

    // 1) Validate token & get user ID
    const { data: authData, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !authData.user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const userId = authData.user.id;

    // 2) Build upsert payload dynamically
    const payload = { id: userId };
    if (fullName             !== undefined) payload.full_name           = fullName;
    if (avatarURL            !== undefined) payload.avatar_url          = avatarURL;
    if (bannerURL            !== undefined) payload.banner_url          = bannerURL;
    if (bio                  !== undefined) payload.bio                 = bio;
    if (interests            !== undefined) payload.interests           = interests;
    if (onboarding_completed !== undefined) payload.onboarding_completed = onboarding_completed;

    // 3) Upsert into profiles
    const { data, error } = await supabase
      .from("profiles")
      .upsert([payload], { returning: "representation" });

    if (error) {
      console.error("Supabase upsert error:", error);
      return res.status(500).json({ error: error.message });
    }

    // 4) Extract the single upserted row
    const profileRow = Array.isArray(data) && data.length > 0
      ? data[0]
      : data;

    return res.json({ message: "Profile saved", profile: profileRow });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
