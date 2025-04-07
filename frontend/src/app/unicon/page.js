"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, getUsers, getMessages, sendMessage } from "@/utils/api";

export default function UniconPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // On component mount, fetch current user profile and all user profiles.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Get current user profile
    getProfile(token).then((res) => {
      if (res && res.user) {
        setCurrentUser(res.user);
      }
    });
    // Get all user profiles from the profiles table
    getUsers().then((res) => {
      if (res && res.users) {
        setAllUsers(res.users);
      }
    });
  }, [router]);

  // Whenever the selected user changes, fetch the messages between currentUser and selectedUser.
  useEffect(() => {
    if (currentUser && selectedUser) {
      getMessages(currentUser.id, selectedUser.id).then((res) => {
        if (!res.error) {
          setMessages(res.messages);
        }
      });
    }
  }, [currentUser, selectedUser]);
  

  // Send a new message
  async function handleSend() {
    if (!chatInput.trim() || !currentUser || !selectedUser) return;
    const res = await sendMessage({
      sender_id: currentUser.id,
      receiver_id: selectedUser.id,
      content: chatInput,
    });
    if (res && !res.error) {
      setMessages((prevMessages) => [...prevMessages, res.newMessage]);
      setChatInput("");
    }
  }

  // Logout by clearing token and redirecting to login
  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="flex h-screen">
      {/* Left Panel: List of available users (excluding the current user) */}
      <div className="w-1/4 bg-gradient-to-b from-[#3192A5] to-[#296485] text-white p-4">
        <h2 className="text-xl font-bold mb-4">Available Users</h2>
        {allUsers
          .filter((u) => currentUser && u.id !== currentUser.id)
          .map((user) => (
            <div
              key={user.id}
              className={`cursor-pointer hover:underline mb-1 ${selectedUser && selectedUser.id === user.id ? "underline" : ""}`}
              onClick={() => setSelectedUser(user)}
            >
              {user.email}
            </div>
          ))}
        <p className="mt-4 text-sm">Click a user to start chatting</p>
      </div>

      {/* Right Panel: Chat Interface */}
      <div className="w-3/4 flex flex-col">
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            {selectedUser ? `Chat with ${selectedUser.email}` : "Select a user to chat"}
          </h1>
          <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded">
            Logout
          </button>
        </nav>
        <div className="flex-1 bg-blue-50 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="mb-2">
                <span className="font-bold">
                  {msg.sender_id === currentUser?.id ? "You" : selectedUser?.email}:
                </span>{" "}
                {msg.content}
              </div>
            ))
          )}
        </div>
        <div className="p-4 bg-white flex">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border p-2"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 ml-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
