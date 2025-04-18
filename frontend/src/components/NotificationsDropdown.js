"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiBell } from "react-icons/fi";
import {
  getPendingFollowRequests,
  acceptFollowRequest,
  rejectFollowRequest,
} from "@/utils/api";

export default function NotificationsDropdown({ currentUserId }) {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const dropdownRef = useRef(null);

  // Fetch pending incoming requests whenever dropdown opens
  useEffect(() => {
    if (open && currentUserId) {
      getPendingFollowRequests(currentUserId)
        .then((res) => {
          if (res.pending) setRequests(res.pending);
        })
        .catch(console.error);
    }
  }, [open, currentUserId]);

  // Close on outside click
  useEffect(() => {
    function onClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleAccept(req) {
    await acceptFollowRequest({ requestId: req.id });
    setRequests((r) => r.filter((x) => x.id !== req.id));
  }

  async function handleReject(req) {
    await rejectFollowRequest({ requestId: req.id });
    setRequests((r) => r.filter((x) => x.id !== req.id));
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 hover:bg-white/20 rounded-full transition"
        title="Notifications"
      >
        <FiBell size={24} className="text-white" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg z-50">
          <h2 className="px-4 py-2 border-b font-semibold">Follow Requests</h2>

          {requests.length === 0 ? (
            <p className="p-4 text-gray-600">No pending requests.</p>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between px-4 py-2 border-b last:border-b-0"
              >
                <span className="text-sm font-medium">{req.requester_email}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAccept(req)}
                    className="px-2 py-1 text-sm bg-green-500 text-white rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(req)}
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
