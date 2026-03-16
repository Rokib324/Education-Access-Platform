"use client";

import { useEffect, useState } from "react";
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
  profilePhoto?: string;
};

const ROLE_COLORS: Record<UserRole, string> = {
  student: "bg-blue-100 text-blue-700",
  teacher: "bg-emerald-100 text-emerald-700",
  admin: "bg-violet-100 text-violet-700",
};

const SEARCH_PLACEHOLDERS: Record<UserRole, string> = {
  admin: "Search users, roles, system settings...",
  teacher: "Search courses, students, resource library...",
  student: "Search courses, lessons, my resources...",
};

const Topbar = ({ role, userName, profilePhoto }: TopbarProps) => {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/dashboard/recent-activity");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.recentActivities || []);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

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
            placeholder={SEARCH_PLACEHOLDERS[role]}
            className="w-full bg-transparent outline-none placeholder:text-zinc-400"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Role pill */}
          <span
            className={`hidden rounded-full px-3 py-1 text-xs font-semibold md:inline-flex ${ROLE_COLORS[role]}`}
          >
            {role.toUpperCase()}
          </span>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50"
              aria-label="Notifications"
            >
              <BiBell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>

            {notificationsOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotificationsOpen(false)}
                />
                {/* Dropdown */}
                <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-zinc-200 bg-white py-2 shadow-xl animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-zinc-100 mb-1">
                    <h3 className="text-sm font-bold text-zinc-900">Notifications</h3>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="px-4 py-8 text-center text-sm text-zinc-500">
                        Loading...
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((note, i) => (
                        <div key={i} className="px-4 py-3 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0">
                          <p className="text-sm text-zinc-800 leading-snug">{note.text}</p>
                          <p className="text-[10px] text-zinc-500 mt-1">{note.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-zinc-500 italic">
                        Nothing to show
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotificationsOpen(false);
              }}
              className="inline-flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50"
            >
              <div className="h-8 w-8 overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
                {profilePhoto ? (
                  <img src={profilePhoto} alt={userName} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xs font-bold text-white">
                    {initials}
                  </div>
                )}
              </div>
              <div className="hidden leading-tight sm:block text-left">
                <p className="text-sm font-semibold text-zinc-900 truncate max-w-[100px]">{userName}</p>
                <p className="text-[10px] text-zinc-500 capitalize">{role}</p>
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