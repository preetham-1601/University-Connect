"use client";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#3192A5] to-[#296485] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to University Connect</h1>
        <p className="mt-4 text-lg">A place for university students to chat, collaborate, and share ideas.</p>
        <button
          className="mt-6 px-6 py-2 bg-white text-[#3192A5] font-bold rounded hover:bg-gray-200"
          onClick={() => router.push("/login")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
