'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // If you prefer to redirect to /login immediately:
    router.push('/login');
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-2xl">Welcome to University Connect!</h1>
    </div>
  );
}
