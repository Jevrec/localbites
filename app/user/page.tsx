"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UserPageSkeleton from "../skeletons/UserPageSkeleton";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session]);

  async function fetchUserData() {
    
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();

      if (data.user) {
        setUsername(data.user.username || "");
        setEmail(data.user.email || "");
        setProfileImage(data.user.profileImage || "");
        console.log("Profile image URL:", data.user.profileImage);
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword && newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          currentPassword: newPassword ? currentPassword : undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage("Profile updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setMessage("Failed to update profile");
    }

    setLoading(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/user/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (data.imageUrl) {
        setProfileImage(data.imageUrl);
        setMessage("Profile image updated!");
      } else {
        setMessage(data.error || "Failed to upload image");
      }
    } catch (err) {
      setMessage("Failed to upload image");
    }

    setImageUploading(false);
    
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen">
        <UserPageSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-30 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-surface rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  width={150}
                  height={150}
                  className="rounded-full object-cover w-32 h-32"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold">
                  {username?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              
              <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer hover:bg-accent transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h4l2-3h6l2 3h4v13H3V7z"
                  />
                  <circle cx="12" cy="13" r="4" strokeWidth={2} />
                </svg>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                />
              </label>
            </div>

            {imageUploading && (
              <p className="text-sm text-muted mt-2">Uploading...</p>
            )}
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeWidth="2" d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 22a8 8 0 1116 0H4z" />
                </svg>
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 input-box"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeWidth="2" d="M4 4h16v16H4z" />
                  <path strokeWidth="2" d="M4 4l8 8 8-8" />
                </svg>
                Email
              </label>

              <input
                type="email"
                value={email}
                className="w-full px-4 py-2 border border-muted rounded-lg cursor-not-allowed"
                disabled
              />
            </div>

           
            <div className="border-t border-muted pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeWidth="2" d="M6 10V8a6 6 0 1112 0v2h1v12H5V10h1zm3 0h6V8a3 3 0 10-6 0v2z" />
                </svg>
                Change Password
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Password
                  </label>

                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 input-box"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Password
                  </label>

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 input-box"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 input-box"
                  />
                </div>
              </div>
            </div>

            {message && (
              <p
                className={`text-sm text-center ${
                  message.includes("success")
                }`}
              >
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
