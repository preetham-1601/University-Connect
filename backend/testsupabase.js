const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

console.log("ENV:", process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
console.log("Check supabase.auth:", supabase.auth);

(async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "pkasturi@charlotte.edu",
    password: "Bunny@2001"
  });
  console.log("DATA:", data, "ERROR:", error);
})();
