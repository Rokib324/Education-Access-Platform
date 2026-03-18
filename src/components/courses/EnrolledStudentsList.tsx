"use client";

import { useState, useEffect } from "react";
import { BiRefresh, BiUser, BiBarChart } from "react-icons/bi";

type StudentProgress = {
    _id: string;
    student_id: {
        _id: string;
        full_name: string;
        email: string;
        profile_photo?: string;
    };
    enrolled_at: string;
    status: "active" | "completed" | "dropped";
    progress: {
        totalLessons: number;
        completedLessons: number;
        overallPercent: number;
    };
};

export default function EnrolledStudentsList({ courseId }: { courseId: string }) {
    const [students, setStudents] = useState<StudentProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/courses/${courseId}/enrollments`);
            if (!res.ok) throw new Error("Failed to load students.");
            const data = await res.json();
            setStudents(data.enrollments ?? []);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStudents(); }, [courseId]);

    if (loading) return (
        <div className="flex items-center justify-center py-12 text-zinc-400">
            <BiRefresh className="h-6 w-6 animate-spin mr-2" />
            Loading students…
        </div>
    );

    if (error) return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex justify-between items-center">
            {error}
            <button onClick={fetchStudents} className="underline font-semibold">Retry</button>
        </div>
    );

    if (students.length === 0) return (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 py-16 text-center">
            <BiUser className="h-10 w-10 text-zinc-300 mb-3" />
            <p className="text-sm text-zinc-500">No students enrolled yet.</p>
        </div>
    );

    const avgProgress = Math.round(
        students.reduce((sum, s) => sum + s.progress.overallPercent, 0) / students.length
    );

    return (
        <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-zinc-200 bg-white p-3 text-center shadow-sm">
                    <p className="text-xs text-zinc-500">Enrolled</p>
                    <p className="text-xl font-bold text-zinc-900">{students.length}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-3 text-center shadow-sm">
                    <p className="text-xs text-zinc-500">Completed</p>
                    <p className="text-xl font-bold text-emerald-600">
                        {students.filter((s) => s.status === "completed").length}
                    </p>
                </div>
                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-center shadow-sm">
                    <p className="text-xs text-indigo-500">Avg Progress</p>
                    <p className="text-xl font-bold text-indigo-700">{avgProgress}%</p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3">
                    <BiBarChart className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm font-semibold text-zinc-700">Enrolled Students</span>
                    <button
                        onClick={fetchStudents}
                        className="ml-auto flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs text-zinc-500 hover:bg-zinc-50 transition-colors"
                    >
                        <BiRefresh className="h-3.5 w-3.5" /> Refresh
                    </button>
                </div>
                <div className="divide-y divide-zinc-100">
                    {students.map((s) => (
                        <div key={s._id} className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-50 transition-colors">
                            {/* Avatar */}
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                                {s.student_id.full_name.charAt(0).toUpperCase()}
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-zinc-900 truncate">{s.student_id.full_name}</p>
                                <p className="text-xs text-zinc-400 truncate">{s.student_id.email}</p>
                            </div>
                            {/* Progress */}
                            <div className="hidden sm:flex flex-col items-end gap-1 w-32">
                                <div className="flex justify-between w-full text-[11px] text-zinc-500">
                                    <span>{s.progress.completedLessons}/{s.progress.totalLessons} lessons</span>
                                    <span className="font-semibold">{s.progress.overallPercent}%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-zinc-200">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-500 ${
                                            s.progress.overallPercent >= 100 ? "bg-emerald-500" : "bg-indigo-500"
                                        }`}
                                        style={{ width: `${s.progress.overallPercent}%` }}
                                    />
                                </div>
                            </div>
                            {/* Status Badge */}
                            <span className={`hidden md:inline shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                                s.status === "completed"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-indigo-100 text-indigo-700"
                            }`}>
                                {s.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
