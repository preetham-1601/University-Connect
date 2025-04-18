// frontend/src/app/unicon/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getUsers,
  getMessages,
  sendMessage,
  getProfile,
  getAcceptedFollowRequests,
} from "@/utils/api";
import { supabase } from "@/utils/supabaseClient";
import Navbar from "@/components/Navbar";

export default function UniconPage() {
  const router = useRouter();

  // User & connections
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers]   = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);

  // DM state
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages]         = useState([]);
  const [chatInput, setChatInput]       = useState("");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  // 1️⃣ On mount: load profile, users, accepted connections
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch current user
    getProfile(token)
      .then((res) => {
        if (res.user) {
          setCurrentUser(res.user);
          return res.user.id;
        }
        throw new Error("No user");
      })
      .then((userId) => {
        // Fetch accepted connections
        return getAcceptedFollowRequests(userId);
      })
      .then((res) => {
        if (res.accepted) {
          setAcceptedConnections(res.accepted);
        }
      })
      .catch((err) => setError(err.message));

    // Fetch all users
    getUsers()
      .then((res) => {
        if (res.users) setAllUsers(res.users);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  // 2️⃣ Build DM list: only connected users (exclude self)
  const filteredDMUsers = allUsers.filter((user) =>
    currentUser &&
    user.id !== currentUser.id &&
    acceptedConnections.includes(user.id)
  );

  // 3️⃣ Fetch messages when you select a user
  useEffect(() => {
    if (currentUser && selectedUser) {
      getMessages(currentUser.id, selectedUser.id)
        .then((res) => {
          if (!res.error) setMessages(res.messages);
          else setError(res.error);
        })
        .catch((err) => setError(err.message));
    }
  }, [currentUser, selectedUser]);

  // 4️⃣ Real‑time subscription
  useEffect(() => {
    if (!currentUser || !selectedUser) return;
    const sub = supabase
      .channel("dm-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        ({ new: msg }) => {
          if (
            (msg.sender_id === currentUser.id && msg.receiver_id === selectedUser.id) ||
            (msg.sender_id === selectedUser.id && msg.receiver_id === currentUser.id)
          ) {
            setMessages((m) => [...m, msg]);
          }
        }
      )
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, [currentUser, selectedUser]);

  // 5️⃣ Send message
  async function handleSend() {
    if (!chatInput.trim() || !currentUser || !selectedUser) return;
    const content = chatInput;
    setChatInput("");
    // Optimistic UI
    const temp = {
      id: `tmp-${Date.now()}`,
      sender_id: currentUser.id,
      receiver_id: selectedUser.id,
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, temp]);

    const res = await sendMessage({
      sender_id: currentUser.id,
      receiver_id: selectedUser.id,
      content,
    });
    if (res.error) {
      setMessages((m) => m.filter((x) => x.id !== temp.id));
      alert("Send failed: " + res.error);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Left Navbar */}
      <Navbar />

      {/* Middle: DM list */}
      <div className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Direct Messages</h2>
        {filteredDMUsers.length === 0 ? (
          <p className="text-gray-600 text-sm">
            No connections yet. Make a connection to chat.
          </p>
        ) : (
          filteredDMUsers.map((u) => (
            <div
              key={u.id}
              onClick={() => {
                setSelectedUser(u);
                setMessages([]);
              }}
              className={`p-2 mb-2 rounded cursor-pointer hover:bg-gray-200 ${
                selectedUser?.id === u.id ? "bg-gray-300" : "bg-white"
              }`}
            >
              {u.email}
            </div>
          ))
        )}
      </div>

      {/* Right: Chat window */}
      <div className="flex-1 flex flex-col bg-blue-50">
        <header className="h-14 bg-blue-600 text-white px-4 flex items-center">
          <h1 className="text-xl font-bold">
            {selectedUser ? `Chat with ${selectedUser.email}` : "Select a chat"}
          </h1>
        </header>
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {selectedUser ? (
            messages.length === 0 ? (
              <p className="text-gray-600">No messages yet.</p>
            ) : (
              messages.map((msg) => {
                const mine = msg.sender_id === currentUser.id;
                const sender = allUsers.find((x) => x.id === msg.sender_id);
                return (
                  <div
                    key={msg.id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-xs">
                      {!mine && (
                        <div className="text-xs text-gray-600 mb-1">
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
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            <p className="text-gray-600">Select a user to start chatting.</p>
          )}
        </div>
        <div className="h-14 flex items-center px-4 bg-white border-t">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={!selectedUser}
            placeholder="Type..."
            className="flex-1 border p-2 rounded mr-2"
          />
          <button
            onClick={handleSend}
            disabled={!selectedUser}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
