"use client";

import { useEffect, useState } from "react";
import {
  BiBook,
  BiCheckCircle,
  BiGroup,
  BiTrophy,
  BiTime,
  BiPencil,
  BiStar,
  BiBookOpen,
  BiDesktop,
  BiUser,
} from "react-icons/bi";
import CourseRecommendations from "@/components/CourseRecommendations";
import InterestSelection from "@/components/InterestSelection";
import Link from "next/link";

const getIconForType = (type: string) => {
  switch (type) {
    case "quiz":   return <BiTrophy className="h-4 w-4 text-amber-500" />;
    case "lesson": return <BiBookOpen className="h-4 w-4 text-blue-500" />;
    case "course": return <BiBook className="h-4 w-4 text-purple-500" />;
    case "class":  return <BiDesktop className="h-4 w-4 text-blue-500" />;
    case "user":   return <BiUser className="h-4 w-4 text-blue-500" />;
    default:       return <BiStar className="h-4 w-4 text-zinc-500" />;
  }
};

type QuizAttempt = {
  _id: string;
  quiz_id: { title: string; total_marks: number; pass_mark: number } | null;
  score: number;
  attempted_at: string;
};

export default function StudentDashboard() {
  const [stats, setStats] = useState([
    { label: "Courses Enrolled",  value: "...", icon: <BiBook className="h-5 w-5 text-blue-500" />,        bg: "bg-blue-50" },
    { label: "Lessons Completed", value: "...", icon: <BiCheckCircle className="h-5 w-5 text-emerald-500" />, bg: "bg-emerald-50" },
    { label: "Posts",             value: "...", icon: <BiTrophy className="h-5 w-5 text-amber-500" />,       bg: "bg-amber-50" },
    { label: "Certificates",      value: "...", icon: <BiGroup className="h-5 w-5 text-purple-500" />,       bg: "bg-purple-50" },
  ]);
  const [upcomingClasses, setUpcomingClasses] = useState<{ title: string; teacher: string; time: string; status: string }[]>([]);
  const [recentActivity, setRecentActivity]   = useState<{ type: string; text: string; time: string }[]>([]);
  const [quizStats, setQuizStats]             = useState<{ total: number; avgScore: number; bestScore: number } | null>(null);
  const [recentAttempts, setRecentAttempts]   = useState<QuizAttempt[]>([]);

  useEffect(() => {
    // Profile stats
    fetch("/api/profile/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data?.stats?.length === 4) {
          setStats([
            { label: data.stats[0].label, value: String(data.stats[0].value), icon: <BiBook className="h-5 w-5 text-blue-500" />,        bg: "bg-blue-50" },
            { label: data.stats[1].label, value: String(data.stats[1].value), icon: <BiCheckCircle className="h-5 w-5 text-emerald-500" />, bg: "bg-emerald-50" },
            { label: data.stats[2].label, value: String(data.stats[2].value), icon: <BiTrophy className="h-5 w-5 text-amber-500" />,       bg: "bg-amber-50" },
            { label: data.stats[3].label, value: String(data.stats[3].value), icon: <BiGroup className="h-5 w-5 text-purple-500" />,       bg: "bg-purple-50" },
          ]);
        }
      })
      .catch(console.error);

    // Upcoming classes
    fetch("/api/dashboard/upcoming-classes")
      .then((r) => r.json())
      .then((d) => { if (d?.upcomingClasses) setUpcomingClasses(d.upcomingClasses); })
      .catch(console.error);

    // Recent activity
    fetch("/api/dashboard/recent-activity")
      .then((r) => r.json())
      .then((d) => { if (d?.recentActivities) setRecentActivity(d.recentActivities); })
      .catch(console.error);

    // Quiz attempts
    fetch("/api/quiz-attempts/me")
      .then((r) => r.json())
      .then((d: { attempts?: QuizAttempt[] }) => {
        const attempts = d.attempts ?? [];
        if (attempts.length > 0) {
          const avgScore = Math.round(
            attempts.reduce((s, a) => s + (a.score / (a.quiz_id?.total_marks ?? 100)) * 100, 0) / attempts.length
          );
          const bestScore = Math.max(...attempts.map((a) => Math.round((a.score / (a.quiz_id?.total_marks ?? 100)) * 100)));
          setQuizStats({ total: attempts.length, avgScore, bestScore });
          setRecentAttempts(attempts.slice(0, 3));
        } else {
          setQuizStats({ total: 0, avgScore: 0, bestScore: 0 });
        }
      })
      .catch(() => setQuizStats({ total: 0, avgScore: 0, bestScore: 0 }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats row */}
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
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">Upcoming Classes</h2>
          <div className="space-y-3">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((cls, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                  <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${cls.status === "live" ? "bg-red-500 animate-pulse" : "bg-blue-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{cls.title}</p>
                    <p className="text-xs text-zinc-500">{cls.teacher} · {cls.time}</p>
                  </div>
                  <button className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors ${cls.status === "live" ? "bg-red-600 hover:bg-red-700" : "bg-zinc-900 hover:bg-zinc-700"}`}>
                    {cls.status === "live" ? "Join" : "View"}
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

      {/* Quiz Stats Widget */}
      {quizStats !== null && (
        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                <BiTrophy className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-900">Quiz Performance</h2>
                <p className="text-xs text-zinc-500">{quizStats.total} quiz{quizStats.total !== 1 ? "zes" : ""} taken</p>
              </div>
            </div>
            <Link href="/dashboard/quizzes"
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors">
              <BiPencil className="h-3.5 w-3.5" /> Take Quiz
            </Link>
          </div>

          {quizStats.total === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-3">
              You haven&apos;t taken any quizzes yet.{" "}
              <Link href="/dashboard/quizzes" className="text-amber-600 font-semibold underline">Start now →</Link>
            </p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/70 p-3 text-center border border-amber-100">
                  <p className="text-2xl font-black text-amber-700">{quizStats.total}</p>
                  <p className="text-xs text-zinc-500">Attempts</p>
                </div>
                <div className="rounded-xl bg-white/70 p-3 text-center border border-amber-100">
                  <p className="text-2xl font-black text-amber-700">{quizStats.avgScore}%</p>
                  <p className="text-xs text-zinc-500">Avg Score</p>
                </div>
                <div className="rounded-xl bg-white/70 p-3 text-center border border-amber-100">
                  <p className="text-2xl font-black text-emerald-700">{quizStats.bestScore}%</p>
                  <p className="text-xs text-zinc-500">Best Score</p>
                </div>
              </div>

              {recentAttempts.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-zinc-600">Recent Quizzes</p>
                  {recentAttempts.map((a) => {
                    const total = a.quiz_id?.total_marks ?? 100;
                    const pct   = Math.round((a.score / total) * 100);
                    const passed = a.score >= (a.quiz_id?.pass_mark ?? 50);
                    return (
                      <div key={a._id} className="flex items-center gap-3 rounded-lg bg-white/60 px-3 py-2 border border-amber-100">
                        <p className="flex-1 text-xs font-medium text-zinc-700 truncate">{a.quiz_id?.title ?? "Quiz"}</p>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><CourseRecommendations /></div>
        <div><InterestSelection /></div>
      </div>

      {/* Course Progress */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-zinc-900">Course Progress</h2>
        <div className="space-y-4">
          {[
            { name: "Mathematics Fundamentals", pct: 67, color: "bg-blue-500" },
            { name: "English Reading & Writing", pct: 40, color: "bg-emerald-500" },
            { name: "Entrepreneurship Basics",   pct: 20, color: "bg-amber-500" },
            { name: "Agricultural Skills",        pct: 10, color: "bg-purple-500" },
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
    </div>
  );
}
