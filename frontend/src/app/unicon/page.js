"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiHome, FiUser, FiMessageCircle, FiPlus, FiLogOut } from "react-icons/fi";
import { getUsers, getMessages, sendMessage } from "@/utils/api";
import { supabase } from "@/utils/supabaseClient";

export default function UniconPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // Navigation handlers.
  const goHome = () => router.push("/home");
  const goProfile = () => router.push("/profile");
  const goChannels = () => router.push("/channels"); // Channels page placeholder
  const goExplore = () => router.push("/explore");   // Explore groups/people page

  // On mount, load current user and available users.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Fetch current user's profile.
    fetch(`http://localhost:5000/api/profile?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch((err) => console.error("Profile fetch error:", err));

    // Fetch all users.
    getUsers().then((data) => {
      if (!data.error) {
        setAllUsers(data.users);
      } else {
        console.error("Error fetching users:", data.error);
      }
    });
  }, [router]);

  // Load historical messages whenever a conversation is selected.
  const loadHistoricalMessages = useCallback(async () => {
    if (currentUser && selectedUser) {
      const res = await getMessages(currentUser.id, selectedUser.id);
      if (!res.error) {
        setMessages(res.messages);
      } else {
        console.error("Error loading messages:", res.error);
      }
    }
  }, [currentUser, selectedUser]);

  useEffect(() => {
    if (currentUser && selectedUser) {
      loadHistoricalMessages();
    }
  }, [currentUser, selectedUser, loadHistoricalMessages]);

  // Setup realtime subscription to new messages.
  useEffect(() => {
    if (!currentUser || !selectedUser) return;
    const subscription = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new;
          // Only add messages that are part of the current DM conversation.
          if (
            (newMessage.sender_id === selectedUser.id && newMessage.receiver_id === currentUser.id) ||
            (newMessage.sender_id === currentUser.id && newMessage.receiver_id === selectedUser.id)
          ) {
            setMessages((prevMessages) => {
              if (prevMessages.find((msg) => msg.id === newMessage.id)) {
                return prevMessages;
              }
              return [...prevMessages, newMessage];
            });
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentUser, selectedUser]);

  // Handle message sending with optimistic update.
  async function handleSend() {
    if (!chatInput.trim() || !currentUser || !selectedUser) return;
    const contentToSend = chatInput;
    // Clear the input immediately.
    setChatInput("");
    // Optimistically add a temporary message.
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

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <aside
        className="w-20 flex flex-col items-center py-4 space-y-4"
        style={{
          background: "linear-gradient(to bottom right, #3192A5 0%, #296485 100%)",
        }}
      >
        {/* Home Icon */}
        <button
          onClick={goHome}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow hover:shadow-md"
        >
          <FiHome size={24} className="text-[#3192A5]" />
        </button>
        {/* Profile Icon */}
        <button
          onClick={goProfile}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow hover:shadow-md"
        >
          <FiUser size={24} className="text-[#3192A5]" />
        </button>
        {/* Direct Messages Icon */}
        <button
          onClick={() => setSelectedUser(null)}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow hover:shadow-md"
        >
          <FiMessageCircle size={24} className="text-[#3192A5]" />
        </button>
        {/* Channels Group */}
        <div className="flex flex-col items-center">
          <button
            onClick={goChannels}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow hover:shadow-md"
          >
            {/* You can change this icon if desired */}
            <FiMessageCircle size={24} className="text-[#3192A5]" />
          </button>
          <p className="text-xs mt-1">Channels</p>
          <button
            onClick={goExplore}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow hover:shadow-md mt-2"
          >
            <FiPlus size={16} className="text-[#3192A5]" />
          </button>
        </div>
        {/* Logout Icon at the Bottom */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow hover:shadow-md"
          >
            <FiLogOut size={24} className="text-[#3192A5]" />
          </button>
        </div>
      </aside>

      {/* Right Panel: Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <nav className="h-14 flex items-center justify-between px-4 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">
            {selectedUser ? `Chat with ${selectedUser.email}` : "Select a user to chat"}
          </h1>
        </nav>
        {/* If no DM is selected, show list of available users for DM */}
        {!selectedUser && (
          <div className="p-4 flex-1 bg-blue-50 overflow-y-auto">
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
        )}
        {/* Chat Interface for the Selected DM */}
        {selectedUser && (
          <>
            <div className="flex-1 p-4 bg-blue-50 overflow-y-auto space-y-2">
              {messages.length === 0 ? (
                <p className="text-gray-600">No messages yet.</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs p-3 rounded-xl shadow ${
                        msg.sender_id === currentUser?.id
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
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
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
