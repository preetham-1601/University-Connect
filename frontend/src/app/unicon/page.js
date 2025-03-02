"use client";
import { useState } from "react";

export default function UniConPage() {
  // Categories in your university connect
  const categories = ["Clubs", "Events", "Startups", "Projects", "Dorms"];

  // Track the currently selected category
  const [selectedCategory, setSelectedCategory] = useState("Clubs");

  // Store messages by category (local state for demo)
  const [messagesByCategory, setMessagesByCategory] = useState({
    Clubs: [],
    Events: [],
    Startups: [],
    Projects: [],
    Dorms: [],
  });

  // Track input for sending new message
  const [input, setInput] = useState("");

  // Handle category click in the sidebar
  function handleCategorySelect(category) {
    setSelectedCategory(category);
  }

  // Send a message to the selected category
  function handleSend() {
    if (!input.trim()) return;
    setMessagesByCategory((prev) => {
      // Copy existing messages for the current category
      const newMessages = [...prev[selectedCategory], input];
      // Return updated state with new message appended
      return {
        ...prev,
        [selectedCategory]: newMessages,
      };
    });
    setInput("");
  }

  // Get messages for the currently selected category
  const messages = messagesByCategory[selectedCategory];

  return (
    <div className="h-screen flex">
      {/* Sidebar with categories */}
      <div className="w-64 bg-gradient-to-br from-[#3192A5] to-[#296485] text-white p-4">
        <h2 className="text-xl font-bold mb-4">UniCon Channels</h2>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat}
              className={`cursor-pointer p-2 rounded hover:bg-[#296485]/80 ${
                selectedCategory === cat ? "bg-[#296485]/80" : ""
              }`}
              onClick={() => handleCategorySelect(cat)}
            >
              #{cat}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#ACF1FF] bg-opacity-50">
        {/* Header */}
        <div className="border-b p-3 font-bold text-xl">
          #{selectedCategory}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet in #{selectedCategory}...</p>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="text-sm bg-white p-2 rounded shadow">
                <span className="font-bold mr-2">User:</span>
                {msg}
              </div>
            ))
          )}
        </div>

        {/* Input Box */}
        <div className="p-3 border-t flex">
          <input
            className="flex-1 border rounded px-2 py-1 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message #${selectedCategory}`}
          />
          <button
            onClick={handleSend}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
