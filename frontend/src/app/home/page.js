// app/home/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/utils/api";
import Navbar from "@/components/Navbar";

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
      if (!res.error) setCurrentUser(res.user);
    });
    // Simulate a newsletter feed
    setFeed([
      { id: 1, title: "Campus Newsletter", content: "Updates from the campus..." },
      { id: 2, title: "Upcoming Events", content: "Don't miss our event on Friday!" }
    ]);
  }, [router]);

  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1 bg-gray-50">
        <div className="p-4">
          <h1 className="text-3xl font-bold">Home Feed & Search</h1>
          {feed.map((item) => (
            <div key={item.id} className="bg-white shadow rounded p-4 mb-4">
              <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
              <p>{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
