// /frontend/src/app/signup/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/utils/api";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    universityName: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function isEduEmail(email) {
    return email.endsWith(".edu");
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!isEduEmail(formData.email)) {
      setError("Only .edu emails allowed");
      return;
    }

    const data = await signup(formData);
    if (data.error) {
      setError(data.error);
    } else {
      setMessage(data.message || "Signup successful");
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-blue-600 text-white flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold">Sign Up</h1>
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center">
        <form onSubmit={handleSignup} className="w-80 p-6 shadow-lg rounded-lg bg-white">
          <h2 className="text-2xl font-bold mb-4">Create Account</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {message && <p className="text-green-500 mb-2">{message}</p>}

          <input
            type="email"
            name="email"
            placeholder="University Email"
            className="w-full p-2 border mb-2"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border mb-2"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-2 border mb-2"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-2 border mb-2"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="text"
            name="universityName"
            placeholder="University Name"
            className="w-full p-2 border mb-2"
            value={formData.universityName}
            onChange={handleChange}
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
