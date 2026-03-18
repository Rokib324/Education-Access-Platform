"use client";

import { useState, useEffect } from "react";
import {
    BiX,
    BiPlus,
    BiTrash,
    BiCheck,
    BiLoader,
    BiBook,
    BiTime,
    BiTrophy,
} from "react-icons/bi";

type Course = { _id: string; title: string };

type QuizSummary = {
    _id: string;
    title: string;
    total_marks: number;
    pass_mark: number;
    time_limit_minutes?: number;
    course_id: { _id: string; title: string } | string;
};

type QuestionType = "mcq" | "true_false" | "short_answer";

type DraftOption = { option_text: string; is_correct: boolean };
type DraftQuestion = {
    id: string; // local only
    question_text: string;
    question_type: QuestionType;
    marks: number;
    options: DraftOption[];
};

// ─── Helper: new blank question ───────────────────────────────────────────────
const blankQuestion = (): DraftQuestion => ({
    id: Math.random().toString(36).slice(2),
    question_text: "",
    question_type: "mcq",
    marks: 1,
    options: [
        { option_text: "", is_correct: true },
        { option_text: "", is_correct: false },
    ],
});

// ─── Option Row ─────────────────────────────────────────────────────────────
function OptionRow({
    option,
    index,
    onChange,
    onRemove,
    onMarkCorrect,
    type,
}: {
    option: DraftOption;
    index: number;
    onChange: (text: string) => void;
    onRemove: () => void;
    onMarkCorrect: () => void;
    type: QuestionType;
}) {
    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={onMarkCorrect}
                title="Mark as correct"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    option.is_correct
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-zinc-300 text-transparent"
                }`}
            >
                <BiCheck className="h-3.5 w-3.5" />
            </button>
            <input
                value={option.option_text}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`Option ${index + 1}`}
                disabled={type === "true_false"}
                className="flex-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-zinc-50"
            />
            {type !== "true_false" && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                >
                    <BiX className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

// ─── Question Builder ────────────────────────────────────────────────────────
function QuestionCard({
    question,
    index,
    onChange,
    onRemove,
    saving,
}: {
    question: DraftQuestion;
    index: number;
    onChange: (q: DraftQuestion) => void;
    onRemove: () => void;
    saving: boolean;
}) {
    const setType = (type: QuestionType) => {
        let options: DraftOption[] = question.options;
        if (type === "true_false") {
            options = [
                { option_text: "True", is_correct: true },
                { option_text: "False", is_correct: false },
            ];
        } else if (type === "mcq" && question.question_type !== "mcq") {
            options = [
                { option_text: "", is_correct: true },
                { option_text: "", is_correct: false },
            ];
        } else if (type === "short_answer") {
            options = [];
        }
        onChange({ ...question, question_type: type, options });
    };

    const updateOption = (i: number, text: string) => {
        const opts = [...question.options];
        opts[i] = { ...opts[i], option_text: text };
        onChange({ ...question, options: opts });
    };

    const markCorrect = (i: number) => {
        const opts = question.options.map((o, idx) => ({ ...o, is_correct: idx === i }));
        onChange({ ...question, options: opts });
    };

    const removeOption = (i: number) => {
        if (question.options.length <= 2) return;
        const opts = question.options.filter((_, idx) => idx !== i);
        // Ensure at least one correct
        if (!opts.some((o) => o.is_correct)) opts[0].is_correct = true;
        onChange({ ...question, options: opts });
    };

    const addOption = () => {
        onChange({
            ...question,
            options: [...question.options, { option_text: "", is_correct: false }],
        });
    };

    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                    Q{index + 1}
                </span>
                <button
                    type="button"
                    onClick={onRemove}
                    disabled={saving}
                    className="rounded-lg border border-red-200 p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <BiTrash className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Question text */}
            <textarea
                required
                value={question.question_text}
                onChange={(e) => onChange({ ...question, question_text: e.target.value })}
                placeholder="Enter your question…"
                rows={2}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />

            {/* Type + Marks */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
                    {(["mcq", "true_false", "short_answer"] as QuestionType[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                                question.question_type === t
                                    ? "bg-white text-zinc-900 shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-700"
                            }`}
                        >
                            {t === "mcq" ? "MCQ" : t === "true_false" ? "T/F" : "Short"}
                        </button>
                    ))}
                </div>
                <label className="flex items-center gap-1.5 text-xs text-zinc-600">
                    <BiTrophy className="h-3.5 w-3.5 text-amber-400" />
                    Marks:
                    <input
                        type="number"
                        min={1}
                        value={question.marks}
                        onChange={(e) => onChange({ ...question, marks: Number(e.target.value) })}
                        className="w-14 rounded-lg border border-zinc-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                </label>
            </div>

            {/* Options */}
            {question.question_type !== "short_answer" && (
                <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-zinc-600 mb-1">
                        Options <span className="text-zinc-400 font-normal">(click circle to mark correct)</span>
                    </p>
                    {question.options.map((opt, i) => (
                        <OptionRow
                            key={i}
                            option={opt}
                            index={i}
                            type={question.question_type}
                            onChange={(text) => updateOption(i, text)}
                            onRemove={() => removeOption(i)}
                            onMarkCorrect={() => markCorrect(i)}
                        />
                    ))}
                    {question.question_type === "mcq" && (
                        <button
                            type="button"
                            onClick={addOption}
                            className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-1"
                        >
                            <BiPlus className="h-3.5 w-3.5" /> Add option
                        </button>
                    )}
                </div>
            )}
            {question.question_type === "short_answer" && (
                <p className="mt-3 text-xs italic text-zinc-400">
                    Students will type their answer (manually graded later).
                </p>
            )}
        </div>
    );
}

