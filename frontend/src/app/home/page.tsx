'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [feed, setFeed] = useState<string[]>([]);

  useEffect(() => {
    // In real app, fetch feed from your backend
    setFeed([
      'Welcome to University Connect!',
      'Important: Next week is sports day!',
      'New Startup Club launched - join now!',
    ]);
  }, []);

  function handleUniConClick() {
    router.push('/unicon');
  }

  function handleProfileClick() {
    router.push('/profile');
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Nav bar */}
      <div className="flex items-center justify-between bg-gray-200 p-4">
        <h1 className="text-xl font-bold">University Connect - Home</h1>
        <div className="space-x-2">
          <button onClick={handleProfileClick} className="bg-green-500 text-white px-3 py-1 rounded">
            Profile
          </button>
          <button onClick={handleUniConClick} className="bg-blue-500 text-white px-3 py-1 rounded">
            Get into UniCon
          </button>
        </div>
      </div>

      {/* Main feed content */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-2">University Feed</h2>
        <ul className="space-y-2">
          {feed.map((item, idx) => (
            <li key={idx} className="bg-white p-2 border rounded">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
