"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BiBook, BiRefresh, BiSearch, BiStar } from "react-icons/bi";

export type Course = {
  _id: string;
  title: string;
  description?: string;
  subject?: string;      // from subject_id.subject_name (populated)
  grade?: string;        // from grade_id.grade_name (populated)
  is_vocational?: boolean;
  thumbnail?: string;
  lessonCount?: number;
  subject_id?: { subject_name: string };
  grade_id?: { grade_name: string };
};

// ─── Course Card ──────────────────────────────────────────────────────────────
type CourseCardProps = {
  course: Course;
};

export const CourseCard = ({ course }: CourseCardProps) => {
  const subjectName = course.subject ?? course.subject_id?.subject_name;
  const gradeName = course.grade ?? course.grade_id?.grade_name;

  return (
    <div className="group flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Thumbnail */}
      <div className="flex h-36 items-center justify-center rounded-t-xl bg-gradient-to-br from-zinc-100 to-zinc-200">
        <BiBook className="h-12 w-12 text-zinc-300" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {gradeName && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
              {gradeName}
            </span>
          )}
          {subjectName && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
              {subjectName}
            </span>
          )}
          {course.is_vocational && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
              Vocational
            </span>
          )}
        </div>

        <h3 className="text-sm font-semibold text-zinc-900 leading-snug">
          {course.title}
        </h3>

        {course.description && (
          <p className="text-xs text-zinc-500 line-clamp-2">
            {course.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-100">
          {course.lessonCount !== undefined && (
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <BiBook className="h-3.5 w-3.5" />
              {course.lessonCount} lessons
            </span>
          )}
          <Link
            href={`/dashboard/courses/${course._id}`}
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors ml-auto"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Course List ──────────────────────────────────────────────────────────────
type FilterState = {
  search: string;
  grade: string;
  subject: string;
  vocational: boolean;
};

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    grade: "",
    subject: "",
    vocational: false,
  });

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/courses");
      if (!res.ok) throw new Error("Failed to load courses.");
      const data = await res.json();
      // Normalize populated fields to flat strings for easier filtering
      const normalized: Course[] = (data.courses ?? []).map((c: Course) => ({
        ...c,
        subject: c.subject ?? c.subject_id?.subject_name,
        grade: c.grade ?? c.grade_id?.grade_name,
      }));
      setCourses(normalized);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const grades = [...new Set(courses.map((c) => c.grade!).filter(Boolean))];
  const subjects = [...new Set(courses.map((c) => c.subject!).filter(Boolean))];

  const filtered = courses.filter((c) => {
    if (
      filters.search &&
      !c.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !(c.description ?? "").toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    if (filters.grade && c.grade !== filters.grade) return false;
    if (filters.subject && c.subject !== filters.subject) return false;
    if (filters.vocational && !c.is_vocational) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Courses</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Browse and enroll in available courses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <BiStar className="h-4 w-4 text-amber-400" />
            {loading ? "…" : `${filtered.length} courses available`}
          </div>
          <button
            onClick={fetchCourses}
            className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            <BiRefresh className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search courses…"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="rounded-lg border border-zinc-200 py-2 pl-9 pr-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 w-48"
          />
        </div>
        <select
          value={filters.grade}
          onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        >
          <option value="">All Grades</option>
          {grades.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={filters.vocational}
            onChange={(e) =>
              setFilters({ ...filters, vocational: e.target.checked })
            }
            className="rounded border-zinc-300"
          />
          Vocational only
        </label>
        {(filters.search || filters.grade || filters.subject || filters.vocational) && (
          <button
            onClick={() =>
              setFilters({ search: "", grade: "", subject: "", vocational: false })
            }
            className="text-xs text-zinc-400 hover:text-zinc-700 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
          <BiRefresh className="h-10 w-10 animate-spin mb-3" />
          <p className="text-sm">Loading courses…</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          {error}{" "}
          <button onClick={fetchCourses} className="underline font-semibold">
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center">
          <BiBook className="h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-500">
            {courses.length === 0
              ? "No courses found. Ask your teacher to add courses."
              : "No courses match your filters."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
