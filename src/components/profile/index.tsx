"use client";

import { useState } from "react";
import {
  BiAward,
  BiBell,
  BiBook,
  BiCamera,
  BiChevronRight,
  BiCog,
  BiKey,
  BiLogOut,
  BiMessageDetail,
  BiUser,
} from "react-icons/bi";

// Mock user data
const USER = {
  name: "Rakibul Islam",
  email: "rakibul.dev@example.com",
  role: "Student",
  joinDate: "January 2026",
  avatar: null, // null testing default avatar
  stats: {
    enrolledCourses: 4,
    completedLessons: 24,
    forumPosts: 12,
    certificates: 1,
  },
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header section */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 p-8 text-white shadow-lg">
        {/* Background decorative pattern */}
        <div className="absolute -right-20 -top-20 z-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 left-20 z-0 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Avatar container */}
          <div className="relative group">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-3xl font-bold text-zinc-800 shadow-inner overflow-hidden">
              {USER.avatar ? (
                <img src={USER.avatar} alt={USER.name} className="h-full w-full object-cover" />
              ) : (
                USER.name.charAt(0)
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 rounded-full border-4 border-zinc-900 bg-white p-2 text-zinc-900 shadow-sm transition-transform hover:scale-105 group-hover:bg-zinc-100">
              <BiCamera className="h-4 w-4" />
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold">{USER.name}</h1>
            <p className="mt-1 text-zinc-400">{USER.email}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {USER.role}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                Joined {USER.joinDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Enrolled", value: USER.stats.enrolledCourses, icon: BiBook },
          { label: "Lessons", value: USER.stats.completedLessons, icon: BiAward },
          { label: "Posts", value: USER.stats.forumPosts, icon: BiMessageDetail },
          { label: "Certificates", value: USER.stats.certificates, icon: BiAward },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-50 text-zinc-600">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-zinc-900">{stat.value}</p>
              <p className="text-xs font-medium text-zinc-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        {/* Sidebar Nav */}
        <div className="space-y-1">
          {[
            { id: "profile", label: "Personal Info", icon: BiUser },
            { id: "security", label: "Security & Passwords", icon: BiKey },
            { id: "notifications", label: "Notifications", icon: BiBell },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-zinc-400"}`} />
                {item.label}
              </button>
            );
          })}
          
          <div className="my-2 border-t border-zinc-200" />
          
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
            <BiLogOut className="h-5 w-5 text-red-500" />
            Sign Out
          </button>
        </div>

        {/* Tab Content */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Personal Information</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Update your personal details here.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">Full Name</label>
                  <input
                    type="text"
                    defaultValue={USER.name}
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">Email Address</label>
                  <input
                    type="email"
                    defaultValue={USER.email}
                    disabled
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-500 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-zinc-700">Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us a bit about yourself..."
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-zinc-100 pt-5">
                <button className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Update Password</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Ensure your account uses a long, random password to stay secure.
                </p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">Current Password</label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">New Password</label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-zinc-100 pt-5">
                <button className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Notification Preferences</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Choose what you want to be notified about.
                </p>
              </div>

              <div className="space-y-4 divide-y divide-zinc-100">
                {[
                  { title: "Course Updates", desc: "New lessons or materials added to your courses." },
                  { title: "Forum mentions", desc: "When someone replies to your post or mentions you." },
                  { title: "Live Classes", desc: "Reminders about upcoming scheduled live classes." },
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between pt-4 first:pt-0">
                    <div>
                      <h4 className="text-sm font-medium text-zinc-900">{pref.title}</h4>
                      <p className="text-xs text-zinc-500 mt-1">{pref.desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked className="peer sr-only" />
                      <div className="h-6 w-11 rounded-full bg-zinc-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-zinc-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
