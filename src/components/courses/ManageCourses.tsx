"use client";

import { useState, useEffect, useCallback } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  BiBook,
  BiPlus,
  BiTrash,
  BiEdit,
  BiRefresh,
  BiCheckCircle,
  BiX,
  BiLoader,
  BiLock,
} from "react-icons/bi";

// ─── Types ────────────────────────────────────────────────────────────────────
type Subject = { _id: string; subject_name: string };
type Grade = { _id: string; grade_name: string };
type Course = {
  _id: string;
  title: string;
  description?: string;
  is_vocational: boolean;
  subject_id?: Subject;
  grade_id?: Grade;
};

type FormState = {
  title: string;
  description: string;
  subject_id: string;
  grade_id: string;
  is_vocational: boolean;
};

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  subject_id: "",
  grade_id: "",
  is_vocational: false,
};

// ─── Course Form Modal ────────────────────────────────────────────────────────
function CourseFormModal({
  subjects,
  grades,
  editCourse,
  onClose,
  onSaved,
}: {
  subjects: Subject[];
  grades: Grade[];
  editCourse: Course | null;
  onClose: () => void;
  onSaved: (course: Course) => void;
}) {
  const [form, setForm] = useState<FormState>(
    editCourse
      ? {
          title: editCourse.title,
          description: editCourse.description ?? "",
          subject_id: editCourse.subject_id?._id ?? "",
          grade_id: editCourse.grade_id?._id ?? "",
          is_vocational: editCourse.is_vocational,
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = editCourse ? `/api/courses/${editCourse._id}` : "/api/courses";
      const method = editCourse ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.error === "string" ? data.error : JSON.stringify(data.error);
        throw new Error(msg);
      }
      onSaved(data.course);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h2 className="text-base font-bold text-zinc-900">
            {editCourse ? "Edit Course" : "Create New Course"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700">
            <BiX className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Mathematics Fundamentals"
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the course…"
              className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Subject *</label>
              <select
                required
                value={form.subject_id}
                onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-800"
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.subject_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Grade *</label>
              <select
                required
                value={form.grade_id}
                onChange={(e) => setForm({ ...form, grade_id: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-800"
              >
                <option value="">Select grade</option>
                {grades.map((g) => (
                  <option key={g._id} value={g._id}>{g.grade_name}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-zinc-200 px-4 py-3 hover:bg-zinc-50">
            <input
              type="checkbox"
              checked={form.is_vocational}
              onChange={(e) => setForm({ ...form, is_vocational: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
            />
            <span className="text-sm text-zinc-700 font-medium">Vocational course</span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-60">
              {saving ? <BiLoader className="h-4 w-4 animate-spin" /> : <BiCheckCircle className="h-4 w-4" />}
              {saving ? "Saving…" : editCourse ? "Update" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Course Row ───────────────────────────────────────────────────────────────
function CourseRow({
  course,
  onEdit,
  onDelete,
  deleting,
}: {
  course: Course;
  onEdit: (c: Course) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
        <BiBook className="h-5 w-5 text-zinc-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-zinc-900 truncate">{course.title}</h3>
          {course.is_vocational && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              Vocational
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-zinc-500">
          {course.subject_id?.subject_name ?? "—"}
          {course.grade_id?.grade_name ? ` · ${course.grade_id.grade_name}` : ""}
        </p>
        {course.description && (
          <p className="mt-0.5 text-xs text-zinc-400 line-clamp-1">{course.description}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <a href={`/dashboard/courses/${course._id}`}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          Manage Lessons
        </a>
        <button onClick={() => onEdit(course)}
          className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-colors">
          <BiEdit className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(course._id)}
          disabled={deleting}
          className="rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
        >
          {deleting ? <BiLoader className="h-4 w-4 animate-spin" /> : <BiTrash className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ManageCourses() {
  const { isTeacherOrAdmin, loading: roleLoading } = useCurrentUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cRes, sRes, gRes] = await Promise.all([
        fetch("/api/courses"),
        fetch("/api/subjects"),
        fetch("/api/grade-levels"),
      ]);
      const [cData, sData, gData] = await Promise.all([cRes.json(), sRes.json(), gRes.json()]);
      setCourses(cData.courses ?? []);
      setSubjects(sData.subjects ?? []);
      setGrades(gData.gradeLevels ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/courses/${id}`, { method: "DELETE" });
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = (course: Course) => {
    setCourses((prev) => {
      const idx = prev.findIndex((c) => c._id === course._id);
      if (idx >= 0) { const updated = [...prev]; updated[idx] = course; return updated; }
      return [course, ...prev];
    });
    setShowModal(false);
    setEditCourse(null);
  };

  if (roleLoading) return (
    <div className="flex items-center justify-center py-24 text-zinc-400">
      <BiRefresh className="h-8 w-8 animate-spin" />
    </div>
  );

  // ── Access guard ──────────────────────────────────────────────────────────
  if (!isTeacherOrAdmin) return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 mb-4">
        <BiLock className="h-8 w-8 text-zinc-400" />
      </div>
      <h3 className="text-base font-semibold text-zinc-800">Access Restricted</h3>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">
        Only teachers and admins can manage courses. Browse available courses from the Courses page.
      </p>
      <a href="/dashboard/courses"
        className="mt-6 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700">
        Go to Courses
      </a>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Manage Courses</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Create courses and add lessons to them so students can learn.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchAll}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">
            <BiRefresh className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => { setEditCourse(null); setShowModal(true); }}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors shadow-sm"
          >
            <BiPlus className="h-4 w-4" />
            New Course
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: "Total Courses", value: courses.length },
          { label: "Vocational", value: courses.filter((c) => c.is_vocational).length },
          { label: "Subjects", value: new Set(courses.map((c) => c.subject_id?._id).filter(Boolean)).size },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-3 shadow-sm">
            <span className="text-2xl font-bold text-zinc-900">{value}</span>
            <span className="text-xs text-zinc-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
          <BiRefresh className="h-10 w-10 animate-spin mb-3" />
          <p className="text-sm">Loading courses…</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 text-center">
          {error} <button onClick={fetchAll} className="underline font-semibold">Retry</button>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 mb-4">
            <BiBook className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-base font-semibold text-zinc-800">No courses yet</h3>
          <p className="mt-1 text-sm text-zinc-500">Click "New Course" to get started.</p>
          <button
            onClick={() => { setEditCourse(null); setShowModal(true); }}
            className="mt-6 flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            <BiPlus className="h-4 w-4" /> Create First Course
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <CourseRow
              key={course._id}
              course={course}
              onEdit={(c) => { setEditCourse(c); setShowModal(true); }}
              onDelete={handleDelete}
              deleting={deletingId === course._id}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CourseFormModal
          subjects={subjects}
          grades={grades}
          editCourse={editCourse}
          onClose={() => { setShowModal(false); setEditCourse(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
