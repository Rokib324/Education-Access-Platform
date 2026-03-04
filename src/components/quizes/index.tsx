"use client";

import { useState } from "react";
import {
  BiCheck,
  BiQuestionMark,
  BiTime,
  BiTrophy,
  BiX,
} from "react-icons/bi";

export type Quiz = {
  _id: string;
  title: string;
  lesson_title?: string;
  total_marks: number;
  question_count: number;
  last_score?: number;
  last_attempted?: string;
};

// ─── Score Badge ──────────────────────────────────────────────────────────────
const ScoreBadge = ({
  score,
  total,
}: {
  score: number;
  total: number;
}) => {
  const pct = Math.round((score / total) * 100);
  const color =
    pct >= 80
      ? "bg-emerald-100 text-emerald-700"
      : pct >= 50
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${color}`}>
      {score}/{total} ({pct}%)
    </span>
  );
};

// ─── Quiz Card ────────────────────────────────────────────────────────────────
export const QuizCard = ({ quiz }: { quiz: Quiz }) => (
  <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-zinc-900">{quiz.title}</h3>
        {quiz.lesson_title && (
          <p className="mt-0.5 text-xs text-zinc-500">
            Lesson: {quiz.lesson_title}
          </p>
        )}
      </div>
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-100">
        <BiQuestionMark className="h-5 w-5 text-zinc-500" />
      </div>
    </div>

    {/* Stats row */}
    <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
      <span className="flex items-center gap-1">
        <BiQuestionMark className="h-3.5 w-3.5" />
        {quiz.question_count} questions
      </span>
      <span className="flex items-center gap-1">
        <BiTrophy className="h-3.5 w-3.5 text-amber-400" />
        {quiz.total_marks} marks
      </span>
      {quiz.last_attempted && (
        <span className="flex items-center gap-1">
          <BiTime className="h-3.5 w-3.5" />
          {quiz.last_attempted}
        </span>
      )}
    </div>

    {/* Last score */}
    {quiz.last_score !== undefined ? (
      <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
        <span className="text-xs text-zinc-500">Last attempt</span>
        <ScoreBadge score={quiz.last_score} total={quiz.total_marks} />
      </div>
    ) : (
      <div className="rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-400 italic">
        Not attempted yet
      </div>
    )}

    <button className="w-full rounded-lg bg-zinc-900 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors">
      {quiz.last_score !== undefined ? "Retry Quiz" : "Start Quiz"}
    </button>
  </div>
);

// ─── Demo data ────────────────────────────────────────────────────────────────
const DEMO_QUIZZES: Quiz[] = [
  {
    _id: "q1",
    title: "Numbers & Counting Quiz",
    lesson_title: "Introduction to Numbers",
    total_marks: 20,
    question_count: 10,
    last_score: 18,
    last_attempted: "Mar 1, 2026",
  },
  {
    _id: "q2",
    title: "Addition Mastery Check",
    lesson_title: "Addition & Subtraction",
    total_marks: 30,
    question_count: 15,
    last_score: 12,
    last_attempted: "Mar 2, 2026",
  },
  {
    _id: "q3",
    title: "Multiplication Tables Test",
    lesson_title: "Multiplication Tables",
    total_marks: 25,
    question_count: 12,
  },
  {
    _id: "q4",
    title: "Spelling & Word Formation",
    lesson_title: "Word Formation & Spelling",
    total_marks: 20,
    question_count: 10,
    last_score: 19,
    last_attempted: "Mar 3, 2026",
  },
  {
    _id: "q5",
    title: "Sentence Building Quiz",
    lesson_title: "Sentence Structure",
    total_marks: 30,
    question_count: 15,
  },
];

// ─── Quiz List ────────────────────────────────────────────────────────────────
const QuizList = () => {
  const [tab, setTab] = useState<"all" | "attempted" | "pending">("all");

  const filtered = DEMO_QUIZZES.filter((q) => {
    if (tab === "attempted") return q.last_score !== undefined;
    if (tab === "pending") return q.last_score === undefined;
    return true;
  });

  const attempted = DEMO_QUIZZES.filter((q) => q.last_score !== undefined).length;
  const avgScore =
    attempted > 0
      ? Math.round(
          DEMO_QUIZZES.filter((q) => q.last_score !== undefined).reduce(
            (sum, q) => sum + (q.last_score! / q.total_marks) * 100,
            0
          ) / attempted
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Quizzes</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Test your knowledge across all lessons
          </p>
        </div>
        {attempted > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2">
            <BiTrophy className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-semibold text-zinc-900">
              Avg Score: {avgScore}%
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-zinc-200 bg-white p-1 w-fit shadow-sm">
        {(["all", "attempted", "pending"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((quiz) => (
          <QuizCard key={quiz._id} quiz={quiz} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center">
          <BiCheck className="h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-500">No quizzes in this category.</p>
        </div>
      )}
    </div>
  );
};

export default QuizList;
