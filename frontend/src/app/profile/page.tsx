'use client';

import { useState, useEffect } from 'react';

interface UserData {
  name: string;
  email: string;
  major: string;
  interests: string[];
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // In real app, fetch user data from backend
    setUserData({
      name: 'John Doe',
      email: 'john@charlotte.edu',
      major: 'Computer Science',
      interests: ['AI', 'Sports', 'Startups'],
    });
  }, []);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p className="mb-2"><strong>Name:</strong> {userData.name}</p>
        <p className="mb-2"><strong>Email:</strong> {userData.email}</p>
        <p className="mb-2"><strong>Major:</strong> {userData.major}</p>
        <p className="mb-2">
          <strong>Interests:</strong> {userData.interests.join(', ')}
        </p>
      </div>
    </div>
  );
}
