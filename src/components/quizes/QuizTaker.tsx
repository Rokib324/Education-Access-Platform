"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    BiX,
    BiCheck,
    BiTime,
    BiTrophy,
    BiArrowToRight,
    BiRefresh,
    BiLoader,
    BiQuestionMark,
} from "react-icons/bi";

// ─── Types ────────────────────────────────────────────────────────────────────
type Option = { _id: string; option_text: string; is_correct: boolean; question_id: string | { toString(): string } };
type Question = {
    _id: string;
    question_text: string;
    question_type: "mcq" | "true_false" | "short_answer";
    marks: number;
};
type QuizData = {
    quiz: {
        _id: string;
        title: string;
        total_marks: number;
        pass_mark: number;
        time_limit_minutes?: number;
    };
    questions: Question[];
    options: Option[];
};
type AnswerMap = Record<string, { selected_option_id?: string; short_answer?: string }>;

// ─── Result Screen ────────────────────────────────────────────────────────────
function ResultScreen({
    score,
    totalMarks,
    passMark,
    passed,
    questions,
    options,
    answers,
    onRetry,
    onClose,
}: {
    score: number;
    totalMarks: number;
    passMark: number;
    passed: boolean;
    questions: Question[];
    options: Option[];
    answers: AnswerMap;
    onRetry: () => void;
    onClose: () => void;
}) {
    const pct = Math.round((score / totalMarks) * 100);

    return (
        <div className="flex flex-col items-center">
            {/* Score ring */}
            <div className={`relative flex h-32 w-32 items-center justify-center rounded-full border-8 shadow-xl mb-6 ${
                passed ? "border-emerald-400 bg-emerald-50" : "border-red-300 bg-red-50"
            }`}>
                <div className="text-center">
                    <span className={`text-3xl font-black ${passed ? "text-emerald-700" : "text-red-600"}`}>
                        {pct}%
                    </span>
                    <p className="text-[11px] text-zinc-500">{score}/{totalMarks}</p>
                </div>
            </div>

            <h2 className={`text-2xl font-black mb-1 ${passed ? "text-emerald-700" : "text-red-600"}`}>
                {passed ? "🎉 You Passed!" : "😔 Not Passed"}
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
                {passed
                    ? "Great job! You scored above the pass mark."
                    : `You need ${passMark} to pass. Keep practicing!`}
            </p>

            {/* Per-question breakdown */}
            <div className="w-full max-w-lg space-y-2 mb-6">
                {questions.map((q, i) => {
                    const ans = answers[q._id];
                    const opts = options.filter((o) => String(o.question_id) === String(q._id));
                    const selected = opts.find((o) => String(o._id) === ans?.selected_option_id);
                    const correct = opts.find((o) => o.is_correct);
                    const isCorrect = selected?.is_correct ?? false;

                    return (
                        <div key={q._id} className={`rounded-xl border p-3 ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-100 bg-red-50"}`}>
                            <div className="flex items-start gap-2">
                                <div className={`h-5 w-5 shrink-0 flex items-center justify-center rounded-full text-white text-[10px] font-bold mt-0.5 ${isCorrect ? "bg-emerald-500" : "bg-red-400"}`}>
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-zinc-800 leading-snug">{q.question_text}</p>
                                    {q.question_type !== "short_answer" && (
                                        <div className="mt-1.5 space-y-0.5 text-[11px]">
                                            {selected && selected._id !== correct?._id && (
                                                <p className="text-red-600">✗ Your answer: {selected.option_text}</p>
                                            )}
                                            {correct && (
                                                <p className="text-emerald-700 font-semibold">✓ Correct: {correct.option_text}</p>
                                            )}
                                        </div>
                                    )}
                                    {q.question_type === "short_answer" && ans?.short_answer && (
                                        <p className="mt-1 text-[11px] italic text-zinc-500">Your answer: {ans.short_answer}</p>
                                    )}
                                </div>
                                {isCorrect
                                    ? <BiCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                                    : <BiX className="h-5 w-5 text-red-400 shrink-0" />}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                    <BiRefresh className="h-4 w-4" /> Retry Quiz
                </button>
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
                >
                    Done <BiArrowToRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

// ─── Main QuizTaker ──────────────────────────────────────────────────────────
type Props = {
    quizId: string;
    onClose: () => void;
};

export default function QuizTaker({ quizId, onClose }: Props) {
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<AnswerMap>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{
        score: number; totalMarks: number; passMark: number; passed: boolean;
    } | null>(null);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    useEffect(() => {
        fetch(`/api/quizzes/${quizId}`)
            .then((r) => r.json())
            .then((data) => {
                setQuizData(data);
                if (data.quiz?.time_limit_minutes) {
                    setTimeLeft(data.quiz.time_limit_minutes * 60);
                }
            })
            .catch(() => setError("Failed to load quiz."))
            .finally(() => setLoading(false));
    }, [quizId]);

    const handleSubmit = useCallback(async () => {
        if (!quizData) return;
        stopTimer();
        setSubmitting(true);
        try {
            const payload = {
                answers: quizData.questions.map((q) => ({
                    question_id: q._id,
                    selected_option_id: answers[q._id]?.selected_option_id,
                    short_answer: answers[q._id]?.short_answer,
                })),
            };
            const res = await fetch(`/api/quizzes/${quizId}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Submission failed.");
            setResult({
                score: data.score,
                totalMarks: data.totalMarks,
                passMark: data.passMark,
                passed: data.passed,
            });
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSubmitting(false);
        }
    }, [quizData, answers, quizId]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft === null || result) return;
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t === null || t <= 1) return 0;
                return t - 1;
            });
        }, 1000);
        return () => stopTimer();
    }, [timeLeft === null ? null : Math.floor(timeLeft / 60), result]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const setAnswer = (qId: string, val: Partial<{ selected_option_id: string; short_answer: string }>) => {
        setAnswers((prev) => ({ ...prev, [qId]: { ...prev[qId], ...val } }));
    };

    if (loading) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 text-white">
                <BiLoader className="h-10 w-10 animate-spin" />
                <p className="text-sm">Loading quiz…</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
                <p className="text-sm text-red-600 mb-4">{error}</p>
                <button onClick={onClose} className="rounded-xl bg-zinc-900 px-5 py-2 text-sm font-semibold text-white">Close</button>
            </div>
        </div>
    );

    const q = quizData!;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="shrink-0 flex items-center justify-between border-b border-zinc-100 px-6 py-4">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-base font-bold text-zinc-900 truncate">{q.quiz.title}</h2>
                        {!result && (
                            <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                                <span className="flex items-center gap-1">
                                    <BiQuestionMark className="h-3.5 w-3.5" />
                                    Question {currentIndex + 1} / {q.questions.length}
                                </span>
                                <span className="flex items-center gap-1">
                                    <BiTrophy className="h-3.5 w-3.5 text-amber-400" />
                                    {q.quiz.total_marks} marks · Pass: {q.quiz.pass_mark}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                        {timeLeft !== null && !result && (
                            <div className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-bold tabular-nums ${
                                timeLeft <= 60 ? "bg-red-100 text-red-600 animate-pulse" : "bg-zinc-100 text-zinc-700"
                            }`}>
                                <BiTime className="h-4 w-4" />
                                {formatTime(timeLeft)}
                            </div>
                        )}
                        <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700">
                            <BiX className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {result ? (
                        <ResultScreen
                            score={result.score}
                            totalMarks={result.totalMarks}
                            passMark={result.passMark}
                            passed={result.passed}
                            questions={q.questions}
                            options={q.options}
                            answers={answers}
                            onRetry={() => {
                                setResult(null);
                                setAnswers({});
                                setCurrentIndex(0);
                                if (q.quiz.time_limit_minutes) setTimeLeft(q.quiz.time_limit_minutes * 60);
                            }}
                            onClose={onClose}
                        />
                    ) : (
                        <>
                            {/* Progress bar */}
                            <div className="mb-5">
                                <div className="h-1.5 w-full rounded-full bg-zinc-200">
                                    <div
                                        className="h-1.5 rounded-full bg-indigo-500 transition-all duration-300"
                                        style={{ width: `${((currentIndex + 1) / q.questions.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Question */}
                            {(() => {
                                const question = q.questions[currentIndex];
                                const opts = q.options.filter(
                                    (o) => String(o.question_id) === String(question._id)
                                );
                                const ans = answers[question._id] ?? {};

                                return (
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                                                {currentIndex + 1}
                                            </div>
                                            <p className="text-base font-semibold text-zinc-900 leading-relaxed">
                                                {question.question_text}
                                                <span className="ml-1.5 text-xs font-normal text-zinc-400">
                                                    ({question.marks} mark{question.marks !== 1 ? "s" : ""})
                                                </span>
                                            </p>
                                        </div>

                                        {/* MCQ / True-False */}
                                        {(question.question_type === "mcq" || question.question_type === "true_false") && (
                                            <div className="ml-11 space-y-2.5">
                                                {opts.map((opt) => {
                                                    const selected = ans.selected_option_id === String(opt._id);
                                                    return (
                                                        <button
                                                            key={opt._id}
                                                            type="button"
                                                            onClick={() => setAnswer(question._id, { selected_option_id: String(opt._id) })}
                                                            className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium text-left transition-colors ${
                                                                selected
                                                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                                                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                                                            }`}
                                                        >
                                                            <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                                                selected ? "border-indigo-500 bg-indigo-500" : "border-zinc-300"
                                                            }`}>
                                                                {selected && <div className="h-2 w-2 rounded-full bg-white" />}
                                                            </div>
                                                            {opt.option_text}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Short Answer */}
                                        {question.question_type === "short_answer" && (
                                            <div className="ml-11">
                                                <textarea
                                                    value={ans.short_answer ?? ""}
                                                    onChange={(e) => setAnswer(question._id, { short_answer: e.target.value })}
                                                    placeholder="Type your answer here…"
                                                    rows={4}
                                                    className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-0 resize-none"
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </>
                    )}
                </div>

                {/* Footer */}
                {!result && (
                    <div className="shrink-0 flex items-center justify-between gap-3 border-t border-zinc-100 px-6 py-4">
                        <button
                            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                            disabled={currentIndex === 0}
                            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
                        >
                            ← Previous
                        </button>
                        <div className="flex gap-1">
                            {q.questions.map((_, i) => (
                                <div
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${
                                        i === currentIndex ? "bg-indigo-500 w-4" : answers[q.questions[i]._id] ? "bg-emerald-400" : "bg-zinc-200"
                                    }`}
                                />
                            ))}
                        </div>
                        {currentIndex < q.questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentIndex((i) => i + 1)}
                                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
                            >
                                Next <BiArrowToRight className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                            >
                                {submitting ? <BiLoader className="h-4 w-4 animate-spin" /> : <BiCheck className="h-4 w-4" />}
                                {submitting ? "Submitting…" : "Submit Quiz"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
