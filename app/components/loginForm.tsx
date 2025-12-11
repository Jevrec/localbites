"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setMessage("Invalid email or password");
      setLoading(false);
    } else {
      //setMessage("Logged in! Redirecting in 3 seconds...");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }

  async function handleGoogleLogin() {
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <form
      onSubmit={handleLogin}
      className="bg-surface py-10 px-15 rounded-lg shadow-md flex flex-col gap-4 w-110"
    >
      <h1 className="text-2xl font-bold">Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-box mb-1"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-box mb-1"
        required
      />

      <button 
        className="btn"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      
      <div className="flex flex-col gap-4">
        <button 
          type="button"
          onClick={handleGoogleLogin}
          className="black-btn"
        >
          Login with Google
        </button>
      </div>

      <p className="text-center mt-2">
        Don't have an account?{" "}
        <Link href="register" className="text-center text-muted interactive-text">
          Register
        </Link>
      </p>


      <p className="text-sm mt-2 text-center">{message}</p>

      {loading && (
        <div className="flex justify-center items-center">
          <div className="loading-spin"></div>
        </div>
      )}
    </form>
  );
}