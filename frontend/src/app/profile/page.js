"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/utils/api";
import Navbar from "@/components/Navbar";
import { FiEdit } from "react-icons/fi";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    getProfile(token).then(res => {
      if (res.error) return router.push("/login");
      setUser(res.user);
      setProfile(res.profile || {});
      setLoading(false);
    });
  }, [router]);

  if (loading) return <p className="p-8">Loading…</p>;

  const fields = ["full_name","avatar_url","banner_url","bio","interests"];
  const filled = fields.filter(f => profile[f] && (Array.isArray(profile[f]) ? profile[f].length : true)).length;
  const progress = Math.round((filled/fields.length)*100);

  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Banner */}
        <div className="h-48 bg-gray-200 relative">
          {profile.banner_url && (
            <img src={profile.banner_url}
                 className="object-cover w-full h-full" />
          )}
          <img
            src={profile.avatar_url || "/default-avatar.png"}
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-white absolute -bottom-16 left-12 object-cover"
          />
          <button
            onClick={() => router.push("/profile/edit")}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100"
          >
            <FiEdit className="text-[#3192A5]" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-20 px-12 pb-8">
          <h1 className="text-3xl font-bold">{profile.full_name || user.email}</h1>
          <p className="text-gray-600 mt-1">{profile.bio || "No bio yet."}</p>

          {/* Progress bar */}
          <div className="my-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-700">Profile completeness</span>
              <span className="text-sm text-gray-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#3192A5] h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Interests */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Interests</h2>
            {profile.interests?.length ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map(i => (
                  <span key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {i}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No interests added yet.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
