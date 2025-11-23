"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Registration failed.");
    } else {
      setMessage("User registered successfully!");
      setEmail("");
      setUsername("");
      setPassword("");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-screen bg-background text-foreground">
      <form
        onSubmit={handleRegister}
        className="bg-surface p-15 rounded-lg shadow-md flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">Register</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-muted p-2 rounded"
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-muted p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-muted p-2 rounded"
        />

        <button className="bg-primary hover:bg-accent text-white py-2 rounded transition-colors">
          Register
        </button>

        <p className="text-sm mt-2 text-center">{message}</p>
      </form>
    </div>
  );
}
