"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BiBook,
  BiBookOpen,
  BiCheckCircle,
  BiDesktop,
  BiGroup,
  BiStar,
  BiTime,
  BiTrophy,
  BiUser,
  BiChalkboard,
  BiErrorCircle,
  BiWrench,
  BiLineChart,
} from "react-icons/bi";
import type { UserRole } from "@/types/auth";

interface SessionUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  profile_photo?: string;
}

const studentStats = [
  { label: "Courses Enrolled", value: "4", icon: <BiBook className="h-5 w-5 text-blue-500" />, bg: "bg-blue-50" },
  { label: "Lessons Completed", value: "18", icon: <BiCheckCircle className="h-5 w-5 text-emerald-500" />, bg: "bg-emerald-50" },
  { label: "Quiz Avg Score", value: "82%", icon: <BiTrophy className="h-5 w-5 text-amber-500" />, bg: "bg-amber-50" },
  { label: "Study Groups", value: "2", icon: <BiGroup className="h-5 w-5 text-purple-500" />, bg: "bg-purple-50" },
];

const studentRecentActivity = [
  { icon: <BiBookOpen className="h-4 w-4 text-blue-500" />, text: "Completed 'Introduction to Numbers' lesson", time: "2h ago" },
  { icon: <BiTrophy className="h-4 w-4 text-amber-500" />, text: "Scored 18/20 on 'Numbers & Counting Quiz'", time: "3h ago" },
  { icon: <BiGroup className="h-4 w-4 text-purple-500" />, text: "Joined 'Math Champions' study group", time: "Yesterday" },
  { icon: <BiDesktop className="h-4 w-4 text-red-500" />, text: "Attended 'Science: Ecosystems' virtual class", time: "2 days ago" },
  { icon: <BiStar className="h-4 w-4 text-zinc-500" />, text: "Enrolled in 'Entrepreneurship Basics' course", time: "3 days ago" },
];

const studentUpcomingClasses = [
  { title: "Math Live Session — Fractions", teacher: "Ms. Fatima", time: "Today · 5:00 PM", status: "live" },
  { title: "English Reading Circle", teacher: "Mr. Karim", time: "Mar 5 · 4:00 PM", status: "upcoming" },
];

const teacherStats = [
  { label: "Active Courses", value: "3", icon: <BiChalkboard className="h-5 w-5 text-blue-500" />, bg: "bg-blue-50" },
  { label: "Students Enrolled", value: "124", icon: <BiUser className="h-5 w-5 text-emerald-500" />, bg: "bg-emerald-50" },
  { label: "Assignments to Grade", value: "12", icon: <BiBookOpen className="h-5 w-5 text-amber-500" />, bg: "bg-amber-50" },
  { label: "Upcoming Classes", value: "4", icon: <BiTime className="h-5 w-5 text-purple-500" />, bg: "bg-purple-50" },
];

const teacherRecentActivity = [
  { icon: <BiCheckCircle className="h-4 w-4 text-emerald-500" />, text: "Graded 'Midterm Algebra' assignments", time: "1h ago" },
  { icon: <BiBook className="h-4 w-4 text-blue-500" />, text: "Posted new lesson in 'Science Basics'", time: "4h ago" },
  { icon: <BiGroup className="h-4 w-4 text-purple-500" />, text: "Created 'Science Fair' study group", time: "Yesterday" },
];

const teacherUpcomingClasses = [
  { title: "Science Basics — Forces", teacher: "You", time: "Today · 2:00 PM", status: "live" },
  { title: "Midterm Review", teacher: "You", time: "Tomorrow · 10:00 AM", status: "upcoming" },
];

const adminStats = [
  { label: "Total Users", value: "1,432", icon: <BiGroup className="h-5 w-5 text-blue-500" />, bg: "bg-blue-50" },
  { label: "Active Teachers", value: "45", icon: <BiChalkboard className="h-5 w-5 text-emerald-500" />, bg: "bg-emerald-50" },
  { label: "Total Courses", value: "86", icon: <BiBook className="h-5 w-5 text-purple-500" />, bg: "bg-purple-50" },
  { label: "System Reports", value: "3", icon: <BiErrorCircle className="h-5 w-5 text-red-500" />, bg: "bg-red-50" },
];

