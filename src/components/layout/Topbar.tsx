"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BiBell,
  BiChevronDown,
  BiSearch,
  BiLogOut,
} from "react-icons/bi";

import type { UserRole } from "@/types/auth";

type TopbarProps = {
  role: UserRole;
  userName: string;
};

const ROLE_COLORS: Record<UserRole, string> = {
  student: "bg-blue-100 text-blue-700",
  teacher: "bg-emerald-100 text-emerald-700",
  admin: "bg-violet-100 text-violet-700",
};

const Topbar = ({ role, userName }: TopbarProps) => {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <div className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="hidden w-full max-w-md items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm md:flex">
          <BiSearch className="h-4 w-4 text-zinc-500" />
          <input
            placeholder="Search courses, lessons, resources…"
            className="w-full bg-transparent outline-none placeholder:text-zinc-400"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Role pill */}
          <span
            className={`hidden rounded-full px-3 py-1 text-xs font-semibold md:inline-flex ${ROLE_COLORS[role]}`}
          >
            {role.toUpperCase()}
          </span>

          {/* Notifications */}
          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50"
            aria-label="Notifications"
          >
            <BiBell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="inline-flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                {initials}
              </span>
              <div className="hidden leading-tight sm:block text-left">
                <p className="text-sm font-semibold text-zinc-900">{userName}</p>
                <p className="text-xs text-zinc-500 capitalize">{role}</p>
              </div>
              <BiChevronDown className="hidden h-4 w-4 text-zinc-500 sm:block" />
            </button>

            {profileOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                {/* Dropdown */}
                <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-zinc-200 bg-white py-1 shadow-xl">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50"
                  >
                    View Profile
                  </Link>
                  <div className="my-1 border-t border-zinc-100" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <BiLogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;