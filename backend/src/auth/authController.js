// /backend/src/auth/authController.js
const supabase = require("../supabaseClient");

// SIGNUP (with .edu check, confirm password, storing minimal user_metadata)
exports.signupUser = async (req, res) => {
  try {
    const { email, password, confirmPassword, username, universityName } = req.body;

    // .edu domain check
    const domain = email.split("@")[1] || "";
    if (!domain.endsWith("edu")) {
      return res.status(400).json({ error: "Only .edu emails allowed" });
    }

    // Confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Sign up user with user_metadata
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/onboarding", 
        data: {
          username,
          universityName,
          // You can add avatarURL, onboarded: false, interests, etc. if you want
        }
      }
    });

    if (signUpError) {
      return res.status(400).json({ error: signUpError.message });
    }

    // Because “Confirm email” is enabled, user must verify before login
    return res.json({
      message: "Signup successful! Check your .edu email to verify.",
      user: signUpData.user
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// LOGIN (returns token if verified)
exports.loginUser = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { email, password } = req.body;

    // .edu check
    const domain = email.split("@")[1] || "";
    if (!domain.endsWith("edu")) {
      return res.status(400).json({ error: "Only .edu emails allowed" });
    }

    // signInWithPassword
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return res.status(401).json({ error: error.message || "Invalid credentials" });
    }

    // Return token + user
    if (!data.session) {
      return res.status(401).json({ error: "User not verified or no session" });
    }

    return res.json({
      message: "Login successful",
      token: data.session.access_token,
      user: data.user
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
