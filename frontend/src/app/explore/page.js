"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUsers } from "@/utils/api";

export default function ExplorePage() {
  const [channels, setChannels] = useState([]);
  const [people, setPeople] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    // For this MVP, channels are hard-coded.
    setChannels([
      {
        id: 1,
        name: "University Tour",
        description: "Top Featured – Explore campus history and traditions."
      },
      {
        id: 2,
        name: "Startup Discussions",
        description: "Meet your co-founder and share startup ideas."
      },
      {
        id: 3,
        name: "Multi Domain Connect",
        description: "Connect across fields – Computers, Doctors, Students."
      },
      {
        id: 4,
        name: "International Student Connect",
        description: "Network and learn with fellow international students."
      }
    ]);
    // Fetch people using the existing getUsers API.
    getUsers()
      .then((data) => {
        if (!data.error) {
          setPeople(data.users);
        } else {
          setError(data.error);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  // Filter channels and people by search query (if needed).
  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPeople = people.filter((person) =>
    person.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">Explore Groups &amp; People</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Groups Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Groups</h2>
        {filteredChannels.length === 0 ? (
          <p className="text-gray-600">No groups available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                className="bg-white p-4 rounded shadow hover:shadow-md cursor-pointer transition-all"
                onClick={() => router.push(`/channels/${channel.id}`)}
              >
                <h3 className="text-xl font-bold mb-2">{channel.name}</h3>
                <p className="text-gray-700">{channel.description || "No description provided."}</p>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Join
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* People Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">People</h2>
        {filteredPeople.length === 0 ? (
          <p className="text-gray-600">No people to explore.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {filteredPeople.map((person) => (
              <div
                key={person.id}
                className="bg-white p-4 rounded shadow flex flex-col items-center hover:shadow-md cursor-pointer transition-all"
                onClick={() => router.push(`/profile/${person.id}`)}
              >
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-blue-700">
                    {person.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="font-semibold text-center">{person.email}</p>
                <button className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  Follow
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
