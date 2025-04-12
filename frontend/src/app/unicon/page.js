// app/unicon/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers, getMessages, sendMessage } from "@/utils/api";
import { supabase } from "@/utils/supabaseClient";
import Navbar from "@/components/Navbar";

export default function UniconPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetch(`http://localhost:5000/api/profile?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      });

    getUsers().then((data) => {
      if (!data.error) setAllUsers(data.users);
    });
  }, [router]);

  useEffect(() => {
    if (currentUser && selectedUser) {
      getMessages(currentUser.id, selectedUser.id).then((res) => {
        if (!res.error) {
          setMessages(res.messages);
        }
      });
    }
  }, [currentUser, selectedUser]);

  useEffect(() => {
    if (!currentUser || !selectedUser) return;
    const subscription = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new;
          if (
            (newMessage.sender_id === selectedUser.id && newMessage.receiver_id === currentUser.id) ||
            (newMessage.sender_id === currentUser.id && newMessage.receiver_id === selectedUser.id)
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentUser, selectedUser]);

  async function handleSend() {
    if (!chatInput.trim() || !currentUser || !selectedUser) return;
    const contentToSend = chatInput;
    setChatInput("");
    const tempMessage = {
      id: `temp-${Date.now()}`,
      sender_id: currentUser.id,
      receiver_id: selectedUser.id,
      content: contentToSend,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);
    const res = await sendMessage({
      sender_id: currentUser.id,
      receiver_id: selectedUser.id,
      content: contentToSend,
    });
    if (res.error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      alert("Error sending message: " + res.error);
    }
  }

  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col bg-blue-50">
        <header className="h-14 flex items-center justify-between px-4 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">
            {selectedUser ? `Chat with ${selectedUser.email}` : "Select a user to chat"}
          </h1>
        </header>
        {!selectedUser ? (
          <div className="p-4 flex-1 overflow-y-auto">
            <h2 className="text-lg font-bold mb-2">Direct Messages</h2>
            {allUsers
              .filter((u) => currentUser && u.id !== currentUser.id)
              .map((user) => (
                <div
                  key={user.id}
                  className="p-2 mb-2 bg-white rounded-full shadow cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedUser(user)}
                >
                  <span className="font-semibold">{user.email}</span>
                </div>
              ))}
            <p className="mt-4 text-sm">Click a user to start chatting</p>
          </div>
        ) : (
          <>
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {messages.length === 0 ? (
                <p className="text-gray-600">No messages yet.</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs p-3 rounded-xl shadow ${msg.sender_id === currentUser?.id ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"}`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="h-14 flex items-center px-4 bg-white border-t">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border p-2 rounded mr-2"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
