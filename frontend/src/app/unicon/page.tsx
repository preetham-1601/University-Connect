'use client';

import { useState } from 'react';
import Sidebar from '../(components)/Sidebar';
import Chat from '../(components)/Chat';

export default function UniConPage() {
  const [selectedChannel, setSelectedChannel] = useState('General');

  return (
    <div className="h-screen flex">
      <Sidebar selectedChannel={selectedChannel} onSelectChannel={setSelectedChannel} />
      <Chat channelName={selectedChannel} />
    </div>
  );
}
