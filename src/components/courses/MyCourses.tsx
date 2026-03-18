"use client";

import { useState, useEffect, useCallback } from "react";
import { BiBook, BiRefresh, BiTrophy, BiSearch } from "react-icons/bi";
import Link from "next/link";
import CourseProgressCard from "./CourseProgressCard";

type ProgressInfo = {
    totalLessons: number;
    completedLessons: number;
    overallPercent: number;
};

type EnrolledCourse = {
    _id: string;
    course_id: {
        _id: string;
        title: string;
        description?: string;
        is_vocational?: boolean;
        subject_id?: { subject_name: string };
        grade_id?: { grade_name: string };
        created_by?: { full_name: string };
    };
    enrolled_at: string;
    status: "active" | "completed" | "dropped";
    progress: ProgressInfo;
};

export default function MyCourses() {
    const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

    const fetchEnrollments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/enrollments");
            if (!res.ok) throw new Error("Failed to load your courses.");
            const data = await res.json();
            setEnrollments(data.enrollments ?? []);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

    const filtered = enrollments.filter((e) => {
        const title = e.course_id?.title?.toLowerCase() ?? "";
        if (search && !title.includes(search.toLowerCase())) return false;
        if (filter === "active" && e.status !== "active") return false;
        if (filter === "completed" && e.status !== "completed") return false;
        return true;
    });

    const completedCount = enrollments.filter((e) => e.status === "completed").length;
    const inProgressCount = enrollments.filter(
        (e) => e.status === "active" && e.progress.overallPercent > 0
    ).length;
    const avgProgress =
        enrollments.length > 0
            ? Math.round(
                  enrollments.reduce((sum, e) => sum + e.progress.overallPercent, 0) /
                      enrollments.length
              )
            : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">My Courses</h1>
                    <p className="mt-0.5 text-sm text-zinc-500">Track your progress and continue learning</p>
                </div>
                <Link
                    href="/dashboard/courses"
                    className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm"
                >
                    <BiBook className="h-4 w-4" />
                    Browse Courses
                </Link>
            </div>

            {/* Stats Row */}
            {!loading && enrollments.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <p className="text-xs text-zinc-500">Enrolled</p>
                        <p className="mt-1 text-2xl font-bold text-zinc-900">{enrollments.length}</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <p className="text-xs text-zinc-500">Completed</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-600">{completedCount}</p>
                    </div>
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 shadow-sm col-span-2 sm:col-span-1">
                        <p className="text-xs text-indigo-500">Avg. Progress</p>
                        <p className="mt-1 text-2xl font-bold text-indigo-700">{avgProgress}%</p>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-indigo-200">
                            <div
                                className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
                                style={{ width: `${avgProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            {!loading && enrollments.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <div className="relative flex-1 min-w-[180px]">
                        <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search your courses…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 py-2 pl-9 pr-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                    <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
                        {(["all", "active", "completed"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                                    filter === f
                                        ? "bg-white text-zinc-900 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-700"
                                }`}
                            >
                                {f} {f === "active" && inProgressCount > 0 && `(${inProgressCount})`}
                                {f === "completed" && completedCount > 0 && `(${completedCount})`}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={fetchEnrollments}
                        className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                    >
                        <BiRefresh className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
                    <BiRefresh className="h-10 w-10 animate-spin mb-3" />
                    <p className="text-sm">Loading your courses…</p>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                    {error}
                    <button onClick={fetchEnrollments} className="underline font-semibold ml-2">Retry</button>
                </div>
            ) : enrollments.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-24 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 mb-4">
                        <BiBook className="h-10 w-10 text-indigo-300" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-800">No enrollments yet</h3>
                    <p className="mt-2 max-w-xs text-sm text-zinc-500">
                        Browse available courses and click &quot;Enroll&quot; to start your learning journey.
                    </p>
                    <Link
                        href="/dashboard/courses"
                        className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                    >
                        <BiBook className="h-4 w-4" />
                        Browse Courses
                    </Link>
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-200 py-12 text-center text-sm text-zinc-500">
                    No courses match your filters.
                </div>
            ) : (
                <div className="space-y-4">
                    {completedCount > 0 && filter === "all" && (
                        <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                            <BiTrophy className="h-4 w-4" />
                            {completedCount} course{completedCount > 1 ? "s" : ""} completed — great work!
                        </div>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((enrollment) => (
                            <CourseProgressCard key={enrollment._id} enrollment={enrollment} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
