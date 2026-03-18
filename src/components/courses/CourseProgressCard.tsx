"use client";

import { BiBook, BiCheckCircle, BiCalendar, BiTrophy } from "react-icons/bi";
import Link from "next/link";

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

// ─── Circular Progress Ring ────────────────────────────────────────────────────
function ProgressRing({ percent }: { percent: number }) {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const filled = (percent / 100) * circumference;

    return (
        <svg width="72" height="72" className="shrink-0 -rotate-90">
            {/* Track */}
            <circle
                cx="36" cy="36" r={radius}
                fill="none" stroke="#e4e4e7" strokeWidth="6"
            />
            {/* Progress */}
            <circle
                cx="36" cy="36" r={radius}
                fill="none"
                stroke={percent >= 100 ? "#10b981" : percent > 0 ? "#6366f1" : "#e4e4e7"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - filled}
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
            {/* Label */}
            <text
                x="36" y="36"
                textAnchor="middle"
                dominantBaseline="central"
                className="rotate-90"
                style={{
                    transform: "rotate(90deg) translateY(0)",
                    transformOrigin: "center",
                    fontSize: "12px",
                    fontWeight: "700",
                    fill: percent >= 100 ? "#10b981" : "#3f3f46",
                }}
            >
                {percent}%
            </text>
        </svg>
    );
}

// ─── Course Progress Card ──────────────────────────────────────────────────────
export default function CourseProgressCard({ enrollment }: { enrollment: EnrolledCourse }) {
    const course = enrollment.course_id;
    const { totalLessons, completedLessons, overallPercent } = enrollment.progress;
    const isCompleted = enrollment.status === "completed" || overallPercent >= 100;

    return (
        <div className="group flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            {/* Gradient header */}
            <div className={`h-2 w-full ${isCompleted
                    ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                    : overallPercent > 0
                        ? "bg-gradient-to-r from-indigo-400 to-violet-400"
                        : "bg-gradient-to-r from-zinc-200 to-zinc-300"}`}
            />

            <div className="p-5">
                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {course.grade_id && (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                            {course.grade_id.grade_name}
                        </span>
                    )}
                    {course.subject_id && (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                            {course.subject_id.subject_name}
                        </span>
                    )}
                    {isCompleted && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                            <BiTrophy className="h-3 w-3" /> Completed
                        </span>
                    )}
                    {course.is_vocational && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                            Vocational
                        </span>
                    )}
                </div>

                {/* Title + Progress Ring */}
                <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-zinc-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                            {course.title}
                        </h3>
                        {course.created_by && (
                            <p className="mt-1 text-xs text-zinc-400">
                                By {course.created_by.full_name}
                            </p>
                        )}
                    </div>
                    <div className="relative shrink-0">
                        <ProgressRing percent={overallPercent} />
                        {isCompleted && (
                            <BiCheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-emerald-500 bg-white rounded-full" />
                        )}
                    </div>
                </div>

                {/* Lesson stats */}
                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                            <BiBook className="h-3.5 w-3.5" />
                            {completedLessons}/{totalLessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                            <BiCalendar className="h-3.5 w-3.5" />
                            {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </span>
                    </div>
                    <Link
                        href={`/dashboard/courses/${course._id}`}
                        className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-600 transition-colors"
                    >
                        {isCompleted ? "Review" : overallPercent > 0 ? "Continue" : "Start"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
