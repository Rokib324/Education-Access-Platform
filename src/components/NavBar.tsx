"use client";

import Link from "next/link";
import { useState } from "react";


export const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const closeMenu = () => setOpenMenu(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            aria-label="Go to homepage"
            onClick={closeMenu}
          >
            {/* Simple logo placeholder */}
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-900 text-sm font-bold text-white">
              EA
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-zinc-900">Education Access</p>
              <p className="text-xs text-zinc-500">For underprivileged learners</p>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6 text-sm text-zinc-700">
            <Link
              href="/"
              className="hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded"
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded"
            >
              Courses
            </Link>
            <Link
              href="/about"
              className="hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpenMenu((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-zinc-700 hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={openMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            {openMenu ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12h18M3 6h18M3 18h18"
              />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {openMenu && (
          <div className="absolute left-0 top-16 w-full border-b border-zinc-200 bg-white md:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-sm">
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                href="/courses"
                className="rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100"
                onClick={closeMenu}
              >
                Courses
              </Link>
              <Link
                href="/about"
                className="rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100"
                onClick={closeMenu}
              >
                Contact
              </Link>

              <div className="mt-2 flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 rounded-md border border-zinc-200 px-3 py-2 text-center font-medium text-zinc-700 hover:bg-zinc-50"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex-1 rounded-md bg-zinc-900 px-3 py-2 text-center font-semibold text-white hover:bg-zinc-800"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
