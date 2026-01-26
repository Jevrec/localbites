"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterForm() {
  // kontrolirani inputi + UI feedback (napake / loading)
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Registracija preko backend endpointa
   * Backend vrača { error?: string } v UI pokažemo error ali success message
   */
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

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
      className="bg-surface py-10 px-15 rounded-lg shadow-md flex flex-col gap-4 w-110"
    >
      <h1 className="text-2xl font-bold">Register</h1>

      <input
        className="input-box mb-1"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="text"
        className="input-box mb-1"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="password"
        className="input-box mb-1"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className="btn" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      <p className="text-center mt-2">
        Go Back to{" "}
        <Link href="/login" className="text-center text-muted interactive-text">
          Login
        </Link>
      </p>

      {/* indikator nalaganja med registracijo */}
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-foreground border-solid"></div>
        </div>
      )}

      {/* server odgovor če je uspešno ali ne */}
      <p className="text-sm mt-2 text-center">{message}</p>
    </form>
  );
}
