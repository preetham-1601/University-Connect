// app/channels/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getChannels, getJoinedChannels } from "@/utils/api";

export default function ChannelsIndex() {
  const router = useRouter();
  const [allCh, setAllCh] = useState([]);
  const [joined, setJoined] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    // get my user ID from the profile endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile?token=${token}`)
      .then(r => r.json())
      .then(({ user }) => {
        if (!user) throw new Error("no user");
        // fetch channels + joined
        return Promise.all([
          getChannels(),
          getJoinedChannels(user.id),
        ]);
      })
      .then(([chRes, jRes]) => {
        setAllCh(chRes.channels || []);
        setJoined(jRes.joined || []);
      })
      .catch(console.error);
  }, [router]);

  const joinedList = allCh.filter((c) => joined.includes(c.id));

  return (
    <div className="flex-1 flex">
      {/* LEFT pane */}
      <div className="w-64 bg-gray-100 p-4 border-r overflow-auto">
        <h2 className="text-lg font-bold mb-4">Your Channels</h2>
        {joinedList.length === 0 ? (
          <p className="text-gray-600">You have no joined channels.</p>
        ) : (
          joinedList.map((ch) => (
            <div
              key={ch.id}
              onClick={() => router.push(`/channels/${ch.id}`)}
              className="p-2 mb-2 rounded cursor-pointer hover:bg-gray-200"
            >
              # {ch.name}
            </div>
          ))
        )}
      </div>

      {/* RIGHT pane */}
      <div className="flex-1 flex items-center justify-center bg-blue-50">
        <p className="text-gray-600">
          Select a channel on the left to start chatting.
        </p>
      </div>
    </div>
  );
}
