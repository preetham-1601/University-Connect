'use client';

import Chat from './components/chat';

export default function HomePage() {
  return (
    <div className='h-full flex flex-col'>
      {/* Channel Header */}
      <div className='border-b p-3 font-bold text-lg'>
        # Home Channel
      </div>

      {/* Chat Area */}
      <div className='flex-1'>
        <Chat channelId='home' />
      </div>
    </div>
  );
}
