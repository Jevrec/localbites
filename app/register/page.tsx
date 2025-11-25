"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true)

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();
    setMessage(data.error || "Account created!");

    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-screen bg-background text-foreground">
      <form
        onSubmit={handleRegister}
        className="bg-surface p-15 rounded-lg shadow-md flex flex-col gap-4 w-110"
      >
        <h1 className="text-2xl font-bold">Register</h1>

        <input
          className="border border-muted p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          className="border border-muted p-2 rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="border border-muted p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-primary hover:bg-accent text-white py-2 rounded transition-colors">
          Register
        </button>

        <p className="text-sm mt-2 text-center">{message}</p>
      </form>
    </div>
  );
}
