'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    try {
      // Call your Express backend
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Login failed');
        return;
      }

      // Store token or user if needed
      // localStorage.setItem('token', data.token);

      // Redirect to home
      router.push('/home');
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  }

  return (
    <div className="h-screen flex">
      {/* Left half */}
      <div className="w-1/2 flex items-center justify-center bg-blue-200">
        <h1 className="text-3xl font-bold">University Connect</h1>
      </div>

      {/* Right half (login form) */}
      <div className="w-1/2 flex items-center justify-center">
        <form onSubmit={handleLogin} className="p-4 border rounded w-2/3 max-w-md">
          <h2 className="text-xl mb-4">Sign In</h2>
          {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              className="border p-2 w-full"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@charlotte.edu"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              className="border p-2 w-full"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
