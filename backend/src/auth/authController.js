const supabase = require("../supabaseClient");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // ✅ Send the token in the response
        return res.json({
            message: "Login successful",
            token: data.session.access_token,  // 🔹 This was missing!
            user: data.user
        });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
};
