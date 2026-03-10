"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BiBookOpen,
  BiCheckCircle,
  BiPlay,
  BiSortAlt2,
  BiRefresh,
} from "react-icons/bi";
import OfflineButton from "@/components/lessons/OfflineButton";

export type Lesson = {
  _id: string;
  title: string;
  content_type: "video" | "pdf" | "text" | "audio" | "interactive";
  difficulty_level: "easy" | "medium" | "hard";
  sequence_no: number;
  course_title?: string;
  duration_min?: number;
  is_completed?: boolean;
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  video: <BiPlay className="h-4 w-4" />,
  pdf: <BiBookOpen className="h-4 w-4" />,
  text: <BiBookOpen className="h-4 w-4" />,
  audio: <BiSortAlt2 className="h-4 w-4" />,
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
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${DIFFICULTY_COLORS[lesson.difficulty_level]}`}
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
      {/* Dynamic offline button */}
      <OfflineButton lessonId={lesson._id} lessonTitle={lesson.title} size="sm" />
      <button className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors">
        Start
      </button>
    </div>
  </div>
);

// ─── Lesson List ──────────────────────────────────────────────────────────────
type Props = {
  courseId?: string; // if provided, load lessons for that course; otherwise use query param
};

const LessonList = ({ courseId }: Props) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Derive courseId from prop or from the URL query string
      let cId = courseId;
      if (!cId && typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        cId = params.get("courseId") ?? undefined;
      }
      if (!cId) {
        setLessons([]);
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/lessons?courseId=${cId}`);
      if (!res.ok) throw new Error("Failed to load lessons.");
      const data = await res.json();
      setLessons(data.lessons ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { fetchLessons(); }, [fetchLessons]);

  const filtered = lessons.filter((l) => {
    if (difficulty && l.difficulty_level !== difficulty) return false;
    if (type && l.content_type !== type) return false;
    return true;
  });

  const completed = lessons.filter((l) => l.is_completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Lessons</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {loading
              ? "Loading…"
              : `${completed} of ${lessons.length} lessons completed`}
          </p>
        </div>
        {/* Progress bar */}
        {lessons.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="h-2 w-32 rounded-full bg-zinc-100">
              <div
                className="h-2 rounded-full bg-emerald-600 transition-all"
                style={{ width: `${lessons.length ? (completed / lessons.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-zinc-700">
              {lessons.length ? Math.round((completed / lessons.length) * 100) : 0}%
            </span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        >
          <option value="">All Levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        >
          <option value="">All Types</option>
          <option value="video">Video</option>
          <option value="pdf">PDF</option>
          <option value="text">Text</option>
          <option value="audio">Audio</option>
          <option value="interactive">Interactive</option>
        </select>
        <button
          onClick={fetchLessons}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
          <BiRefresh className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <BiRefresh className="h-8 w-8 animate-spin mb-3" />
          <p className="text-sm">Loading lessons…</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          {error}{" "}
          <button onClick={fetchLessons} className="underline font-semibold">
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} />
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center">
              <BiBookOpen className="h-10 w-10 text-zinc-300" />
              <p className="mt-3 text-sm text-zinc-500">
                {lessons.length === 0
                  ? "No lessons found for this course."
                  : "No lessons match your filters."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonList;
