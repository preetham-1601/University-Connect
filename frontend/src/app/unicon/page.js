"use client";
import { useRouter } from "next/navigation";

export default function UniConPage() {
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gradient-to-br from-[#3192A5] to-[#296485] text-white p-4">
        <h2 className="text-xl font-bold">Channels</h2>
        <ul>
          <li># Clubs</li>
          <li># Events</li>
          <li># Startups</li>
          <li># Projects</li>
        </ul>
      </div>

      {/* Chat Section */}
      <div className="flex-1 p-6 bg-[#ACF1FF] bg-opacity-50">
        <h2 className="text-xl font-bold">Welcome to UniCon</h2>
        <p className="mt-2">Join conversations in different university groups.</p>
      </div>
    </div>
  );
}
