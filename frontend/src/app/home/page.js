"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#3192A5] text-white p-4 flex justify-between">
        <h1 className="text-2xl">University Connect</h1>
        <div>
          <button className="px-4" onClick={() => router.push("/profile")}>Profile</button>
          <button className="px-4" onClick={() => router.push("/unicon")}>Get into UniCon</button>
        </div>
      </nav>

      {/* Feed */}
      <div className="p-6 flex-1 bg-[#ACF1FF] bg-opacity-50">
        <h2 className="text-xl font-bold">University Feed</h2>
        <p className="mt-2">This is where university-wide news and discussions will appear.</p>
      </div>
    </div>
  );
}
