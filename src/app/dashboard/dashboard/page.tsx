"use client";

import {
  BiBook,
  BiBookOpen,
  BiCheckCircle,
  BiDesktop,
  BiGroup,
  BiStar,
  BiTime,
  BiTrophy,
} from "react-icons/bi";

const stats = [
  {
    label: "Courses Enrolled",
    value: "4",
    icon: <BiBook className="h-5 w-5 text-blue-500" />,
    bg: "bg-blue-50",
  },
  {
    label: "Lessons Completed",
    value: "18",
    icon: <BiCheckCircle className="h-5 w-5 text-emerald-500" />,
    bg: "bg-emerald-50",
  },
  {
    label: "Quiz Avg Score",
    value: "82%",
    icon: <BiTrophy className="h-5 w-5 text-amber-500" />,
    bg: "bg-amber-50",
  },
  {
    label: "Study Groups",
    value: "2",
    icon: <BiGroup className="h-5 w-5 text-purple-500" />,
    bg: "bg-purple-50",
  },
];

const recentActivity = [
  {
    icon: <BiBookOpen className="h-4 w-4 text-blue-500" />,
    text: "Completed 'Introduction to Numbers' lesson",
    time: "2h ago",
  },
  {
    icon: <BiTrophy className="h-4 w-4 text-amber-500" />,
    text: "Scored 18/20 on 'Numbers & Counting Quiz'",
    time: "3h ago",
  },
  {
    icon: <BiGroup className="h-4 w-4 text-purple-500" />,
    text: "Joined 'Math Champions' study group",
    time: "Yesterday",
  },
  {
    icon: <BiDesktop className="h-4 w-4 text-red-500" />,
    text: "Attended 'Science: Ecosystems' virtual class",
    time: "2 days ago",
  },
  {
    icon: <BiStar className="h-4 w-4 text-zinc-500" />,
    text: "Enrolled in 'Entrepreneurship Basics' course",
    time: "3 days ago",
  },
];

const upcomingClasses = [
  {
    title: "Math Live Session — Fractions",
    teacher: "Ms. Fatima",
    time: "Today · 5:00 PM",
    status: "live",
  },
  {
    title: "English Reading Circle",
    teacher: "Mr. Karim",
    time: "Mar 5 · 4:00 PM",
    status: "upcoming",
  },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          Welcome back, Rakib 👋
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Here's what's happening with your learning today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm ${s.bg}`}
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm">
              {s.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-900">{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Classes */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">
            Upcoming Classes
          </h2>
          <div className="space-y-3">
            {upcomingClasses.map((cls) => (
              <div
                key={cls.title}
                className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3"
              >
                <div
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    cls.status === "live" ? "bg-red-500 animate-pulse" : "bg-blue-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {cls.title}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {cls.teacher} · {cls.time}
                  </p>
                </div>
                <button
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors ${
                    cls.status === "live"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-zinc-900 hover:bg-zinc-700"
                  }`}
                >
                  {cls.status === "live" ? "Join" : "View"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-zinc-50 border border-zinc-100">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-700 leading-snug">
                    {item.text}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-400">
                    <BiTime className="h-3 w-3" />
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-zinc-900">
          Course Progress
        </h2>
        <div className="space-y-4">
          {[
            { name: "Mathematics Fundamentals", pct: 67, color: "bg-blue-500" },
            { name: "English Reading & Writing", pct: 40, color: "bg-emerald-500" },
            { name: "Entrepreneurship Basics", pct: 20, color: "bg-amber-500" },
            { name: "Agricultural Skills", pct: 10, color: "bg-purple-500" },
          ].map((course) => (
            <div key={course.name}>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="font-medium text-zinc-700">{course.name}</span>
                <span className="text-zinc-500">{course.pct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-100">
                <div
                  className={`h-2 rounded-full transition-all ${course.color}`}
                  style={{ width: `${course.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}