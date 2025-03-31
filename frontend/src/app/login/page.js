// /frontend/src/app/login/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/utils/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!email.endsWith("edu")) {
      setError("Only .edu emails allowed");
      return;
    }
  
    try {
      // Pass an object with email and password
      const data = await login({ email, password });
      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem("token", data.token);
  
        const onboarded = data.user?.user_metadata?.onboarded;
        if (!onboarded) {
          router.push("/onboarding");
        } else {
          router.push("/home");
        }
      }
    } catch (err) {
      setError("Login failed");
    }
  };
  

  return (
    <div className="flex h-screen">
      {/* Left half */}
      <div className="w-1/2 bg-gradient-to-br from-[#3192A5] to-[#296485] text-white flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold">Log In</h1>
        <p className="mt-2">.edu emails only</p>
      </div>

      {/* Right half */}
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
          <button className="w-full bg-blue-500 text-white py-2 rounded mb-2">Login</button>
          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-blue-500 cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
