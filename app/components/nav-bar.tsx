"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { UserIcon } from "@heroicons/react/16/solid";

const LINKS = [{ href: "/history", text: "Your activity" }];

const Navbar = () => {
  const { data: session, status } = useSession();

  // status === "loading" pomeni da NextAuth še preverja sejo
  const isLoading = status === "loading";

  // Role je custom field (ni del standardnega NextAuth user tipa)
  const isAdmin = (session?.user as any)?.role === "admin";

  /**
   * Odjava preko NextAuth; callbackUrl vrne userja na home.
   */
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-surface text-foreground px-4 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <Link href="/" className="text-4xl font-bold text-foreground m-3 interactive-text">
          Localbites
        </Link>

        <ul className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
          {/* Profile link samo ko si prijavljen */}
          <li>
            {session ? (
              <Link href="/user" className="interactive-text font-semibold flex flex-box">
                <UserIcon className="w-5 h-5" />
                <p>Profile</p>
              </Link>
            ) : null}
          </li>

          {/* ostali linki so vidni samo ko si prijavljen */}
          {LINKS.map((link) => (
            <li key={link.href}>
              {session ? (
                <Link href={link.href} className="interactive-text font-semibold">
                  {link.text}
                </Link>
              ) : null}
            </li>
          ))}

          {/* Admin link samo za admin uporabnike preveri pri login ali je to user ali admin */}
          {isAdmin && (
            <li>
              <Link href="/admin" className="interactive-text font-semibold">
                Admin Dashboard
              </Link>
            </li>
          )}

          {/* auth action: loading -> placeholder, logged-in -> logout, else -> login */}
          <li>
            {isLoading ? (
              <span className="text-muted">•••••</span>
            ) : session ? (
              <button onClick={handleLogout} className="interactive-text font-semibold cursor-pointer">
                Logout
              </button>
            ) : (
              <Link href="/login" className="interactive-text font-semibold cursor-pointer">
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
