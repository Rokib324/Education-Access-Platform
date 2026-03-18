"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";
import {
  BiBook,
  BiBookOpen,
  BiPlay,
  BiPlus,
  BiTrash,
  BiEdit,
  BiRefresh,
  BiX,
  BiCheckCircle,
  BiLoader,
  BiArrowBack,
  BiSortAlt2,
  BiUser,
  BiCheck,
} from "react-icons/bi";
import OfflineButton from "@/components/lessons/OfflineButton";
import EnrolledStudentsList from "@/components/courses/EnrolledStudentsList";

// ─── Types ────────────────────────────────────────────────────────────────────
type Course = {
  _id: string;
  title: string;
  description?: string;
  is_vocational: boolean;
  subject_id?: { subject_name: string };
  grade_id?: { grade_name: string };
  created_by?: { full_name: string; email: string };
};

type Lesson = {
  _id: string;
  title: string;
  content_type: "video" | "pdf" | "text" | "audio" | "interactive";
  difficulty_level: "easy" | "medium" | "hard";
  sequence_no: number;
};

type LessonFormState = {
  title: string;
  content_type: "video" | "pdf" | "text" | "audio" | "interactive";
  difficulty_level: "easy" | "medium" | "hard";
  sequence_no: number;
};

type LessonProgressMap = Record<string, number>; // lessonId → completion_percentage

