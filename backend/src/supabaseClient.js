// /backend/src/supabaseClient.js
const { createClient } = require("@supabase/supabase-js");

const dotenv = require("dotenv");
dotenv.config();
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
console.log("Supabase Auth:", supabase.auth); // Should show a SupabaseAuthClient object
module.exports = supabase;
