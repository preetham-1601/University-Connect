// /frontend/src/app/onboarding/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/utils/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState("");

  const interestsList = ["Sports", "Music", "AI", "Startups", "Arts", "Dorm Life"];

  function toggleInterest(interest) {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  }

  function handleSkip() {
    router.push("/home");
  }

  async function handleContinue() {
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in!");
      return;
    }

    const res = await updateProfile({ token, bio, avatarURL, interests, onboarded: true });
    if (res.error) {
      setError(res.error);
    } else {
      router.push("/home");
    }
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

          <label>Avatar URL</label>
          <input
            className="border p-2 w-full mb-2"
            value={avatarURL}
            onChange={(e) => setAvatarURL(e.target.value)}
          />
          <label>Bio</label>
          <textarea
            className="border p-2 w-full mb-2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <p className="mb-1 font-semibold">Select Interests:</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {interestsList.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1 border rounded ${
                  interests.includes(interest) ? "bg-blue-500 text-white" : "bg-white text-gray-700"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
