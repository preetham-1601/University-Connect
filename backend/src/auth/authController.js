// /backend/src/auth/authController.js
const supabase = require("../supabaseClient");

// SIGNUP (with .edu domain check + email verification)
exports.signupUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // (A) Check .edu domain
    const domain = email.split("@")[1] || "";
    if (!domain.endsWith("edu")) {
      return res.status(400).json({ error: "Only .edu emails allowed" });
    }

    // (B) Sign up user (Supabase sends verification email if “Confirm email” is on)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000" 
        // or your real domain, e.g. "https://myapp.com"
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      message: "Signup successful. Please check your .edu email to verify your account.",
      user: data.user,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// LOGIN (with .edu domain check)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // (A) Check .edu domain
    const domain = email.split("@")[1] || "";
    if (!domain.endsWith("edu")) {
      return res.status(400).json({ error: "Only .edu emails allowed" });
    }

    // (B) Sign in with password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ error: error.message || "Invalid credentials" });
    }

    // data.session.access_token is your JWT
    return res.json({
      message: "Login successful",
      token: data.session.access_token,
      user: data.user,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