const EMPTY_LESSON_FORM: LessonFormState = {
  title: "",
  content_type: "text",
  difficulty_level: "easy",
  sequence_no: 1,
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  video: <BiPlay className="h-4 w-4" />,
  pdf: <BiBookOpen className="h-4 w-4" />,
  text: <BiBook className="h-4 w-4" />,
  audio: <BiSortAlt2 className="h-4 w-4" />,
  interactive: <BiSortAlt2 className="h-4 w-4" />,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

// ─── Lesson Form Modal ────────────────────────────────────────────────────────
function LessonFormModal({
  courseId,
  editLesson,
  nextSeqNo,
  onClose,
  onSaved,
}: {
  courseId: string;
  editLesson: Lesson | null;
  nextSeqNo: number;
  onClose: () => void;
  onSaved: (lesson: Lesson) => void;
}) {
  const [form, setForm] = useState<LessonFormState>(
    editLesson
      ? {
          title: editLesson.title,
          content_type: editLesson.content_type,
          difficulty_level: editLesson.difficulty_level,
          sequence_no: editLesson.sequence_no,
        }
      : { ...EMPTY_LESSON_FORM, sequence_no: nextSeqNo }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = editLesson ? `/api/lessons/${editLesson._id}` : "/api/lessons";
      const method = editLesson ? "PUT" : "POST";
      const body = editLesson ? form : { ...form, course_id: courseId };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.error === "string" ? data.error : JSON.stringify(data.error);
        throw new Error(msg);
      }
      onSaved(data.lesson);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h2 className="text-base font-bold text-zinc-900">
            {editLesson ? "Edit Lesson" : "Add New Lesson"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700">
            <BiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Lesson Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Introduction to Fractions"
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Content Type</label>
              <select
                value={form.content_type}
                onChange={(e) => setForm({ ...form, content_type: e.target.value as LessonFormState["content_type"] })}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-800"
              >
                <option value="text">Text</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="audio">Audio</option>
                <option value="interactive">Interactive</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Difficulty</label>
              <select
                value={form.difficulty_level}
                onChange={(e) => setForm({ ...form, difficulty_level: e.target.value as LessonFormState["difficulty_level"] })}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-800"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Sequence No.</label>
            <input
              type="number"
              min={1}
              value={form.sequence_no}
              onChange={(e) => setForm({ ...form, sequence_no: Number(e.target.value) })}
              className="w-32 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-60">
              {saving ? <BiLoader className="h-4 w-4 animate-spin" /> : <BiCheckCircle className="h-4 w-4" />}
              {saving ? "Saving…" : editLesson ? "Update" : "Add Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Lesson Row ───────────────────────────────────────────────────────────────
function LessonRow({
  lesson,
  onEdit,
  onDelete,
  deleting,
  isTeacherOrAdmin,
  isEnrolled,
  enrollmentId,
  progress,
  onProgressUpdate,
}: {
  lesson: Lesson;
  onEdit: (l: Lesson) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
  isTeacherOrAdmin: boolean;
  isEnrolled: boolean;
  enrollmentId: string | null;
  progress: number;
  onProgressUpdate: (lessonId: string, pct: number) => void;
}) {
  const [marking, setMarking] = useState(false);
  const isDone = progress >= 100;

  const markComplete = async () => {
    if (!enrollmentId || isDone) return;
    setMarking(true);
    try {
      const res = await fetch(`/api/enrollments/${enrollmentId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson._id, completion_percentage: 100 }),
      });
      if (res.ok) onProgressUpdate(lesson._id, 100);
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className={`flex items-center gap-4 rounded-xl border px-5 py-3.5 shadow-sm transition-all ${
      isDone ? "border-emerald-200 bg-emerald-50/40" : "border-zinc-200 bg-white hover:shadow-md"
    }`}>
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-bold ${
        isDone ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"
      }`}>
        {isDone ? <BiCheck className="h-5 w-5" /> : lesson.sequence_no}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 capitalize">
            {TYPE_ICONS[lesson.content_type]}
            {lesson.content_type}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${DIFFICULTY_COLORS[lesson.difficulty_level]}`}>
            {lesson.difficulty_level}
          </span>
          {isDone && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              Completed
            </span>
          )}
        </div>
        <h3 className={`mt-1 text-sm font-semibold leading-snug truncate ${isDone ? "text-emerald-800 line-through decoration-emerald-400" : "text-zinc-900"}`}>
          {lesson.title}
        </h3>
        {/* Progress bar for partial completion */}
        {progress > 0 && progress < 100 && (
          <div className="mt-1.5 h-1 w-full rounded-full bg-zinc-200">
            <div
              className="h-1 rounded-full bg-indigo-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <OfflineButton lessonId={lesson._id} lessonTitle={lesson.title} size="sm" />

        {/* Mark Complete — students only, when enrolled */}
        {!isTeacherOrAdmin && isEnrolled && (
          <button
            onClick={markComplete}
            disabled={marking || isDone}
            title={isDone ? "Completed!" : "Mark as Complete"}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              isDone
                ? "cursor-default bg-emerald-100 text-emerald-700"
                : "border border-indigo-200 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
            }`}
          >
            {marking ? <BiLoader className="h-3.5 w-3.5 animate-spin" /> : isDone ? "Done ✓" : "Mark Done"}
          </button>
        )}

        {isTeacherOrAdmin && (
          <>
            <button onClick={() => onEdit(lesson)}
              className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-colors">
              <BiEdit className="h-4 w-4" />
            </button>
            <button onClick={() => onDelete(lesson._id)} disabled={deleting}
              className="rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40">
              {deleting ? <BiLoader className="h-4 w-4 animate-spin" /> : <BiTrash className="h-4 w-4" />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Enrollment Button for students in course header ─────────────────────────
function CourseEnrollButton({ courseId }: { courseId: string }) {
  const [enrollment, setEnrollment] = useState<{ _id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/enrollments?courseId=${courseId}`)
      .then((r) => r.json())
      .then((d) => setEnrollment(d.enrollment ?? null))
      .catch(() => setEnrollment(null))
      .finally(() => setLoading(false));
  }, [courseId]);

  const enroll = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (res.ok) setEnrollment(data.enrollment);
    } finally {
      setBusy(false);
    }
  };

  const drop = async () => {
    if (!enrollment || !confirm("Drop this course?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/enrollments/${enrollment._id}`, { method: "DELETE" });
      if (res.ok) setEnrollment(null);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <span className="h-9 w-24 animate-pulse rounded-xl bg-zinc-100 block" />;

  return enrollment ? (
    <button
      onClick={drop}
      disabled={busy}
      className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
    >
      <BiCheckCircle className="h-4 w-4" />
      {busy ? "…" : "Enrolled — Drop"}
    </button>
  ) : (
    <button
      onClick={enroll}
      disabled={busy}
      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
    >
      {busy ? <BiLoader className="h-4 w-4 animate-spin" /> : <BiBookOpen className="h-4 w-4" />}
      {busy ? "Enrolling…" : "Enroll Now"}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type Tab = "lessons" | "students";

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId ?? "";

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("lessons");
  const [lessonProgress, setLessonProgress] = useState<LessonProgressMap>({});
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const { user, isTeacherOrAdmin } = useCurrentUser();
  const isStudent = user?.role === "student";

  const fetchData = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const [cRes, lRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/lessons?courseId=${courseId}`),
      ]);
      const [cData, lData] = await Promise.all([cRes.json(), lRes.json()]);
      if (!cRes.ok) throw new Error(cData.error ?? "Course not found.");
      setCourse(cData.course);
      setLessons((lData.lessons ?? []).sort((a: Lesson, b: Lesson) => a.sequence_no - b.sequence_no));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  // Fetch student's enrollment status + lesson progress
  useEffect(() => {
    if (!isStudent || !courseId) return;
    // enrollment status
    fetch(`/api/enrollments?courseId=${courseId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.enrollment) {
          setIsEnrolled(true);
          setEnrollmentId(d.enrollment._id);
        }
      })
      .catch(() => {});
    // lesson progress
    fetch("/api/enrollments")
      .then((r) => r.json())
      .then((d) => {
        const enrollment = (d.enrollments ?? []).find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (e: any) => e.course_id?._id === courseId
        );
        if (!enrollment) return;
        // Build progress map from the enrollment's progress data via lesson list
        // We'll also do a dedicated lesson progress fetch via the lessons endpoint
      })
      .catch(() => {});
  }, [isStudent, courseId]);

  // Fetch lesson-level progress for students
  useEffect(() => {
    if (!isStudent || !courseId || !enrollmentId) return;
    fetch(`/api/lessons/progress?courseId=${courseId}`)
      .then((r) => r.json())
      .then((d) => {
        const map: LessonProgressMap = {};
        for (const p of d.progress ?? []) {
          map[p.lesson_id] = p.completion_percentage;
        }
        setLessonProgress(map);
      })
      .catch(() => {});
  }, [isStudent, courseId, enrollmentId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDeleteLesson = async (id: string) => {
    if (!confirm("Delete this lesson?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/lessons/${id}`, { method: "DELETE" });
      setLessons((prev) => prev.filter((l) => l._id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const handleLessonSaved = (lesson: Lesson) => {
    setLessons((prev) => {
      const idx = prev.findIndex((l) => l._id === lesson._id);
      if (idx >= 0) { const updated = [...prev]; updated[idx] = lesson; return updated; }
      return [...prev, lesson].sort((a, b) => a.sequence_no - b.sequence_no);
    });
    setShowModal(false);
    setEditLesson(null);
  };

  const handleProgressUpdate = (lessonId: string, pct: number) => {
    setLessonProgress((prev) => ({ ...prev, [lessonId]: pct }));
    if (pct >= 100) {
      const completedNow = Object.values({ ...lessonProgress, [lessonId]: pct }).filter((v) => v >= 100).length;
      if (completedNow === lessons.length) setIsEnrolled(true); // stay enrolled (completed)
    }
  };

  // Compute overall progress for the header pill
  const completedCount = lessons.filter((l) => (lessonProgress[l._id] ?? 0) >= 100).length;
  const overallPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
      <BiRefresh className="h-10 w-10 animate-spin mb-3" />
      <p className="text-sm">Loading course…</p>
    </div>
  );

  if (error) return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 text-center">
      {error} <button onClick={fetchData} className="underline font-semibold ml-2">Retry</button>
    </div>
  );

  if (!course) return null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/dashboard/courses" className="flex items-center gap-1 hover:text-zinc-800 transition-colors">
          <BiArrowBack className="h-4 w-4" /> Courses
        </Link>
        <span>/</span>
        <span className="text-zinc-800 font-medium truncate">{course.title}</span>
      </div>

      {/* Course Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {course.subject_id && (
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                  {course.subject_id.subject_name}
                </span>
              )}
              {course.grade_id && (
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                  {course.grade_id.grade_name}
                </span>
              )}
              {course.is_vocational && (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  Vocational
                </span>
              )}
              {/* Student progress badge */}
              {isStudent && isEnrolled && lessons.length > 0 && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  overallPct >= 100
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-indigo-100 text-indigo-700"
                }`}>
                  {overallPct >= 100 ? "✓ Completed" : `${overallPct}% done`}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-zinc-900">{course.title}</h1>
            {course.description && (
              <p className="mt-1.5 text-sm text-zinc-500">{course.description}</p>
            )}
            {course.created_by && (
              <p className="mt-2 text-xs text-zinc-400">
                By <span className="font-medium text-zinc-600">{course.created_by.full_name}</span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700">
              {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
            </span>
            {/* Enroll button for students */}
            {isStudent && <CourseEnrollButton courseId={courseId} />}
            {/* Add Lesson button for teachers */}
            {isTeacherOrAdmin && (
              <button
                onClick={() => { setEditLesson(null); setShowModal(true); }}
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
              >
                <BiPlus className="h-4 w-4" /> Add Lesson
              </button>
            )}
          </div>
        </div>

        {/* Student progress bar */}
        {isStudent && isEnrolled && lessons.length > 0 && (
          <div className="mt-4 pt-4 border-t border-zinc-100">
            <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
              <span>Your progress</span>
              <span>{completedCount}/{lessons.length} lessons completed</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-200">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  overallPct >= 100 ? "bg-emerald-500" : "bg-indigo-500"
                }`}
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabs — teachers/admins get a Students tab */}
      {isTeacherOrAdmin && (
        <div className="flex gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 w-fit">
          {(["lessons", "students"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                activeTab === tab ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {tab === "lessons" ? <BiBook className="h-4 w-4" /> : <BiUser className="h-4 w-4" />}
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "students" && isTeacherOrAdmin ? (
        <EnrolledStudentsList courseId={courseId} />
      ) : (
        <div className="space-y-3">
          {lessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 mb-4">
                <BiBookOpen className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-base font-semibold text-zinc-800">No lessons yet</h3>
              <p className="mt-1 text-sm text-zinc-500">Add the first lesson to this course.</p>
              {isTeacherOrAdmin && (
                <button
                  onClick={() => { setEditLesson(null); setShowModal(true); }}
                  className="mt-6 flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700"
                >
                  <BiPlus className="h-4 w-4" /> Add First Lesson
                </button>
              )}
            </div>
          ) : (
            lessons.map((lesson) => (
              <LessonRow
                key={lesson._id}
                lesson={lesson}
                onEdit={(l) => { setEditLesson(l); setShowModal(true); }}
                onDelete={handleDeleteLesson}
                deleting={deletingId === lesson._id}
                isTeacherOrAdmin={isTeacherOrAdmin}
                isEnrolled={isEnrolled}
                enrollmentId={enrollmentId}
                progress={lessonProgress[lesson._id] ?? 0}
                onProgressUpdate={handleProgressUpdate}
              />
            ))
          )}
        </div>
      )}

      {/* Lesson Modal */}
      {showModal && (
        <LessonFormModal
          courseId={courseId}
          editLesson={editLesson}
          nextSeqNo={lessons.length + 1}
          onClose={() => { setShowModal(false); setEditLesson(null); }}
          onSaved={handleLessonSaved}
        />
      )}
    </div>
  );
}