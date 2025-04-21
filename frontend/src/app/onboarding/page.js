"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertProfile } from "@/utils/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [avatarURL, setAvatarURL] = useState("");
  const [error, setError] = useState("");

  async function handleContinue() {
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please log in again.");
      return;
    }

    try {
      const res = await upsertProfile({ token, avatarURL });
      if (res.error) {
        setError(res.error);
      } else {
        // success!
        router.push("/home");
      }
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("Unexpected error. Please try again.");
    }
  }

  function handleSkip() {
    router.push("/home");
  }

  return (
    <div className="flex h-screen">
      <div className="w-full flex flex-col justify-center items-center bg-blue-50">
        <div className="w-80 p-6 shadow-lg rounded-lg bg-white relative">
          <button
            onClick={handleSkip}
            className="absolute right-2 top-2 text-sm text-gray-400 hover:text-gray-600"
          >
            Skip
          </button>
          <h2 className="text-2xl font-bold mb-4">Onboarding</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          
          <label className="block mb-1">Avatar URL</label>
          <input
            type="url"
            placeholder="https://..."
            className="border p-2 w-full mb-4"
            value={avatarURL}
            onChange={(e) => setAvatarURL(e.target.value)}
          />
          
          <button
            onClick={handleContinue}
            className="w-full bg-[#3192A5] text-white py-2 rounded hover:bg-[#297485]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
