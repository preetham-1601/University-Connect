"use client";
import { useState, useEffect } from "react";
import { useRouter }       from "next/navigation";
import Navbar              from "@/components/Navbar";
import NotificationsDropdown from "@/components/NotificationsDropdown";

import {
  getChannels,
  joinChannel,
  getJoinedChannels,
  getUsers,
  sendFollowRequest,
  getPendingFollowRequests,
  getAcceptedFollowRequests,
  acceptFollowRequest,
  rejectFollowRequest,
} from "@/utils/api";

export default function ExplorePage() {
  const router = useRouter();

  //  Data
  const [channels,    setChannels]    = useState([]);
  const [joinedIds, setJoinedIds] = useState([]);
  const [allUsers,    setAllUsers]    = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading,     setLoading]     = useState(true);

  // Connection state
  const [incoming, setIncoming] = useState([]);  // pending TO me
  const [accepted, setAccepted] = useState([]);  // connected user IDs
  const [outgoing, setOutgoing] = useState([]);  // pending FROM me

  const [search, setSearch] = useState("");

  // ─── 1) Load outgoing from localStorage on client only ───
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("pendingOutgoing") || "[]");
      setOutgoing(saved);
    }
  }, []);

  // ─── 2) Load my profile, channels & users ───
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    // Load current user
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile?token=${token}`)
      .then((r) => r.json())
      .then((d) => setCurrentUser(d.user))
      .catch(() => router.push("/login"));

    // Load channels + people
    Promise.all([getChannels(), getUsers()])
      .then(([cRes, uRes]) => {
        setChannels(cRes.channels || []);
        setAllUsers(uRes.users || []);
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!currentUser) return;
    getJoinedChannels(currentUser.id)
      .then(d => setJoinedIds(d.joined || []));
  }, [currentUser]);

  const handleJoinChannel = (ch) => {
    joinChannel({ channelId: ch.id, userId: currentUser.id })
    .then(() => {
      setJoinedIds(ids => [...ids, ch.id]);
      // redirect into that channel’s chat page
      router.push(`/channels/${ch.id}`);
    })
    .catch(console.error);
  };

  // ─── 3) Once we know “me”, fetch incoming + accepted ───
  useEffect(() => {
    if (!currentUser) return;

    getPendingFollowRequests(currentUser.id)
      .then((res) => setIncoming(res.pending || []))
      .catch(console.error);

    getAcceptedFollowRequests(currentUser.id)
      .then((res) => setAccepted(res.accepted || []))
      .catch(console.error);
  }, [currentUser]);

  // ─── 4) Persist outgoing whenever it changes ───
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pendingOutgoing", JSON.stringify(outgoing));
    }
  }, [outgoing]);

  // ─── Handlers ───
  const handleFollow = async (userId) => {
    await sendFollowRequest({
      requester_id: currentUser.id,
      target_id: userId,
    });
    setOutgoing((o) => [...o, userId]);
  };

  const handleAccept = async (reqId, requesterId) => {
    await acceptFollowRequest({
      requestId: reqId,
      user_id: currentUser.id,
    });
    setAccepted((a) => [...a, requesterId]);
    setIncoming((i) => i.filter((r) => r.id !== reqId));
  };

  const handleReject = async (reqId) => {
    await rejectFollowRequest({ requestId: reqId });
    setIncoming((i) => i.filter((r) => r.id !== reqId));
  };


  if (loading) return <div className="p-6">Loading…</div>;

  // ─── Filters (only search) ───
  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPeople = allUsers
    .filter((u) => {
      // exclude myself if known
      if (currentUser && u.id === currentUser.id) return false;
      return u.email.toLowerCase().includes(search.toLowerCase());
    });

  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1 bg-gray-50 p-4 overflow-auto">
        {/* Header */}
        <header
          className="flex items-center justify-between mb-6 p-4"
          style={{
            background: "linear-gradient(to bottom right, #3192A5, #296485)",
          }}
        >
          <h1 className="text-3xl font-bold text-white">
            Explore Groups & People
          </h1>
          {currentUser && (
            <NotificationsDropdown currentUserId={currentUser.id} />
          )}
        </header>

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 mb-6 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Channels */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Channels</h2>
          {filteredChannels.length === 0 ? (
            <p className="text-gray-600">No channels available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChannels.map(ch => {
                const joined = joinedIds.includes(ch.id);
                return (
                  <div key={ch.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                    <span>{ch.name}</span>
                    <button
                      onClick={() => handleJoinChannel(ch)}
                      disabled={joined}
                      className={joined ? "bg-gray-400 text-white px-3 py-1 rounded" : "bg-blue-500 px-3 py-1 rounded text-white"}
                    >
                      {joined ? "Joined" : "Join"}
                    </button>
                  </div>
               );
             })}
            </div>
          )}
        </section>

        {/* People */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">People</h2>
          {filteredPeople.length === 0 ? (
            <p className="text-gray-600">No people to explore.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {filteredPeople.map((person) => {
                const inc = incoming.find((r) => r.requester_id === person.id);
                const out = outgoing.includes(person.id);
                const acc = accepted.includes(person.id);

                let button;
                if (inc) {
                  button = (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAccept(inc.id, person.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(inc.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  );
                } else if (acc) {
                  button = (
                    <button className="bg-gray-400 text-white px-3 py-1 rounded">
                      Connected
                    </button>
                  );
                } else if (out) {
                  button = (
                    <button className="bg-gray-400 text-white px-3 py-1 rounded">
                      Requested
                    </button>
                  );
                } else {
                  button = (
                    <button
                      onClick={() => handleFollow(person.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Follow
                    </button>
                  );
                }

                return (
                  <div
                    key={person.id}
                    className="bg-white p-4 rounded shadow flex flex-col items-center"
                  >
                    <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl text-blue-700">
                        {person.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="font-semibold mb-2 text-center">
                      {person.email}
                    </p>
                    {button}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