const adminRecentActivity = [
  { icon: <BiUser className="h-4 w-4 text-blue-500" />, text: "New teacher account registered: 'David M.'", time: "10m ago" },
  { icon: <BiCheckCircle className="h-4 w-4 text-emerald-500" />, text: "Approved course 'Advanced Physics'", time: "2h ago" },
  { icon: <BiWrench className="h-4 w-4 text-zinc-500" />, text: "System maintenance completed successfully", time: "Yesterday" },
  { icon: <BiLineChart className="h-4 w-4 text-purple-500" />, text: "Weekly user engagement report generated", time: "2 days ago" },
];

const adminSystemAlerts = [
  { title: "High Server Load Detected", severity: "medium", time: "Today · 8:00 AM" },
  { title: "Database Backup Completed", severity: "info", time: "Today · 3:00 AM" },
  { title: "Authentication Service Alert", severity: "high", time: "Yesterday · 11:45 PM" },
];

export default function DashboardHome() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/auth/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-indigo-600" />
          <p className="text-sm text-zinc-500">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          Welcome back, {user.full_name.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {user.role === "admin"
            ? "Here's an overview of the platform today."
            : user.role === "teacher"
            ? "Here's what's happening with your classes today."
            : "Here's what's happening with your learning today."}
        </p>
      </div>

      {/* Role Switcher */}
      {user.role === "student" && <StudentDashboard />}
      {user.role === "teacher" && <TeacherDashboard />}
      {user.role === "admin" && <AdminDashboard />}
    </div>
  );
}

function StudentDashboard() {
  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {studentStats.map((s) => (
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
        {/* Upcoming Classes */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">Upcoming Classes</h2>
          <div className="space-y-3">
            {studentUpcomingClasses.map((cls) => (
              <div key={cls.title} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${cls.status === "live" ? "bg-red-500 animate-pulse" : "bg-blue-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{cls.title}</p>
                  <p className="text-xs text-zinc-500">{cls.teacher} · {cls.time}</p>
                </div>
                <button className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors ${cls.status === "live" ? "bg-red-600 hover:bg-red-700" : "bg-zinc-900 hover:bg-zinc-700"}`}>
                  {cls.status === "live" ? "Join" : "View"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">Recent Activity</h2>
          <div className="space-y-3">
            {studentRecentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-zinc-50 border border-zinc-100">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-700 leading-snug">{item.text}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-400"><BiTime className="h-3 w-3" /> {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-zinc-900">Course Progress</h2>
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
                <div className={`h-2 rounded-full transition-all ${course.color}`} style={{ width: `${course.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function TeacherDashboard() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {teacherStats.map((s) => (
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
            {teacherUpcomingClasses.map((cls) => (
              <div key={cls.title} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${cls.status === "live" ? "bg-red-500 animate-pulse" : "bg-blue-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{cls.title}</p>
                  <p className="text-xs text-zinc-500">{cls.time}</p>
                </div>
                <button className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors ${cls.status === "live" ? "bg-red-600 hover:bg-red-700" : "bg-zinc-900 hover:bg-zinc-700"}`}>
                  {cls.status === "live" ? "Start" : "Details"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">Recent Activity</h2>
          <div className="space-y-3">
            {teacherRecentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-zinc-50 border border-zinc-100">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-700 leading-snug">{item.text}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-400"><BiTime className="h-3 w-3" /> {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function AdminDashboard() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {adminStats.map((s) => (
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
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">System Alerts</h2>
          <div className="space-y-3">
            {adminSystemAlerts.map((alert) => (
              <div key={alert.title} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                  alert.severity === "high" ? "bg-red-100 text-red-600" :
                  alert.severity === "medium" ? "bg-amber-100 text-amber-600" :
                  "bg-blue-100 text-blue-600"
                }`}>
                  <BiErrorCircle className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{alert.title}</p>
                  <p className="text-xs text-zinc-500">{alert.time}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  alert.severity === "high" ? "text-red-600" :
                  alert.severity === "medium" ? "text-amber-600" :
                  "text-blue-600"
                }`}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">Recent Platform Activity</h2>
          <div className="space-y-3">
            {adminRecentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-zinc-50 border border-zinc-100">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-700 leading-snug">{item.text}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-400"><BiTime className="h-3 w-3" /> {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}