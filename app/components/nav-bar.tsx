import { Imperial_Script } from "next/font/google";
import Link from "next/link";
import React from 'react';

const Links = [
    { href: "/proflie", text: 'Profile' },
    { href: "/query", text: 'Query' },
    { href: "/restaurants", text: 'Restaurants' },
    { href: "/most-search", text: 'Most searched' }
];

const Navbar = () => {
  return (
    <nav className="nav_bar text-text px-4 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <Link href="/" className="btn px-4 py-2 rounded text-white">
          Home
        </Link>

        <ul className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
          {Links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-accent transition-colors">
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};


export default Navbar;
