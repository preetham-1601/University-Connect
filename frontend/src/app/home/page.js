"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/utils/api";

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    getProfile(token).then((res) => {
      if (!res.error) {
        setCurrentUser(res.user);
      }
    });
    // Simulate a newsletter feed
    setFeed([
      { id: 1, title: "Campus Newsletter", content: "Updates from the campus..." },
      { id: 2, title: "Upcoming Events", content: "Don't miss our event on Friday!" }
    ]);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">
            Welcome, {currentUser ? currentUser.email : "User"}
          </h1>
          <button onClick={() => router.push("/profile")} className="ml-4">
            <img src="/profile-icon.png" alt="Profile" className="w-8 h-8 rounded-full" />
          </button>
        </div>
        <button onClick={() => router.push("/unicon")} className="bg-white text-blue-600 px-3 py-1 rounded">
          Go to Unicon
        </button>
      </nav>
      <div className="p-4">
        {feed.map((item) => (
          <div key={item.id} className="bg-white shadow rounded p-4 mb-4">
            <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
