"use client";

import { useState } from "react";
import {
  BiBookOpen,
  BiCheckCircle,
  BiDownload,
  BiPlay,
  BiSortAlt2,
} from "react-icons/bi";

export type Lesson = {
  _id: string;
  title: string;
  content_type: "video" | "text" | "interactive";
  difficulty_level: "beginner" | "intermediate" | "advanced";
  sequence_no: number;
  course_title?: string;
  duration_min?: number;
  is_completed?: boolean;
  is_downloaded?: boolean;
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-700",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  video: <BiPlay className="h-4 w-4" />,
  text: <BiBookOpen className="h-4 w-4" />,
  interactive: <BiSortAlt2 className="h-4 w-4" />,
};

// ─── Lesson Card ──────────────────────────────────────────────────────────────
export const LessonCard = ({ lesson }: { lesson: Lesson }) => (
  <div className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
    {/* Sequence number */}
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-100 text-sm font-bold text-zinc-600">
      {lesson.sequence_no}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        {/* Type badge */}
        <span className="flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 capitalize">
          {TYPE_ICONS[lesson.content_type]}
          {lesson.content_type}
        </span>
        {/* Difficulty badge */}
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
            DIFFICULTY_COLORS[lesson.difficulty_level]
          }`}
        >
          {lesson.difficulty_level}
        </span>
        {lesson.is_completed && (
          <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
            <BiCheckCircle className="h-3.5 w-3.5" />
            Done
          </span>
        )}
      </div>

      <h3 className="mt-1.5 text-sm font-semibold text-zinc-900 leading-snug">
        {lesson.title}
      </h3>
      {lesson.course_title && (
        <p className="text-xs text-zinc-500 mt-0.5">{lesson.course_title}</p>
      )}
    </div>

    {/* Actions */}
    <div className="flex shrink-0 items-center gap-2">
      {lesson.duration_min && (
        <span className="text-xs text-zinc-400">{lesson.duration_min}m</span>
      )}
      <button
        title="Download for offline"
        className={`rounded-lg border p-2 transition-colors ${
          lesson.is_downloaded
            ? "border-zinc-200 bg-zinc-50 text-zinc-400"
            : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
        }`}
      >
        <BiDownload className="h-4 w-4" />
      </button>
      <button className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors">
        Start
      </button>
    </div>
  </div>
);

// ─── Demo data ────────────────────────────────────────────────────────────────
const DEMO_LESSONS: Lesson[] = [
  {
    _id: "l1",
    title: "Introduction to Numbers",
    content_type: "video",
    difficulty_level: "beginner",
    sequence_no: 1,
    course_title: "Mathematics Fundamentals",
    duration_min: 8,
    is_completed: true,
  },
  {
    _id: "l2",
    title: "Addition & Subtraction",
    content_type: "interactive",
    difficulty_level: "beginner",
    sequence_no: 2,
    course_title: "Mathematics Fundamentals",
    duration_min: 15,
    is_completed: true,
  },
  {
    _id: "l3",
    title: "Multiplication Tables",
    content_type: "text",
    difficulty_level: "intermediate",
    sequence_no: 3,
    course_title: "Mathematics Fundamentals",
    duration_min: 12,
    is_completed: false,
    is_downloaded: true,
  },
  {
    _id: "l4",
    title: "Word Formation & Spelling",
    content_type: "interactive",
    difficulty_level: "beginner",
    sequence_no: 1,
    course_title: "English Reading & Writing",
    duration_min: 10,
    is_completed: false,
  },
  {
    _id: "l5",
    title: "Sentence Structure",
    content_type: "video",
    difficulty_level: "intermediate",
    sequence_no: 2,
    course_title: "English Reading & Writing",
    duration_min: 14,
    is_completed: false,
  },
  {
    _id: "l6",
    title: "Advanced Algebra",
    content_type: "video",
    difficulty_level: "advanced",
    sequence_no: 4,
    course_title: "Mathematics Fundamentals",
    duration_min: 20,
    is_completed: false,
  },
];

// ─── Lesson List ──────────────────────────────────────────────────────────────
const LessonList = () => {
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");

  const filtered = DEMO_LESSONS.filter((l) => {
    if (difficulty && l.difficulty_level !== difficulty) return false;
    if (type && l.content_type !== type) return false;
    return true;
  });

  const completed = DEMO_LESSONS.filter((l) => l.is_completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Lessons</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {completed} of {DEMO_LESSONS.length} lessons completed
          </p>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="h-2 w-32 rounded-full bg-zinc-100">
            <div
              className="h-2 rounded-full bg-zinc-900 transition-all"
              style={{ width: `${(completed / DEMO_LESSONS.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-zinc-700">
            {Math.round((completed / DEMO_LESSONS.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        >
          <option value="">All Types</option>
          <option value="video">Video</option>
          <option value="text">Text</option>
          <option value="interactive">Interactive</option>
        </select>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((lesson) => (
          <LessonCard key={lesson._id} lesson={lesson} />
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center">
            <BiBookOpen className="h-10 w-10 text-zinc-300" />
            <p className="mt-3 text-sm text-zinc-500">No lessons match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonList;
