// backend/src/auth/authController.js
const supabase = require("../supabaseClient");

exports.signupUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Create the user via Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Supabase signUp error:", error);
      return res.status(400).json({ error: error.message });
    }

    // Insert profile record (only email for now)
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: data.user.id, email: data.user.email }]);
    if (profileError) {
      console.error("Profile insertion error:", profileError);
      return res.status(400).json({ error: profileError.message });
    }

    return res.json({
      message: "Signup successful! Please verify your email.",
      user: data.user,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Missing email or password" });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error)
      return res.status(401).json({ error: error.message });
    if (!data.session)
      return res.status(401).json({ error: "User not verified or no session" });

    return res.json({ message: "Login successful", token: data.session.access_token, user: data.user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
