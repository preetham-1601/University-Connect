// /frontend/src/app/profile/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, updateProfile } from "@/utils/api";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  // local fields
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.push("/login");
      return;
    }
    setToken(t);

    // fetch user profile
    getProfile(t).then((res) => {
      if (res.error) {
        setError(res.error);
      } else {
        setUser(res.user);
        const meta = res.user.user_metadata || {};
        setFullName(meta.fullName || "");
        setBio(meta.bio || "");
        setAvatarURL(meta.avatarURL || "");
        setInterests(meta.interests || []);
      }
    });
  }, [router]);

  function handleSave() {
    updateProfile({ token, fullName, bio, avatarURL, interests }).then((res) => {
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/home");
      }
    });
  }

  if (!user && !error) return <p>Loading profile...</p>;

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-md mx-auto bg-white p-4 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <label className="block mb-1">Full Name</label>
        <input
          className="border p-2 w-full mb-2"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label className="block mb-1">Avatar URL</label>
        <input
          className="border p-2 w-full mb-2"
          value={avatarURL}
          onChange={(e) => setAvatarURL(e.target.value)}
        />

        <label className="block mb-1">Bio</label>
        <textarea
          className="border p-2 w-full mb-2"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <label className="block mb-1">Interests (comma separated?)</label>
        <input
          className="border p-2 w-full mb-2"
          value={interests.join(",")}
          onChange={(e) => setInterests(e.target.value.split(","))}
        />

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}
