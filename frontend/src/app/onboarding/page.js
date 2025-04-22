// frontend/src/app/onboarding/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { upsertProfile } from "@/utils/api";

// 1) Static list of interests
const STATIC_INTERESTS = [
  "Computer Science",
  "Mechanical Engineering",
  "Biology",
  "Psychology",
  "Business",
  "Startups",
  "Research",
  "Sports",
  "Arts & Culture",
  "Volunteer Work",
  "Library Resources",
  "Recreation Center",
  "International Students",
  "Diversity & Inclusion",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");

  // 2) Redirect if already done
  useEffect(() => {
    if (localStorage.getItem("onboarding_completed") === "true") {
      router.replace("/home");
    }
  }, [router]);

  // 3) Toggle selection
  const toggle = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  // 4) Submit only once 2+ interests
  const handleContinue = async () => {
    if (selected.length < 2) {
      setError("Please select at least two interests.");
      return;
    }
    setError("");
    const token = localStorage.getItem("token");
    const res = await upsertProfile({
      token,
      interests: selected,
      onboarding_completed: true,
    });
    if (res.error) {
      setError(res.error);
    } else {
      localStorage.setItem("onboarding_completed", "true");
      router.replace("/home");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#3192A5] to-[#296485] p-4">
      <h1 className="text-3xl text-white mb-6 text-center">
        Welcome! Tell us your interests
      </h1>
      {error && <p className="text-red-300 mb-4">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mb-8 overflow-auto">
        {STATIC_INTERESTS.map((interest) => {
          const isOn = selected.includes(interest);
          return (
            <button
              key={interest}
              onClick={() => toggle(interest)}
              className={`p-3 rounded-lg text-center transition
                ${isOn
                  ? "bg-white text-[#3192A5] shadow-xl"
                  : "bg-white/30 text-white hover:bg-white/50"}
              `}
            >
              {interest}
            </button>
          );
        })}
      </div>

      <button
        disabled={selected.length < 2}
        onClick={handleContinue}
        className={`px-6 py-2 rounded-full text-lg font-semibold transition
          ${selected.length < 2
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-white text-[#3192A5] hover:scale-105"}
        `}
      >
        Continue
      </button>

      <p className="text-white/80 mt-4 text-sm text-center">
        You can always edit these later in your profile.
      </p>
    </div>
  );
}
