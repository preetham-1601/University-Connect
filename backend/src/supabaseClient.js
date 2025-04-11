// /backend/src/supabaseClient.js
const { createClient } = require("@supabase/supabase-js");

const dotenv = require("dotenv");
dotenv.config();


const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
module.exports = supabase;
