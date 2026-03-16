"use client";

import { useEffect, useState } from "react";
import {
  BiChalkboard,
  BiUser,
  BiBookOpen,
  BiTime,
  BiStar,
  BiTrophy,
  BiBook,
  BiDesktop,
} from "react-icons/bi";

const getIconForType = (type: string) => {
  switch (type) {
    case "quiz":
      return <BiTrophy className="h-4 w-4 text-amber-500" />;
    case "lesson":
      return <BiBookOpen className="h-4 w-4 text-blue-500" />;
    case "course":
      return <BiBook className="h-4 w-4 text-purple-500" />;
    case "class":
      return <BiDesktop className="h-4 w-4 text-blue-500" />;
    case "resource":
      return <BiStar className="h-4 w-4 text-emerald-500" />;
    case "user":
      return <BiUser className="h-4 w-4 text-blue-500" />;
    default:
      return <BiStar className="h-4 w-4 text-zinc-500" />;
  }
};

export default function TeacherDashboard() {
  const [stats, setStats] = useState([
    { label: "Active Courses", value: "...", icon: <BiChalkboard className="h-5 w-5 text-blue-500" />, bg: "bg-blue-50" },
    { label: "Students Enrolled", value: "...", icon: <BiUser className="h-5 w-5 text-emerald-500" />, bg: "bg-emerald-50" },
    { label: "Assignments to Grade", value: "...", icon: <BiBookOpen className="h-5 w-5 text-amber-500" />, bg: "bg-amber-50" },
    { label: "Upcoming Classes", value: "...", icon: <BiTime className="h-5 w-5 text-purple-500" />, bg: "bg-purple-50" },
  ]);
  const [upcomingClasses, setUpcomingClasses] = useState<{title: string, teacher: string, time: string, status: string}[]>([]);
  const [recentActivity, setRecentActivity] = useState<{type: string, text: string, time: string}[]>([]);

  useEffect(() => {
    fetch("/api/profile/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data?.stats && data.stats.length === 4) {
           setStats([
             { label: data.stats[0].label, value: data.stats[0].value.toString(), icon: <BiChalkboard className="h-5 w-5 text-blue-500" />, bg: "bg-blue-50" },
             { label: data.stats[1].label, value: data.stats[1].value.toString(), icon: <BiUser className="h-5 w-5 text-emerald-500" />, bg: "bg-emerald-50" },
             { label: data.stats[2].label, value: data.stats[2].value.toString(), icon: <BiBookOpen className="h-5 w-5 text-amber-500" />, bg: "bg-amber-50" },
             { label: data.stats[3].label, value: data.stats[3].value.toString(), icon: <BiTime className="h-5 w-5 text-purple-500" />, bg: "bg-purple-50" },
           ]);
        }
      })
      .catch(console.error);

    fetch("/api/dashboard/upcoming-classes")
      .then((res) => res.json())
      .then((data) => {
        if (data?.upcomingClasses) {
          setUpcomingClasses(data.upcomingClasses);
        }
      })
      .catch(console.error);

    fetch("/api/dashboard/recent-activity")
      .then((res) => res.json())
      .then((data) => {
        if (data?.recentActivities) {
          setRecentActivity(data.recentActivities);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm ${s.bg}`}>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm">{s.icon}</div>
            <div>
              <p className="text-xl font-bold text-zinc-900">{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">Your Upcoming Classes</h2>
          <div className="space-y-3">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((cls, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${cls.status === "live" ? "bg-red-500 animate-pulse" : "bg-blue-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{cls.title}</p>
                  <p className="text-xs text-zinc-500">{cls.time}</p>
                </div>
                <button className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors ${cls.status === "live" ? "bg-red-600 hover:bg-red-700" : "bg-zinc-900 hover:bg-zinc-700"}`}>
                  {cls.status === "live" ? "Start" : "Details"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500 text-center py-4">No upcoming classes scheduled.</p>
          )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-zinc-50 border border-zinc-100">{getIconForType(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-700 leading-snug">{item.text}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-400"><BiTime className="h-3 w-3" /> {item.time}</p>
                  </div>
                </div>
              ))
            ) : (
                <p className="text-sm text-zinc-500 text-center py-4">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
