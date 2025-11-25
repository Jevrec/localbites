"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true)

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setMessage("Invalid email or password");
    } else {
      setMessage("Logged in! Redirecting in 3 seconds...");

      setTimeout(() => {
        router.push("/");
      }, 3000);
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-screen bg-background text-foreground">
      <form
        onSubmit={handleLogin}
        className="bg-surface p-15 rounded-lg shadow-md flex flex-col gap-4 w-110"
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
          <button className="hover:bg-black text-white p-2 rounded transition-colors border-1 border-white w-39">
              Login with Google
          </button>
          <button className="hover:bg-black text-white p-2 rounded transition-colors border-1 border-white w-39">
              Login with GitHub
          </button>
        </div>

        <Link href="register" className="text-center text-muted hover:text-accent transition-colors">
          Register 
        </Link>

        <p>{message}</p>

      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="mt-10 animate-spin rounded-full h-12 w-12 border-t-4 border-foreground border-solid"></div>
        </div>
      )}
      </form>
    </div>
  );
}
