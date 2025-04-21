"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, upsertProfile } from "@/utils/api";
import Navbar from "@/components/Navbar";

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    full_name:  "",
    avatar_url: "",
    banner_url: "",
    bio:        "",
    interests:  [],
  });
  const [error, setError] = useState("");

  // load existing profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    getProfile(token).then(res => {
      if (res.error) {
        console.error("Fetch profile error:", res.error);
        return router.push("/login");
      }
      const p = res.profile || {};
      setProfile({
        full_name:  p.full_name  || "",
        avatar_url: p.avatar_url || "",
        banner_url: p.banner_url || "",
        bio:        p.bio        || "",
        interests:  p.interests  || [],
      });
    });
  }, [router]);

  // handle save
  async function handleSave() {
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please log in again.");
      return;
    }

    try {
      const res = await upsertProfile({
        token,
        fullName:   profile.full_name,
        avatarURL:  profile.avatar_url,
        bannerURL:  profile.banner_url,
        bio:        profile.bio,
        interests:  profile.interests,
      });
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/profile");   // go straight to view page
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setError("Unexpected error. Please try again.");
    }
  }

  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1 bg-blue-50 p-8 overflow-auto">
        <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}

          {/* Full Name */}
          <label className="block mb-1">Full Name</label>
          <input
            className="w-full border p-2 mb-4"
            value={profile.full_name}
            onChange={e =>
              setProfile({ ...profile, full_name: e.target.value })
            }
          />

          {/* Avatar URL */}
          <label className="block mb-1">Avatar URL</label>
          <input
            className="w-full border p-2 mb-4"
            value={profile.avatar_url}
            onChange={e =>
              setProfile({ ...profile, avatar_url: e.target.value })
            }
          />

          {/* Banner URL */}
          <label className="block mb-1">Banner URL</label>
          <input
            className="w-full border p-2 mb-4"
            value={profile.banner_url}
            onChange={e =>
              setProfile({ ...profile, banner_url: e.target.value })
            }
          />

          {/* Bio */}
          <label className="block mb-1">Bio</label>
          <textarea
            className="w-full border p-2 mb-4"
            rows={3}
            value={profile.bio}
            onChange={e =>
              setProfile({ ...profile, bio: e.target.value })
            }
          />

          {/* Interests */}
          <label className="block mb-1">Interests (comma separated)</label>
          <input
            className="w-full border p-2 mb-6"
            value={profile.interests.join(",")}
            onChange={e =>
              setProfile({
                ...profile,
                interests: e.target.value
                  .split(",")
                  .map(x => x.trim())
                  .filter(Boolean),
              })
            }
          />

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => router.push("/profile")}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#3192A5] text-white rounded hover:bg-[#297485]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