// ─── Main Modal ──────────────────────────────────────────────────────────────
type Props = {
    courses: Course[];
    defaultCourseId?: string;
    editQuiz: QuizSummary | null;
    onClose: () => void;
    onSaved: () => void;
};

export default function QuizFormModal({ courses, defaultCourseId, editQuiz, onClose, onSaved }: Props) {
    const [title, setTitle] = useState(editQuiz?.title ?? "");
    const [courseId, setCourseId] = useState(
        editQuiz && typeof editQuiz.course_id === "string"
            ? editQuiz.course_id
            : editQuiz && typeof editQuiz.course_id === "object"
            ? (editQuiz.course_id as Course)._id
            : defaultCourseId ?? ""
    );
    const [totalMarks, setTotalMarks] = useState(editQuiz?.total_marks ?? 100);
    const [passMark, setPassMark] = useState(editQuiz?.pass_mark ?? 50);
    const [timeLimit, setTimeLimit] = useState(editQuiz?.time_limit_minutes ?? 30);
    const [questions, setQuestions] = useState<DraftQuestion[]>([blankQuestion()]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<"meta" | "questions">(editQuiz ? "questions" : "meta");
    const [savedQuizId, setSavedQuizId] = useState<string | null>(editQuiz?._id ?? null);

    // If editing, load existing questions
    useEffect(() => {
        if (!editQuiz) return;
        fetch(`/api/quizzes/${editQuiz._id}`)
            .then((r) => r.json())
            .then((data) => {
                if (!data.questions) return;
                const loaded: DraftQuestion[] = data.questions.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (q: any) => ({
                        id: q._id,
                        question_text: q.question_text,
                        question_type: q.question_type,
                        marks: q.marks,
                        options: data.options
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .filter((o: any) => o.question_id === q._id || o.question_id?.toString() === q._id?.toString())
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .map((o: any) => ({ option_text: o.option_text, is_correct: o.is_correct })),
                    })
                );
                setQuestions(loaded.length > 0 ? loaded : [blankQuestion()]);
            })
            .catch(() => {});
    }, [editQuiz]);

    // Step 1: save quiz metadata
    const saveMetadata = async () => {
        if (!title.trim()) { setError("Title is required."); return; }
        setSaving(true);
        setError(null);
        try {
            if (savedQuizId) {
                // Update
                const res = await fetch(`/api/quizzes/${savedQuizId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, total_marks: totalMarks, pass_mark: passMark, time_limit_minutes: timeLimit }),
                });
                if (!res.ok) throw new Error((await res.json()).error ?? "Failed to update.");
            } else {
                // Create
                const res = await fetch("/api/quizzes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ course_id: courseId, title, total_marks: totalMarks, pass_mark: passMark, time_limit_minutes: timeLimit }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error ?? "Failed to create quiz.");
                setSavedQuizId(data.quiz._id);
            }
            setStep("questions");
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSaving(false);
        }
    };

    // Step 2: save all questions
    const saveQuestions = async () => {
        if (!savedQuizId) return;
        const invalid = questions.some(
            (q) =>
                !q.question_text.trim() ||
                (q.question_type !== "short_answer" && q.options.some((o) => !o.option_text.trim()))
        );
        if (invalid) { setError("All questions and option texts must be filled in."); return; }

        setSaving(true);
        setError(null);
        try {
            for (const q of questions) {
                if (q.id.length === 24) continue; // already saved (edit mode, existing questions)
                await fetch(`/api/quizzes/${savedQuizId}/questions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        question_text: q.question_text,
                        question_type: q.question_type,
                        marks: q.marks,
                        options: q.options,
                    }),
                });
            }
            onSaved();
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl max-h-[90vh]">
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-6 py-4">
                    <div>
                        <h2 className="text-base font-bold text-zinc-900">
                            {editQuiz ? "Edit Quiz" : "Create New Quiz"}
                        </h2>
                        <div className="mt-1 flex items-center gap-2">
                            {["meta", "questions"].map((s, i) => (
                                <div key={s} className="flex items-center gap-1.5">
                                    <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                                        step === s || (s === "meta" && step === "questions")
                                            ? "bg-indigo-600 text-white"
                                            : "bg-zinc-200 text-zinc-500"
                                    }`}>{i + 1}</div>
                                    <span className="text-xs text-zinc-500 capitalize">{s === "meta" ? "Quiz Info" : "Questions"}</span>
                                    {i < 1 && <span className="text-zinc-300 text-xs">›</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700">
                        <BiX className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {step === "meta" ? (
                        <>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Course *</label>
                                <select
                                    value={courseId}
                                    onChange={(e) => setCourseId(e.target.value)}
                                    disabled={!!editQuiz}
                                    className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-zinc-50"
                                >
                                    {courses.map((c) => (
                                        <option key={c._id} value={c._id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Quiz Title *</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Chapter 1 Assessment"
                                    className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                                        <BiTrophy className="h-3.5 w-3.5 text-amber-400" /> Total Marks
                                    </label>
                                    <input type="number" min={1} value={totalMarks}
                                        onChange={(e) => setTotalMarks(Number(e.target.value))}
                                        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                                </div>
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                                        <BiCheck className="h-3.5 w-3.5 text-emerald-500" /> Pass Mark
                                    </label>
                                    <input type="number" min={1} max={totalMarks} value={passMark}
                                        onChange={(e) => setPassMark(Number(e.target.value))}
                                        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                                </div>
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                                        <BiTime className="h-3.5 w-3.5 text-blue-400" /> Time (min)
                                    </label>
                                    <input type="number" min={1} value={timeLimit}
                                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                                        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-zinc-700">
                                    {questions.length} question{questions.length !== 1 ? "s" : ""}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setQuestions((prev) => [...prev, blankQuestion()])}
                                    className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                                >
                                    <BiPlus className="h-3.5 w-3.5" /> Add Question
                                </button>
                            </div>
                            <div className="space-y-4">
                                {questions.map((q, i) => (
                                    <QuestionCard
                                        key={q.id}
                                        question={q}
                                        index={i}
                                        saving={saving}
                                        onChange={(updated) => {
                                            const qs = [...questions];
                                            qs[i] = updated;
                                            setQuestions(qs);
                                        }}
                                        onRemove={() => {
                                            if (questions.length === 1) return;
                                            setQuestions(questions.filter((_, idx) => idx !== i));
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="shrink-0 flex items-center justify-between gap-3 border-t border-zinc-100 px-6 py-4">
                    <button
                        type="button"
                        onClick={step === "meta" ? onClose : () => setStep("meta")}
                        className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50"
                    >
                        {step === "meta" ? "Cancel" : "← Back"}
                    </button>
                    <button
                        type="button"
                        onClick={step === "meta" ? saveMetadata : saveQuestions}
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                    >
                        {saving ? <BiLoader className="h-4 w-4 animate-spin" /> : <BiBook className="h-4 w-4" />}
                        {saving ? "Saving…" : step === "meta" ? "Next: Add Questions →" : "Save Quiz"}
                    </button>
                </div>
            </div>
        </div>
    );
}
