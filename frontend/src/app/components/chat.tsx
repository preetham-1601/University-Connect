'use client';

import { useState } from 'react';

export default function Chat({ channelId }: { channelId: string }) {
  const [messages, setMessages] = useState([
    { id: 1, user: 'System', text: 'Welcome to the Home channel!' },
  ]);
  const [input, setInput] = useState('');

  function handleSend() {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      user: 'You',
      text: input,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Message List */}
      <div className='flex-1 overflow-y-auto p-4 space-y-2'>
        {messages.map((msg) => (
          <div key={msg.id} className='text-sm'>
            <span className='font-bold mr-2'>{msg.user}:</span>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className='p-2 border-t flex'>
        <input
          className='flex-1 border rounded px-2 py-1 text-sm'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message #${channelId}`}
        />
        <button
          onClick={handleSend}
          className='ml-2 bg-blue-500 text-white px-3 py-1 rounded text-sm'
        >
          Send
        </button>
      </div>
    </div>
  );
}
