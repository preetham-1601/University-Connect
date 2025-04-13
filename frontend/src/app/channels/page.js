"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getChannels, getChannelMessages, sendChannelMessage, getUsers, getProfile } from "@/utils/api";
import { supabase } from "@/utils/supabaseClient";
import Navbar from "@/components/Navbar";

export default function ChannelsPage() {
  const router = useRouter();

  // State for current user and all users (for sender lookup)
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Channels list state and selected channel
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

  // Channel messages and chat input state
  const [channelMessages, setChannelMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [error, setError] = useState("");

  // On mount, fetch current user, users, and channels.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch current user's profile
    fetch(`http://localhost:5000/api/profile?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch((err) => console.error("Error fetching profile:", err));

    // Fetch all users (for looking up sender emails)
    getUsers()
      .then((data) => {
        if (!data.error) setAllUsers(data.users);
        else console.error("Error fetching users:", data.error);
      })
      .catch((err) => console.error("Error fetching users:", err));

    // Fetch channels list
    getChannels()
      .then((data) => {
        if (data.channels) {
          setChannels(data.channels);
        } else {
          setError("Failed to load channels.");
        }
      })
      .catch((err) => setError(err.message));
  }, [router]);

  // When a channel is selected, load historical messages for it.
  useEffect(() => {
    if (selectedChannel) {
      getChannelMessages(selectedChannel.id)
        .then((res) => {
          if (!res.error) {
            setChannelMessages(res.messages);
          } else {
            setError(res.error);
          }
        })
        .catch((err) => setError(err.message));
    }
  }, [selectedChannel]);

  // Setup realtime subscription for channel messages.
  useEffect(() => {
    if (!selectedChannel) return;
    const subscription = supabase
      .channel("channel-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "channel_messages",
          filter: `channel_id=eq.${selectedChannel.id}`
        },
        (payload) => {
          const newMessage = payload.new;
          setChannelMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedChannel]);

  // Handle sending a new channel message.
  async function handleSend() {
    if (!chatInput.trim() || !selectedChannel || !currentUser) return;
    const contentToSend = chatInput;
    setChatInput("");

    // Optimistically update UI with a temporary message.
    const tempMessage = {
      id: `temp-${Date.now()}`,
      channel_id: selectedChannel.id,
      sender_id: currentUser.id,
      content: contentToSend,
      created_at: new Date().toISOString(),
    };
    setChannelMessages((prev) => [...prev, tempMessage]);

    // Send message via API.
    const res = await sendChannelMessage({
      channel_id: selectedChannel.id,
      sender_id: currentUser.id,
      content: contentToSend,
    });
    if (res.error) {
      setChannelMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      alert("Error sending message: " + res.error);
    }
  }

  return (
    <div className="flex h-screen">
      {/* LEFT: Global Navbar */}
      <Navbar />

      {/* MIDDLE: Channels List */}
      <div className="w-64 bg-gray-100 p-4 border-r border-gray-300 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Channels</h2>
        {channels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => {
              setSelectedChannel(channel);
              setChannelMessages([]); // Clear messages when switching channels.
            }}
            className={`p-2 mb-2 rounded cursor-pointer transition-colors hover:bg-gray-200 ${
              selectedChannel?.id === channel.id ? "bg-gray-300" : "bg-white"
            }`}
          >
            <span className="font-semibold text-gray-900"># {channel.name}</span>
          </div>
        ))}
        {channels.length === 0 && (
          <p className="mt-4 text-sm text-gray-600">No channels available.</p>
        )}
      </div>

      {/* RIGHT: Channel Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar with matching gradient */}
        <header
          className="h-14 flex items-center px-4"
          style={{ background: "linear-gradient(to bottom right, #3192A5, #296485)" }}
        >
          {selectedChannel ? (
            <h1 className="text-xl font-bold text-white">#{selectedChannel.name}</h1>
          ) : (
            <h1 className="text-xl font-bold text-white">Select a channel</h1>
          )}
        </header>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-blue-50">
          {selectedChannel ? (
            channelMessages.length === 0 ? (
              <p className="text-gray-600">No messages yet in this channel.</p>
            ) : (
              channelMessages.map((msg) => {
                // Determine if the message is from current user.
                const isCurrentUser = msg.sender_id === currentUser?.id;
                // Look up the sender's email for other messages.
                const sender = allUsers.find((u) => u.id === msg.sender_id);
                return (
                  <div key={msg.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-xs">
                      {!isCurrentUser && (
                        <div className="text-xs text-gray-600 mb-1">
                          {sender ? sender.email : "Unknown"}
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-xl shadow transition-colors ${
                          isCurrentUser
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
            <p className="text-gray-600">Select a channel from the list.</p>
          )}
        </div>

        {/* Input Area */}
        <div className="h-14 flex items-center px-4 bg-white border-t">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border p-2 rounded mr-2"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={!selectedChannel || !currentUser}
          />
          <button
            onClick={handleSend}
            disabled={!selectedChannel || !currentUser}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
