"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ManageUserSkeleton from "@/app/skeletons/ManageUserSkeleton";

interface User {
  _id: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  profileImage?: string;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("");
  const [newUsername, setNewUsername] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      const userRole = (session.user as any)?.role;
      if (userRole !== "admin") {
        alert("Access denied. Admin only.");
        router.push("/");
        return;
      }

      fetchUsers();
    }
  }, [status, session, router]);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(user: User) {
    setEditingUser(user);
    setNewRole(user.role);
    setNewUsername(user.username);
  }

  function cancelEdit() {
    setEditingUser(null);
    setNewRole("");
    setNewUsername("");
  }

  async function saveChanges() {
  if (!editingUser) return;

  try {
    console.log("Sending update:", {
      userId: editingUser._id,
      role: newRole,
      username: newUsername,
    });

    const res = await fetch(`/api/admin/users/${editingUser._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: newRole,
        username: newUsername,
      }),
    });

    const data = await res.json();
    console.log("Response:", data); 

    if (!res.ok) {
      throw new Error(data.error || data.details || "Failed to update user");
    }

    alert("User updated successfully!");
    cancelEdit();
    fetchUsers();
  } catch (err) {
    console.error("Failed to update user:", err);
    alert(`Failed to update user: ${err instanceof Error ? err.message : String(err)}`);
  }
}

  async function deleteUser(userId: string, username: string) {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      alert("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("sl-SI", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 bg-surface rounded w-64 mb-8 animate-pulse"></div>
        <ManageUserSkeleton />
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">Manage Users</h1>
          <button
            onClick={() => router.push("/admin")}
            className="btn"
          >
            ← Back to Dashboard
          </button>
        </div>

        
        <div className="bg-surface rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-background transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold text-foreground">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-red-500/20 text-red-600"
                            : "bg-green-500/20 text-green-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                      {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => startEdit(user)}
                        className="interactive-text mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(user._id, user.username)}
                        className="interactive-text"
                        disabled={user._id === session?.user?.id}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        
        <div className="mt-4 text-sm text-muted">
          Total users: {users.length}
        </div>
      </div>

      
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-foreground mb-6">Edit User</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="user" className="bg-background">User</option>
                  <option value="admin" className="bg-background">Admin</option>
                </select>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={saveChanges}
                  className="flex-1 btn"
                >
                  Save Changes
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex-1 btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}