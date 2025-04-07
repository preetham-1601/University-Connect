"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/utils/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [avatarURL, setAvatarURL] = useState("");
  const [error, setError] = useState("");

  async function handleContinue() {
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, please log in again!");
      return;
    }
    // For simplicity, we're not updating additional data here.
    const res = await updateProfile({ token, fullName: "", avatarURL });
    if (res.error) {
      setError(res.error);
    } else {
      router.push("/home");
    }
  }

  function handleSkip() {
    router.push("/home");
  }

  return (
    <div className="flex h-screen">
      <div className="w-full flex flex-col justify-center items-center bg-blue-50">
        <div className="w-80 p-6 shadow-lg rounded-lg bg-white relative">
          <button onClick={handleSkip} className="absolute right-2 top-2 text-sm text-gray-400 hover:text-gray-600">
            Skip
          </button>
          <h2 className="text-2xl font-bold mb-4">Onboarding</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <label className="block mb-1">Avatar URL</label>
          <input
            className="border p-2 w-full mb-2"
            value={avatarURL}
            onChange={(e) => setAvatarURL(e.target.value)}
          />
          <button onClick={handleContinue} className="w-full bg-blue-500 text-white py-2 rounded">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
