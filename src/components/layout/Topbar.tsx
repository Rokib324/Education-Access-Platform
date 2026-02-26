"use client";

import Link from "next/link";
import { BiBell, BiChevronDown, BiSearch } from "react-icons/bi";

export type UserRole = "student" | "teacher" | "admin";

type TopbarProps = {
  role: UserRole;
  userName: string;
};

const Topbar = ({ role, userName }: TopbarProps) => {
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
          <span className="hidden rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 md:inline-flex">
            {role.toUpperCase()}
          </span>

          {/* Notifications */}
          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50"
            aria-label="Notifications"
          >
            <BiBell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-zinc-900" />
          </button>

          {/* Profile */}
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-900 text-xs font-bold text-white">
              {userName
                .split(" ")
                .slice(0, 2)
                .map((p) => p[0])
                .join("")
                .toUpperCase()}
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold text-zinc-900">{userName}</p>
              <p className="text-xs text-zinc-500">View profile</p>
            </div>
            <BiChevronDown className="hidden h-4 w-4 text-zinc-500 sm:block" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Topbar;