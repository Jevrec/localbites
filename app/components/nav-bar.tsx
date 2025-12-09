"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react"
import { UserIcon } from "@heroicons/react/16/solid";


const Links = [
    { href: "/studio", text: 'Sanity' },
    { href: "/restaurants", text: 'Restaurants' },
    { href: "/most-search", text: 'Most searched' },
];

const Navbar = () => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-surface text-foreground px-4 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <Link href="/" className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg transition-colors">
          Home
        </Link>

        <ul className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
          <li>
            {
              session ? (
                <Link href="/user"className="hover:text-accent transition-colors flex flex-box">
                  <UserIcon className="w-5 h-5" />
                  {session.user?.name}
                </Link>
              ) : (
                <p></p>
              )
            }
          </li>
          {Links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-accent transition-colors"
              >
                {link.text}
              </Link>
            </li>
          ))}
          
          <li>
            {isLoading ? (
              <span className="text-muted">...</span>
            ) : session ? (
              <button
                onClick={handleLogout}
                className="hover:text-accent transition-colors cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="hover:text-accent transition-colors"
              >
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
