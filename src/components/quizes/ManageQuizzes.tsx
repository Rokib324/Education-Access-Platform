"use client";

import { useState, useEffect, useCallback } from "react";
import {
    BiPlus,
    BiTrash,
    BiEdit,
    BiLoader,
    BiRefresh,
    BiBook,
    BiTrophy,
    BiTime,
    BiUser,
    BiBarChart,
} from "react-icons/bi";
import Link from "next/link";
import QuizFormModal from "./QuizFormModal";

type QuizSummary = {
    _id: string;
    title: string;
    total_marks: number;
    pass_mark: number;
    time_limit_minutes?: number;
    questionCount: number;
    course_id: { _id: string; title: string } | string;
    lesson_id?: { title: string } | null;
};

export default function ManageQuizzes() {
    const [courses, setCourses] = useState<{ _id: string; title: string }[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editQuiz, setEditQuiz] = useState<QuizSummary | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Fetch teacher's courses
    useEffect(() => {
        fetch("/api/profile/stats")
            .then((r) => r.json())
            .catch(() => null);
        fetch("/api/courses")
            .then((r) => r.json())
            .then((d) => {
                setCourses(d.courses ?? []);
                if (d.courses?.length > 0) setSelectedCourse(d.courses[0]._id);
            })
            .catch(() => {});
    }, []);

    const fetchQuizzes = useCallback(async () => {
        if (!selectedCourse) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/quizzes?courseId=${selectedCourse}`);
            const data = await res.json();
            setQuizzes(data.quizzes ?? []);
        } catch (_) {
            setQuizzes([]);
        } finally {
            setLoading(false);
        }
    }, [selectedCourse]);

    useEffect(() => { fetchQuizzes(); }, [fetchQuizzes]);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this quiz and all its questions?")) return;
        setDeletingId(id);
        try {
            await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
            setQuizzes((prev) => prev.filter((q) => q._id !== id));
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaved = () => {
        setShowModal(false);
        setEditQuiz(null);
        fetchQuizzes();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Manage Quizzes</h1>
                    <p className="mt-0.5 text-sm text-zinc-500">Create and manage quizzes for your courses</p>
                </div>
                <button
                    onClick={() => { setEditQuiz(null); setShowModal(true); }}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <BiPlus className="h-4 w-4" />
                    New Quiz
                </button>
            </div>

            {/* Course selector */}
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <label className="text-sm font-medium text-zinc-700">Course:</label>
                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="flex-1 min-w-[200px] rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                    {courses.map((c) => (
                        <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                </select>
                <button
                    onClick={fetchQuizzes}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                    <BiRefresh className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* Quiz list */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-zinc-400">
                    <BiLoader className="h-8 w-8 animate-spin mr-2" />
                    Loading quizzes…
                </div>
            ) : quizzes.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-20 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 mb-4">
                        <BiBook className="h-8 w-8 text-indigo-300" />
                    </div>
                    <h3 className="text-base font-semibold text-zinc-800">No quizzes yet</h3>
                    <p className="mt-1 text-sm text-zinc-500">Create your first quiz for this course.</p>
                    <button
                        onClick={() => { setEditQuiz(null); setShowModal(true); }}
                        className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        <BiPlus className="h-4 w-4" /> Create Quiz
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {quizzes.map((quiz) => (
                        <div key={quiz._id} className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                            {/* Icon */}
                            <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <BiBook className="h-6 w-6" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-zinc-900 truncate">{quiz.title}</h3>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                                    <span className="flex items-center gap-1">
                                        <BiBook className="h-3.5 w-3.5" />
                                        {quiz.questionCount} questions
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <BiTrophy className="h-3.5 w-3.5 text-amber-400" />
                                        {quiz.total_marks} marks
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <BiBarChart className="h-3.5 w-3.5 text-emerald-500" />
                                        Pass: {quiz.pass_mark}
                                    </span>
                                    {quiz.time_limit_minutes && (
                                        <span className="flex items-center gap-1">
                                            <BiTime className="h-3.5 w-3.5 text-blue-400" />
                                            {quiz.time_limit_minutes} min
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex shrink-0 items-center gap-2">
                                <Link
                                    href={`/dashboard/quizzes/${quiz._id}/results`}
                                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
                                >
                                    <BiUser className="h-3.5 w-3.5" />
                                    Results
                                </Link>
                                <button
                                    onClick={() => { setEditQuiz(quiz); setShowModal(true); }}
                                    className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-colors"
                                >
                                    <BiEdit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(quiz._id)}
                                    disabled={deletingId === quiz._id}
                                    className="rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                                >
                                    {deletingId === quiz._id
                                        ? <BiLoader className="h-4 w-4 animate-spin" />
                                        : <BiTrash className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <QuizFormModal
                    courses={courses}
                    defaultCourseId={selectedCourse}
                    editQuiz={editQuiz}
                    onClose={() => { setShowModal(false); setEditQuiz(null); }}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
}
