'use client';

import React from 'react';

interface SidebarProps {
  selectedChannel: string;
  onSelectChannel: (ch: string) => void;
}

export default function Sidebar({ selectedChannel, onSelectChannel }: SidebarProps) {
  const channels = ['General', 'Sports', 'Clubs', 'Events', 'Startups', 'Cultural', 'Dorms'];

  return (
    <div className="w-64 bg-gray-800 text-gray-100 flex flex-col">
      <div className="p-4 font-bold border-b border-gray-700">
        UniCon
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-2 text-sm uppercase text-gray-400">Channels</div>
        {channels.map((ch) => (
          <div
            key={ch}
            onClick={() => onSelectChannel(ch)}
            className={`py-1 px-2 cursor-pointer hover:bg-gray-700/50 rounded ${
              selectedChannel === ch ? 'bg-gray-700/50' : ''
            }`}
          >
            {ch}
          </div>
        ))}
      </div>
    </div>
  );
}
