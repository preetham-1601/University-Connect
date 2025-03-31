// /frontend/src/app/home/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      // In a real app, decode token or fetch user from supabase
      // Suppose we stored user_metadata in the token or from last login
      setUserEmail("user@charlotte.edu"); 
      setUniversityName("Charlotte University");
    }
  }, [router]);

  function handleSend() {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, { user: userEmail, text: chatInput }]);
    setChatInput("");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <div>
          <h1 className="text-xl font-bold inline-block mr-4">University Connect</h1>
          <button
            className="inline-block text-sm underline"
            onClick={() => router.push("/profile")}
          >
            Profile
          </button>
        </div>
        <button onClick={handleLogout} className="px-4">
          Logout
        </button>
      </nav>

      {/* Feed / Chat area */}
      <div className="flex-1 p-4 bg-blue-50 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">University Newsletter</h2>
        <p className="mb-4">This is where you can show feed from the university, events, etc.</p>

        <div className="mb-4 border p-2 bg-white rounded shadow">
          <h3 className="font-semibold mb-1">Chat with others</h3>
          <div className="border p-2 h-64 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className="mb-1">
                <span className="font-bold">{msg.user}:</span> {msg.text}
              </div>
            ))}
          </div>
          <div className="flex mt-2">
            <input
              className="border p-2 flex-1"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask what's happening at the university..."
            />
            <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2">
              Send
            </button>
          </div>
        </div>

        <div className="border p-2 bg-white rounded shadow">
          <h3 className="font-semibold mb-1">What&apos;s happening at the university?</h3>
          <textarea
            className="border w-full p-2 mb-2"
            placeholder="Share or ask something..."
          />
          <button className="bg-blue-500 text-white px-4 py-2">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
