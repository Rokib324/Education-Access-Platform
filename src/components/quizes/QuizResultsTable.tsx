"use client";

import { useState, useEffect } from "react";
import { BiRefresh, BiUser, BiTrophy, BiCheck, BiX, BiLoader } from "react-icons/bi";

type Attempt = {
    _id: string;
    student_id: {
        _id: string;
        full_name: string;
        email: string;
    };
    score: number;
    attempted_at: string;
};

type QuizStats = {
    total: number;
    passCount: number;
    avgScore: number;
    passRate: number;
};

type Quiz = {
    title: string;
    total_marks: number;
    pass_mark: number;
};

export default function QuizResultsTable({ quizId }: { quizId: string }) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [stats, setStats] = useState<QuizStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResults = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/quizzes/${quizId}/results`);
            if (!res.ok) throw new Error("Failed to load results.");
            const data = await res.json();
            setQuiz(data.quiz);
            setAttempts(data.attempts ?? []);
            setStats(data.stats ?? null);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchResults(); }, [quizId]);

    if (loading) return (
        <div className="flex items-center justify-center py-16 text-zinc-400">
            <BiLoader className="h-6 w-6 animate-spin mr-2" /> Loading results…
        </div>
    );
    if (error) return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex justify-between">
            {error}
            <button onClick={fetchResults} className="underline font-semibold">Retry</button>
        </div>
    );

    return (
        <div className="space-y-5">
            {/* Stats summary */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-xl border border-zinc-200 bg-white p-3 text-center shadow-sm">
                        <p className="text-xs text-zinc-500">Total Attempts</p>
                        <p className="text-xl font-bold text-zinc-900">{stats.total}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center shadow-sm">
                        <p className="text-xs text-emerald-600">Passed</p>
                        <p className="text-xl font-bold text-emerald-700">{stats.passCount}</p>
                    </div>
                    <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-center shadow-sm">
                        <p className="text-xs text-red-500">Failed</p>
                        <p className="text-xl font-bold text-red-600">{stats.total - stats.passCount}</p>
                    </div>
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-center shadow-sm">
                        <p className="text-xs text-indigo-500">Avg Score</p>
                        <p className="text-xl font-bold text-indigo-700">
                            {quiz ? `${stats.avgScore}/${quiz.total_marks}` : `${stats.avgScore}`}
                        </p>
                    </div>
                </div>
            )}

            {/* Pass rate bar */}
            {stats && stats.total > 0 && (
                <div>
                    <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                        <span>Pass rate</span>
                        <span className="font-semibold text-emerald-600">{stats.passRate}%</span>
                    </div>
                    <div className="h-2. w-full rounded-full bg-zinc-200">
                        <div
                            className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${stats.passRate}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3">
                    <BiUser className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm font-semibold text-zinc-700">Student Attempts</span>
                    <button
                        onClick={fetchResults}
                        className="ml-auto flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs text-zinc-500 hover:bg-zinc-50 transition-colors"
                    >
                        <BiRefresh className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                    </button>
                </div>

                {attempts.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-center text-zinc-400">
                        <BiTrophy className="h-8 w-8 mb-2" />
                        <p className="text-sm">No submissions yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100">
                        {attempts.map((attempt) => {
                            const pct = quiz ? Math.round((attempt.score / quiz.total_marks) * 100) : 0;
                            const passed = quiz ? attempt.score >= quiz.pass_mark : false;
                            return (
                                <div key={attempt._id} className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-50 transition-colors">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                                        {attempt.student_id.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-zinc-900 truncate">{attempt.student_id.full_name}</p>
                                        <p className="text-xs text-zinc-400 truncate">{attempt.student_id.email}</p>
                                    </div>
                                    <div className="hidden sm:flex flex-col items-end gap-1 w-32">
                                        <div className="flex justify-between w-full text-[11px] text-zinc-500">
                                            <span>{attempt.score}/{quiz?.total_marks ?? "?"} marks</span>
                                            <span className="font-semibold">{pct}%</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-zinc-200">
                                            <div
                                                className={`h-1.5 rounded-full transition-all ${passed ? "bg-emerald-500" : "bg-red-400"}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className={`flex items-center gap-1 shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                        passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                                    }`}>
                                        {passed ? <BiCheck className="h-3 w-3" /> : <BiX className="h-3 w-3" />}
                                        {passed ? "Passed" : "Failed"}
                                    </span>
                                    <span className="hidden lg:block shrink-0 text-[11px] text-zinc-400">
                                        {new Date(attempt.attempted_at).toLocaleDateString()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
