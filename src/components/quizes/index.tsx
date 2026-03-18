"use client";

import { useState, useEffect, useCallback } from "react";
import {
    BiBook,
    BiTrophy,
    BiTime,
    BiRefresh,
    BiCheck,
    BiQuestionMark,
    BiSearch,
} from "react-icons/bi";
import QuizTaker from "./QuizTaker";

type QuizItem = {
    _id: string;
    title: string;
    total_marks: number;
    pass_mark: number;
    time_limit_minutes?: number;
    questionCount: number;
    course_id: { _id: string; title: string } | string;
    lesson_id?: { title: string } | null;
    lastAttempt?: { score: number; attempted_at: string } | null;
};

type EnrolledCourse = { _id: string; course_id: { _id: string; title: string } };

// ─── Score Badge ──────────────────────────────────────────────────────────────
const ScoreBadge = ({ score, total, pass }: { score: number; total: number; pass: number }) => {
    const pct = Math.round((score / total) * 100);
    const passed = score >= pass;
    const color = passed
        ? "bg-emerald-100 text-emerald-700"
        : "bg-red-100 text-red-600";
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${color}`}>
            {passed ? <BiCheck className="h-3 w-3" /> : null}
            {score}/{total} ({pct}%)
        </span>
    );
};

// ─── Quiz Card ────────────────────────────────────────────────────────────────
function QuizCard({ quiz, onStart }: { quiz: QuizItem; onStart: (id: string) => void }) {
    const attempted = !!quiz.lastAttempt;
    const courseTitle = typeof quiz.course_id === "object" ? quiz.course_id.title : "";

    return (
        <div className="group flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            {/* Gradient top */}
            <div className={`h-1.5 w-full ${attempted ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-gradient-to-r from-indigo-400 to-violet-400"}`} />

            <div className="flex flex-col gap-3 p-5">
                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                    {courseTitle && (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 truncate max-w-[120px]">
                            {courseTitle}
                        </span>
                    )}
                    {quiz.lesson_id && (
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 truncate max-w-[120px]">
                            {quiz.lesson_id.title}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-zinc-900 leading-snug group-hover:text-indigo-600 transition-colors">
                    {quiz.title}
                </h3>

                {/* Stats */}
                <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                        <BiQuestionMark className="h-3.5 w-3.5" />
                        {quiz.questionCount} questions
                    </span>
                    <span className="flex items-center gap-1">
                        <BiTrophy className="h-3.5 w-3.5 text-amber-400" />
                        {quiz.total_marks} marks
                    </span>
                    {quiz.time_limit_minutes && (
                        <span className="flex items-center gap-1">
                            <BiTime className="h-3.5 w-3.5 text-blue-400" />
                            {quiz.time_limit_minutes} min
                        </span>
                    )}
                </div>

                {/* Last attempt */}
                {attempted ? (
                    <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 border border-zinc-100">
                        <span className="text-xs text-zinc-500">Last score</span>
                        <ScoreBadge
                            score={quiz.lastAttempt!.score}
                            total={quiz.total_marks}
                            pass={quiz.pass_mark}
                        />
                    </div>
                ) : (
                    <div className="rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-500 italic border border-indigo-100">
                        Not attempted yet
                    </div>
                )}

                {/* CTA */}
                <button
                    onClick={() => onStart(quiz._id)}
                    className={`w-full rounded-xl py-2.5 text-sm font-bold transition-colors ${
                        attempted
                            ? "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                >
                    {attempted ? "Retry Quiz" : "Start Quiz"}
                </button>
            </div>
        </div>
    );
}

// ─── Main QuizList ─────────────────────────────────────────────────────────────
const QuizList = () => {
    const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
    const [tab, setTab] = useState<"all" | "attempted" | "pending">("all");
    const [search, setSearch] = useState("");

    const fetchQuizzes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Get enrolled courses first
            const enrollRes = await fetch("/api/enrollments");
            const enrollData = await enrollRes.json();
            const enrollments: EnrolledCourse[] = enrollData.enrollments ?? [];

            if (enrollments.length === 0) {
                setQuizzes([]);
                return;
            }

            // Fetch quizzes for each enrolled course
            const allQuizzes: QuizItem[] = [];
            await Promise.all(
                enrollments.map(async (e) => {
                    const courseId = typeof e.course_id === "object" ? e.course_id._id : e.course_id;
                    const res = await fetch(`/api/quizzes?courseId=${courseId}`);
                    const data = await res.json();
                    allQuizzes.push(...(data.quizzes ?? []));
                })
            );
            setQuizzes(allQuizzes);
        } catch (_) {
            setError("Failed to load quizzes.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchQuizzes(); }, [fetchQuizzes]);

    const filtered = quizzes.filter((q) => {
        if (tab === "attempted" && !q.lastAttempt) return false;
        if (tab === "pending" && q.lastAttempt) return false;
        if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const attempted = quizzes.filter((q) => !!q.lastAttempt).length;
    const avgScore =
        attempted > 0
            ? Math.round(
                  quizzes
                      .filter((q) => q.lastAttempt)
                      .reduce((sum, q) => sum + (q.lastAttempt!.score / q.total_marks) * 100, 0) / attempted
              )
            : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Quizzes</h1>
                    <p className="mt-0.5 text-sm text-zinc-500">Test your knowledge across all your courses</p>
                </div>
                {attempted > 0 && (
                    <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 shadow-sm">
                        <BiTrophy className="h-5 w-5 text-amber-500" />
                        <div>
                            <p className="text-xs text-amber-600">Avg Score</p>
                            <p className="text-sm font-bold text-amber-800">{avgScore}%</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats */}
            {quizzes.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-zinc-200 bg-white p-3 text-center shadow-sm">
                        <p className="text-xs text-zinc-500">Available</p>
                        <p className="text-xl font-bold text-zinc-900">{quizzes.length}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center shadow-sm">
                        <p className="text-xs text-emerald-600">Attempted</p>
                        <p className="text-xl font-bold text-emerald-700">{attempted}</p>
                    </div>
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-center shadow-sm">
                        <p className="text-xs text-indigo-500">Pending</p>
                        <p className="text-xl font-bold text-indigo-700">{quizzes.length - attempted}</p>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="relative flex-1 min-w-[160px]">
                    <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search quizzes…"
                        className="w-full rounded-lg border border-zinc-200 py-2 pl-9 pr-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
                    {(["all", "attempted", "pending"] as const).map((t) => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                                tab === t ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                            }`}>
                            {t}
                        </button>
                    ))}
                </div>
                <button onClick={fetchQuizzes}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
                    <BiRefresh className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-zinc-400">
                    <BiRefresh className="h-8 w-8 animate-spin mr-2" /> Loading quizzes…
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 text-center">
                    {error} <button onClick={fetchQuizzes} className="underline font-semibold ml-1">Retry</button>
                </div>
            ) : quizzes.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-20 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 mb-4">
                        <BiBook className="h-8 w-8 text-indigo-300" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-800">No quizzes available</h3>
                    <p className="mt-1.5 max-w-xs text-sm text-zinc-500">
                        Enroll in courses to see quizzes. Teachers will add quizzes to their lessons.
                    </p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-200 py-12 text-center text-sm text-zinc-500">
                    No quizzes match your filters.
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((quiz) => (
                        <QuizCard key={quiz._id} quiz={quiz} onStart={setActiveQuizId} />
                    ))}
                </div>
            )}

            {/* Quiz Taker */}
            {activeQuizId && (
                <QuizTaker
                    quizId={activeQuizId}
                    onClose={() => { setActiveQuizId(null); fetchQuizzes(); }}
                />
            )}
        </div>
    );
};

export default QuizList;
