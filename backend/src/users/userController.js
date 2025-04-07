// backend/src/users/userController.js
const supabase = require("../supabaseClient");

exports.getUsers = async (req, res) => {
  try {
    // Fetch all profiles from the 'profiles' table
    const { data, error } = await supabase
      .from("profiles")
      .select("*");
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    return res.json({ users: data });
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
