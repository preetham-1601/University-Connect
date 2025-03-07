// /frontend/src/app/signup/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/utils/api";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function isEduEmail(email) {
    return email.endsWith(".edu");
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // front-end .edu check
    if (!isEduEmail(email)) {
      setError("Only .edu emails allowed");
      return;
    }

    try {
      const data = await signup(email, password);
      if (data.error) {
        setError(data.error);
      } else {
        setMessage(data.message || "Signup successful");
      }
    } catch (err) {
      setError("Signup failed!");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left half */}
      <div className="w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold">Sign Up</h1>
        <p className="mt-2">.edu emails only</p>
      </div>

      {/* Right half */}
      <div className="w-1/2 flex flex-col justify-center items-center">
        <form onSubmit={handleSignup} className="w-80 p-6 shadow-lg rounded-lg bg-white">
          <h2 className="text-2xl font-bold mb-4">Create Account</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {message && <p className="text-green-500 mb-2">{message}</p>}
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
          <button className="w-full bg-blue-500 text-white py-2 rounded mb-2">
            Sign Up
          </button>
          <p className="text-sm text-center">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-500 cursor-pointer"
            >
              Log in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
