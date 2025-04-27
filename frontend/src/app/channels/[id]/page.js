// app/channels/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getChannels,
  getJoinedChannels,
  getChannelMessages,
  sendChannelMessage,
  getUsers,
} from "@/utils/api";
import { supabase } from "@/utils/supabaseClient";

export default function ChannelChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [allCh, setAllCh] = useState([]);
  const [joined, setJoined] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  // 1) load profile + channels + joined IDs
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile?token=${token}`)
      .then(r => r.json())
      .then(({ user }) => {
        setUser(user);
        return Promise.all([
          getChannels(),
          getJoinedChannels(user.id),
          getUsers(),
        ]);
      })
      .then(([chRes, jRes, uRes]) => {
        setAllCh(chRes.channels || []);
        setJoined(jRes.joined || []);
        setAllUsers(uRes.users || []);
      })
      .catch(console.error);
  }, [router]);

  // 2) load message history
  useEffect(() => {
    if (!id) return;
    getChannelMessages(id)
      .then((res) => setMsgs(res.messages || []))
      .catch(console.error);
  }, [id]);

  // 3) realtime subscribe
  useEffect(() => {
    if (!id) return;
    const channelName = `channel-${id}`;
    const sub = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "channel_messages",
          filter: `channel_id=eq.${id}`,
        },
        ({ new: m }) => {
          setMsgs((prev) => [...prev, m]);
        }
      )
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, [id]);

  // 4) send handler (realtime will echo it back)
  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const content = input;
    setInput("");
    const { error } = await sendChannelMessage({
      channel_id: +id,
      sender_id: user.id,
      content,
    });
    if (error) alert(error);
  };

  // find meta
  const channel = allCh.find((c) => c.id === +id);

  // require join first
  if (!joined.includes(+id)) {
    return (
      <div className="flex-1 flex items-center justify-center bg-blue-50">
        <p className="text-gray-600">
          You must join this channel first.{" "}
          <button
            onClick={() => router.push("/explore")}
            className="underline text-blue-600"
          >
            Explore
          </button>
        </p>
      </div>
    );
  }

  // build joined list for left pane
  const joinedList = allCh.filter((c) => joined.includes(c.id));

  return (
    <div className="flex-1 flex">
      {/* LEFT: your joined channels */}
      <div className="w-64 bg-gray-100 p-4 border-r overflow-auto">
        <h2 className="text-lg font-bold mb-4">Your Channels</h2>
        {joinedList.map((ch) => (
          <div
            key={ch.id}
            className={`p-2 mb-2 rounded cursor-pointer ${
              +id === ch.id ? "bg-gray-300" : "bg-white"
            }`}
            onClick={() => router.push(`/channels/${ch.id}`)}
          >
            # {ch.name}
          </div>
        ))}
      </div>

      {/* RIGHT: chat */}
      <div className="flex-1 flex flex-col bg-blue-50">
        <header className="h-14 flex items-center px-4 bg-[#3192A5] text-white">
          <h1 className="text-xl font-bold"># {channel?.name || id}</h1>
        </header>
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {msgs.length === 0 ? (
            <p className="text-gray-600">No messages yet.</p>
          ) : (
            msgs.map((m) => {
              const mine = m.sender_id === user?.id;
              const sender = allUsers.find(u => u.id === m.sender_id);
              return (
                <div
                  key={m.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-xs">
                    {!mine && (
                      <div className="text-xs text-gray-600 mb-1">
                        {/* swap for real email if backend returns it */}
                        {sender?.email || "Unknown"}
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-xl shadow ${
                        mine
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="h-14 flex items-center px-4 bg-white border-t">
          <input
            type="text"
            placeholder="Type a message…"
            className="flex-1 border p-2 rounded mr-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
