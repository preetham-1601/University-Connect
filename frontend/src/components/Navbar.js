// src/components/Navbar.js
"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiUser, FiMessageCircle, FiPlus, FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Define nav items with their respective routes.
  const navItems = [
    { route: "/home", icon: <FiHome />, label: "Home" },
    { route: "/profile", icon: <FiUser />, label: "Profile" },
    { route: "/unicon", icon: <FiMessageCircle />, label: "DMs" },
    { route: "/channels", icon: <FiMessageCircle />, label: "Channels" },
    { route: "/explore", icon: <FiPlus />, label: "Explore" },
  ];

  // Determine if an icon should be enlarged based on matching the current path.
  const isActive = (route) =>
       pathname === route || pathname.startsWith(`${route}/`);

  return (
    <div
      className="flex flex-col h-full p-4"
      style={{ background: "linear-gradient(to bottom right, #3192A5, #296485)" }}
    >
      <div className="flex-grow" />
      <div className="flex flex-col items-center space-y-3">
        {navItems.map((item) => {
          const active = isActive(item.route);
          return (
            <button
              key={item.route}
              onClick={() => router.push(item.route)}
              className="flex items-center justify-center rounded-full bg-white transition-all hover:scale-110 shadow"
              style={{
                width: active ? "60px" : "40px",
                height: active ? "60px" : "40px",
              }}
              title={item.label}
            >
              {React.cloneElement(item.icon, {
                size: active ? 28 : 18,
                className: "text-[#3192A5]",
              })}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-center">
        <button
          onClick={() => router.push("/login")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 transition-all hover:scale-110 shadow"
          title="Logout"
        >
          <FiLogOut size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
