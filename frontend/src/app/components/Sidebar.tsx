'use client';

import { useState } from 'react';

export default function Sidebar() {
  const [channels] = useState([
    { id: 'home', name: 'Home' },
    { id: 'sports', name: 'Sports' },
    { id: 'arts', name: 'Arts' },
    { id: 'dorms', name: 'Dorms' },
  ]);

  const [dms] = useState([
    { id: 'u1', name: 'Alice' },
    { id: 'u2', name: 'Bob' },
  ]);

  return (
    <div
      className='w-64 text-gray-100 flex flex-col'
      style={{
        background: 'linear-gradient(to bottom, #3192A5 0%, #296485 100%)',
      }}
    >
      <div className='p-4 font-bold text-xl border-b border-gray-700'>
        UniConnect
      </div>
      <div className='flex-1 overflow-y-auto p-2'>
        <div className='mb-2'>
          <div className='uppercase text-xs text-gray-200 mb-1'>Channels</div>
          {channels.map((ch) => (
            <div
              key={ch.id}
              className='py-1 px-2 hover:bg-gray-700/40 rounded cursor-pointer'
            >
              {ch.name}
            </div>
          ))}
        </div>

        <div className='mt-4'>
          <div className='uppercase text-xs text-gray-200 mb-1'>Direct Messages</div>
          {dms.map((user) => (
            <div
              key={user.id}
              className='py-1 px-2 hover:bg-gray-700/40 rounded cursor-pointer'
            >
              {user.name}
            </div>
          ))}
        </div>
      </div>
      <div className='p-3 border-t border-gray-700/60'>
        <div className='text-sm'>Your Profile</div>
      </div>
    </div>
  );
}
