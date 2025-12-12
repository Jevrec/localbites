"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react"
import { UserIcon } from "@heroicons/react/16/solid";


const Links = [
    { href: "/history", text: 'Restaurants and History' },
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
        <Link href="/" className="text-4xl font-bold text-foreground m-3 interactive-text">
          Localbites
        </Link>

        <ul className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
          <li>
            {
              session ? (
                <Link href="/user"className="interactive-text flex flex-box">
                  <UserIcon className="w-5 h-5" />
                  <p>Profile</p>
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
                className="interactive-text"
              >
                {link.text}
              </Link>
            </li>
          ))}
          
          <li>
            {isLoading ? (
              <span className="text-muted">•••••</span>
            ) : session ? (
              <button
                onClick={handleLogout}
                className="interactive-text"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="interactive-text"
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
