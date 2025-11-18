"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setMessage(data.message);
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-screen bg-background text-foreground">
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-15 rounded-lg shadow-md flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Login
        </button>
        <div className="flex flex-box gap-4">
          <button className="hover:bg-black text-white p-2 rounded transition-colors">
              Login with Google
          </button>
          <button className="hover:bg-black text-white p-2 rounded transition-colors">
              Login with GitHub
          </button>
        </div>
        <p>{message}</p>
      </form>
    </div>
  );
}
