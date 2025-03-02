"use client";
import { useState } from "react";
import { login } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await login(email, password);

        if (!res.message) {
            throw new Error("Token not received from backend. Please check credentials.");
        }

        localStorage.setItem("message", res.message);
        router.push("/home");
    } catch (err) {
        setError(err.message || "Login failed!");
    }
};

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-gradient-to-br from-[#3192A5] to-[#296485] text-white flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold">Welcome to University Connect</h1>
        <p className="text-lg mt-2">Connect, Chat, and Collaborate with your University Community</p>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex flex-col justify-center items-center">
        <form onSubmit={handleLogin} className="w-80 p-6 shadow-lg rounded-lg bg-white">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border mb-2"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border mb-2"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
        </form>
      </div>
    </div>
  );
}
