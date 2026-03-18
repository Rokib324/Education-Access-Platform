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
  BiPencil,
} from "react-icons/bi";
import Link from "next/link";

const getIconForType = (type: string) => {
  switch (type) {
    case "quiz":     return <BiTrophy className="h-4 w-4 text-amber-500" />;
    case "lesson":   return <BiBookOpen className="h-4 w-4 text-blue-500" />;
    case "course":   return <BiBook className="h-4 w-4 text-purple-500" />;
    case "class":    return <BiDesktop className="h-4 w-4 text-blue-500" />;
    case "resource": return <BiStar className="h-4 w-4 text-emerald-500" />;
    case "user":     return <BiUser className="h-4 w-4 text-blue-500" />;
    default:         return <BiStar className="h-4 w-4 text-zinc-500" />;
  }
};

type QuizStats = { totalQuizzes: number; totalAttempts: number; avgScore: number } | null;

export default function TeacherDashboard() {
  const [stats, setStats] = useState([
    { label: "Active Courses",       value: "...", icon: <BiChalkboard className="h-5 w-5 text-blue-500" />,   bg: "bg-blue-50" },
    { label: "Students Enrolled",    value: "...", icon: <BiUser className="h-5 w-5 text-emerald-500" />,       bg: "bg-emerald-50" },
    { label: "Assignments to Grade", value: "...", icon: <BiBookOpen className="h-5 w-5 text-amber-500" />,     bg: "bg-amber-50" },
    { label: "Upcoming Classes",     value: "...", icon: <BiTime className="h-5 w-5 text-purple-500" />,        bg: "bg-purple-50" },
  ]);
  const [upcomingClasses, setUpcomingClasses] = useState<{ title: string; teacher: string; time: string; status: string }[]>([]);
  const [recentActivity, setRecentActivity]   = useState<{ type: string; text: string; time: string }[]>([]);
  const [quizStats, setQuizStats]             = useState<QuizStats>(null);

  useEffect(() => {
    fetch("/api/profile/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data?.stats?.length === 4) {
          setStats([
            { label: data.stats[0].label, value: String(data.stats[0].value), icon: <BiChalkboard className="h-5 w-5 text-blue-500" />,   bg: "bg-blue-50" },
            { label: data.stats[1].label, value: String(data.stats[1].value), icon: <BiUser className="h-5 w-5 text-emerald-500" />,       bg: "bg-emerald-50" },
            { label: data.stats[2].label, value: String(data.stats[2].value), icon: <BiBookOpen className="h-5 w-5 text-amber-500" />,     bg: "bg-amber-50" },
            { label: data.stats[3].label, value: String(data.stats[3].value), icon: <BiTime className="h-5 w-5 text-purple-500" />,        bg: "bg-purple-50" },
          ]);
        }
      })
      .catch(console.error);

    fetch("/api/dashboard/upcoming-classes")
      .then((r) => r.json())
      .then((d) => { if (d?.upcomingClasses) setUpcomingClasses(d.upcomingClasses); })
      .catch(console.error);

    fetch("/api/dashboard/recent-activity")
      .then((r) => r.json())
      .then((d) => { if (d?.recentActivities) setRecentActivity(d.recentActivities); })
      .catch(console.error);

    // Quiz overview stats – uses existing quiz service aggregation through courses
    fetch("/api/courses")
      .then((r) => r.json())
      .then(async (d: { courses?: { _id: string }[] }) => {
        const courses = d.courses ?? [];
        if (courses.length === 0) { setQuizStats({ totalQuizzes: 0, totalAttempts: 0, avgScore: 0 }); return; }
        const res = await fetch("/api/quiz-stats?" + courses.map((c) => `courseId=${c._id}`).join("&"));
        const stats = await res.json();
        setQuizStats(stats);
      })
      .catch(() => setQuizStats({ totalQuizzes: 0, totalAttempts: 0, avgScore: 0 }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats */}
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
        {/* Upcoming Classes */}
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

        {/* Recent Activity */}
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

      {/* Quiz Overview */}
      {quizStats !== null && (
        <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                <BiPencil className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-900">Quiz Overview</h2>
                <p className="text-xs text-zinc-500">Across all your courses</p>
              </div>
            </div>
            <Link href="/dashboard/quizzes/manage"
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors">
              <BiPencil className="h-3.5 w-3.5" /> Manage Quizzes
            </Link>
          </div>

          {quizStats.totalQuizzes === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-3">
              No quizzes created yet.{" "}
              <Link href="/dashboard/quizzes/manage" className="text-indigo-600 font-semibold underline">Create one →</Link>
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/70 p-3 text-center border border-indigo-100">
                <p className="text-2xl font-black text-indigo-700">{quizStats.totalQuizzes}</p>
                <p className="text-xs text-zinc-500">Total Quizzes</p>
              </div>
              <div className="rounded-xl bg-white/70 p-3 text-center border border-indigo-100">
                <p className="text-2xl font-black text-indigo-700">{quizStats.totalAttempts}</p>
                <p className="text-xs text-zinc-500">Student Attempts</p>
              </div>
              <div className="rounded-xl bg-white/70 p-3 text-center border border-indigo-100">
                <p className="text-2xl font-black text-amber-700">{quizStats.avgScore}%</p>
                <p className="text-xs text-zinc-500">Avg Class Score</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
