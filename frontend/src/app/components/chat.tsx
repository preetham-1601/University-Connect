'use client';

import React, { useState } from 'react';

interface ChatProps {
  channelName: string;
}

export default function Chat({ channelName }: ChatProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  function handleSend() {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, input]);
    setInput('');
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Channel Header */}
      <div className="border-b p-3 font-bold">
        #{channelName}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm">
            <span className="font-bold mr-2">User:</span>
            {msg}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-2 border-t flex">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message #${channelName}`}
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
