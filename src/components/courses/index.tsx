"use client";

import Link from "next/link";
import { BiBook, BiDownload, BiStar, BiTime } from "react-icons/bi";

export type Course = {
  _id: string;
  title: string;
  description?: string;
  subject?: string;
  grade?: string;
  is_vocational?: boolean;
  thumbnail?: string;
  lessonCount?: number;
};

// ─── Course Card ──────────────────────────────────────────────────────────────
type CourseCardProps = {
  course: Course;
};

export const CourseCard = ({ course }: CourseCardProps) => (
  <div className="group flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
    {/* Thumbnail */}
    <div className="flex h-36 items-center justify-center rounded-t-xl bg-zinc-100">
      <BiBook className="h-12 w-12 text-zinc-300" />
    </div>

    <div className="flex flex-1 flex-col gap-2 p-4">
      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        {course.grade && (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
            {course.grade}
          </span>
        )}
        {course.subject && (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
            {course.subject}
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
          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors"
        >
          View Course
        </Link>
      </div>
    </div>
  </div>
);

// ─── Course List ──────────────────────────────────────────────────────────────
type FilterState = {
  search: string;
  grade: string;
  subject: string;
  vocational: boolean;
};

const DEMO_COURSES: Course[] = [
  {
    _id: "1",
    title: "Mathematics Fundamentals",
    description: "Build strong number sense, algebra, and geometry skills.",
    subject: "Mathematics",
    grade: "Grade 5",
    is_vocational: false,
    lessonCount: 12,
  },
  {
    _id: "2",
    title: "English Reading & Writing",
    description: "Develop reading comprehension and expressive writing.",
    subject: "English",
    grade: "Grade 4",
    is_vocational: false,
    lessonCount: 10,
  },
  {
    _id: "3",
    title: "Basic Electronics & Repair",
    description: "Hands-on technical skills for electronic device repair.",
    subject: "Vocational",
    grade: "Grade 8",
    is_vocational: true,
    lessonCount: 8,
  },
  {
    _id: "4",
    title: "Entrepreneurship Basics",
    description: "Learn how to start, run, and grow a small business.",
    subject: "Business",
    grade: "Grade 9",
    is_vocational: true,
    lessonCount: 6,
  },
  {
    _id: "5",
    title: "Science — Our Environment",
    description: "Explore ecosystems, climate, and environmental care.",
    subject: "Science",
    grade: "Grade 6",
    is_vocational: false,
    lessonCount: 9,
  },
  {
    _id: "6",
    title: "Agricultural Skills",
    description: "Practical farming, irrigation, and soil management.",
    subject: "Agriculture",
    grade: "Grade 7",
    is_vocational: true,
    lessonCount: 7,
  },
];

const CourseList = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    grade: "",
    subject: "",
    vocational: false,
  });

  const grades = [...new Set(DEMO_COURSES.map((c) => c.grade!).filter(Boolean))];
  const subjects = [...new Set(DEMO_COURSES.map((c) => c.subject!).filter(Boolean))];

  const filtered = DEMO_COURSES.filter((c) => {
    if (
      filters.search &&
      !c.title.toLowerCase().includes(filters.search.toLowerCase())
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
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <BiStar className="h-4 w-4 text-amber-400" />
          {filtered.length} courses available
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search courses…"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 w-48"
        />
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
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center">
          <BiBook className="h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-500">No courses match your filters.</p>
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

import { useState } from "react";
export default CourseList;
