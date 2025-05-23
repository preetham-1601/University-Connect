// frontend/src/app/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getProfile } from "@/utils/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");

  function isEduEmail(email) {
    return email.endsWith(".edu");
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!isEduEmail(email)) {
      setError("Only .edu emails allowed");
      return;
    }

    // 1) Authenticate
    const data = await login({ email, password });
    if (data.error) {
      setError(data.error);
      return;
    }

    // 2) Persist token & email
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", email);

    try {
      // 3) Fetch your profile row (which includes onboarding_completed)
      const profileRes = await getProfile(data.token);
      if (profileRes.error) {
        // If we can’t get a profile, just land in home
        router.push("/home");
      } else {
        const completed = profileRes.profile?.onboarding_completed;
        if (completed) {
          router.push("/home");
        } else {
          router.push("/onboarding");
        }
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      router.push("/home");
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gradient-to-br from-[#3192A5] to-[#296485] text-white flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold">Log In</h1>
        <p className="mt-2">.edu emails only</p>
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center">
        <form onSubmit={handleLogin} className="w-80 p-6 shadow-lg rounded-lg bg-white">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input
            type="email"
            placeholder="University Email"
            className="w-full p-2 border mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-[#3192A5] text-white py-2 rounded hover:bg-[#297485] mb-2">
            Login
          </button>
          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <span onClick={() => router.push("/signup")} className="text-[#3192A5] cursor-pointer">
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
