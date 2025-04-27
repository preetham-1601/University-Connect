// app/channels/layout.js
"use client";
import Navbar from "@/components/Navbar";

export default function ChannelsLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Navbar />
      {children}
    </div>
  );
}
