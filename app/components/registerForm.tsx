"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();
    setMessage(data.error || "Account created!");

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleRegister}
      className="bg-surface p-15 rounded-lg shadow-md flex flex-col gap-4 w-110"
    >
      <h1 className="text-2xl font-bold">Register</h1>

      <input
        className="input-box"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="text"
        className="input-box"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="password"
        className="input-box"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button 
        className="btn"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-foreground border-solid"></div>
        </div>
      )}

      <p className="text-sm mt-2 text-center">{message}</p>
    </form>
  );
}