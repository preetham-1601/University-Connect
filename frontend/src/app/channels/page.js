"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getChannels,
  getChannelMessages,
  sendChannelMessage,
} from "@/utils/api";
import { supabase } from "@/utils/supabaseClient";
import Navbar from "@/components/Navbar";

export default function ChannelsPage() {
  const router = useRouter();

  // State for global/current user (assumed to be stored in localStorage)
  const [currentUser, setCurrentUser] = useState(null);
  // State for full channels list from the backend.
  const [channels, setChannels] = useState([]);
  // State for the joined channels (an array of channel IDs stored in localStorage)
  const [joinedChannels, setJoinedChannels] = useState([]);
  // State for the currently selected (joined) channel.
  const [selectedChannel, setSelectedChannel] = useState(null);
  // Channel chat messages.
  const [channelMessages, setChannelMessages] = useState([]);
  // Message input text.
  const [chatInput, setChatInput] = useState("");
  // General error message.
  const [error, setError] = useState("");

  // On mount, load the current user from localStorage.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      // Load joined channels from localStorage (as an array of channel IDs).
      const storedJoined = localStorage.getItem("joinedChannels");
      if (storedJoined) {
        setJoinedChannels(JSON.parse(storedJoined));
      }
    }
  }, []);

  // Fetch all channels from the backend.
  useEffect(() => {
    getChannels()
      .then((data) => {
        if (data.channels) {
          setChannels(data.channels);
        } else {
          setError("Failed to load channels.");
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  // Filter channels to display only those that the user has joined.
  const joinedChannelsList = channels.filter((channel) =>
    joinedChannels.includes(channel.id)
  );

  // When a joined channel is selected, load its messages.
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

  // Realtime subscription for channel messages.
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
          filter: `channel_id=eq.${selectedChannel.id}`,
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

  // Handler for sending a channel message.
  async function handleSend() {
    if (!chatInput.trim() || !selectedChannel || !currentUser) return;
    const contentToSend = chatInput;
    setChatInput("");

    // Optimistic update.
    const tempMessage = {
      id: `temp-${Date.now()}`,
      channel_id: selectedChannel.id,
      sender_id: currentUser.id,
      content: contentToSend,
      created_at: new Date().toISOString(),
    };
    setChannelMessages((prev) => [...prev, tempMessage]);

    const res = await sendChannelMessage({
      channel_id: selectedChannel.id,
      sender_id: currentUser.id,
      content: contentToSend,
    });
    if (res.error) {
      setChannelMessages((prev) =>
        prev.filter((msg) => msg.id !== tempMessage.id)
      );
      alert("Error sending message: " + res.error);
    }
  }

  // Optionally, allow user to navigate to a page where they join a channel.
  // For now, assume the Explore page’s "Join" button already stores channel IDs in localStorage.
  // On this page, we display only channels whose IDs are in joinedChannels.
  
  return (
    <div className="flex h-screen">
      {/* Left Column: Global Navbar */}
      <Navbar />
      
      {/* Middle Column: Joined Channels List */}
      <div className="w-64 bg-gray-100 p-4 border-r border-gray-300 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Joined Channels</h2>
        {joinedChannelsList.length === 0 ? (
          <p className="text-gray-600 text-sm">
            You havent joined any channels. Go to Explore to join one.
          </p>
        ) : (
          joinedChannelsList.map((channel) => (
            <div
              key={channel.id}
              onClick={() => {
                setSelectedChannel(channel);
                setChannelMessages([]); // clear previous channel messages
              }}
              className={`p-2 mb-2 rounded cursor-pointer transition-colors hover:bg-gray-200 ${
                selectedChannel?.id === channel.id ? "bg-gray-300" : "bg-white"
              }`}
            >
              <span className="font-semibold text-gray-900"># {channel.name}</span>
            </div>
          ))
        )}
      </div>
      
      {/* Right Column: Channel Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar with same gradient as Navbar */}
        <header
          className="h-14 flex items-center px-4"
          style={{
            background: "linear-gradient(to bottom right, #3192A5, #296485)",
          }}
        >
          {selectedChannel ? (
            <h1 className="text-xl font-bold text-white">#{selectedChannel.name}</h1>
          ) : (
            <h1 className="text-xl font-bold text-white">Select a channel</h1>
          )}
        </header>
        
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-blue-50">
          {selectedChannel ? (
            channelMessages.length === 0 ? (
              <p className="text-gray-600">No messages yet in this channel.</p>
            ) : (
              channelMessages.map((msg) => {
                // Determine if the message is from current user.
                const isCurrentUser = msg.sender_id === currentUser?.id;
                return (
                  <div key={msg.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-xs">
                      {!isCurrentUser && (
                        <div className="text-xs text-gray-600 mb-1">
                          {/* Optionally, you could look up the sender's email if available */}
                          {msg.sender_id}
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
        
        {/* Message Input */}
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
