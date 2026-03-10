"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BiDownload,
  BiTrash,
  BiSearch,
  BiWifi,
  BiBookOpen,
  BiTime,
  BiRefresh,
  BiFilter,
  BiCheck,
} from "react-icons/bi";
import { HiOutlineCloudArrowDown } from "react-icons/hi2";

// ─── Types ────────────────────────────────────────────────────────────────────

type PopulatedLesson = {
  _id: string;
  title: string;
  content_type: "video" | "pdf" | "text" | "audio" | "interactive";
  difficulty_level: "easy" | "medium" | "hard";
  course_id?: {
    _id: string;
    title: string;
    subject_id?: { subject_name: string };
    grade_id?: { grade_name: string };
  };
};

type DownloadRecord = {
  _id: string;
  lesson_id: PopulatedLesson;
  downloaded_at: string;
  last_accessed_at: string;
  sync_status: "synced" | "pending" | "failed";
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CONTENT_COLORS: Record<string, string> = {
  video: "bg-purple-100 text-purple-700",
  pdf: "bg-red-100 text-red-700",
  text: "bg-blue-100 text-blue-700",
  audio: "bg-orange-100 text-orange-700",
  interactive: "bg-emerald-100 text-emerald-700",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-emerald-600",
  medium: "text-amber-600",
  hard: "text-red-600",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-4">
        <HiOutlineCloudArrowDown className="h-10 w-10 text-emerald-500" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-800">No offline lessons yet</h3>
      <p className="mt-1 max-w-xs text-sm text-zinc-500">
        Browse your courses and click the{" "}
        <span className="font-medium text-emerald-600">Download</span> button on any lesson to save
        it for offline access.
      </p>
      <a
        href="/dashboard/courses"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
      >
        <BiBookOpen className="h-4 w-4" />
        Browse Courses
      </a>
    </div>
  );
}

// ─── Download Card ────────────────────────────────────────────────────────────

type CardProps = {
  record: DownloadRecord;
  onRemove: (id: string) => void;
  removing: boolean;
};

function DownloadCard({ record, onRemove, removing }: CardProps) {
  const lesson = record.lesson_id;
  const course = lesson?.course_id;

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
      {/* Sync badge */}
      <span
        className={`absolute right-4 top-4 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold
          ${record.sync_status === "synced"
            ? "bg-emerald-100 text-emerald-700"
            : record.sync_status === "pending"
              ? "bg-amber-100 text-amber-700"
              : "bg-red-100 text-red-700"}`}
      >
        {record.sync_status === "synced" && <BiCheck className="h-3 w-3" />}
        {record.sync_status}
      </span>

      {/* Content type + difficulty */}
      <div className="flex flex-wrap gap-1.5">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${CONTENT_COLORS[lesson?.content_type] ?? "bg-zinc-100 text-zinc-600"}`}
        >
          {lesson?.content_type ?? "—"}
        </span>
        {lesson?.difficulty_level && (
          <span
            className={`text-[11px] font-medium capitalize ${DIFFICULTY_COLORS[lesson.difficulty_level]}`}
          >
            {lesson.difficulty_level}
          </span>
        )}
      </div>

      {/* Lesson title */}
      <h3 className="pr-14 text-sm font-semibold leading-snug text-zinc-900">
        {lesson?.title ?? "Unknown Lesson"}
      </h3>

      {/* Course info */}
      {course && (
        <p className="text-xs text-zinc-500 leading-relaxed">
          <span className="font-medium text-zinc-700">{course.title}</span>
          {course.subject_id && ` · ${course.subject_id.subject_name}`}
          {course.grade_id && ` · ${course.grade_id.grade_name}`}
        </p>
      )}

      {/* Times */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-400 mt-auto pt-3 border-t border-zinc-100">
        <span className="flex items-center gap-1">
          <BiDownload className="h-3.5 w-3.5" />
          Downloaded {timeAgo(record.downloaded_at)}
        </span>
        <span className="flex items-center gap-1">
          <BiTime className="h-3.5 w-3.5" />
          Accessed {timeAgo(record.last_accessed_at)}
        </span>
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(record._id)}
        disabled={removing}
        className="absolute bottom-4 right-4 flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
      >
        {removing ? (
          <BiRefresh className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <BiTrash className="h-3.5 w-3.5" />
        )}
        Remove
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OfflineDownloads() {
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [contentFilter, setContentFilter] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchDownloads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/offline-downloads");
      if (!res.ok) throw new Error("Failed to load downloads.");
      const data = await res.json();
      setDownloads(data.downloads ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDownloads(); }, [fetchDownloads]);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      const res = await fetch(`/api/offline-downloads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Remove failed.");
      setDownloads((prev) => prev.filter((d) => d._id !== id));
    } catch {
      // silently fail — keep the record shown
    } finally {
      setRemovingId(null);
    }
  };

  const filtered = downloads.filter((d) => {
    const lesson = d.lesson_id;
    if (
      search &&
      !lesson?.title?.toLowerCase().includes(search.toLowerCase()) &&
      !lesson?.course_id?.title?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (contentFilter && lesson?.content_type !== contentFilter) return false;
    return true;
  });

  const contentTypes = [...new Set(downloads.map((d) => d.lesson_id?.content_type).filter(Boolean))];

  // Stats
  const total = downloads.length;
  const videoCount = downloads.filter((d) => d.lesson_id?.content_type === "video").length;
  const pdfCount = downloads.filter((d) => d.lesson_id?.content_type === "pdf").length;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-zinc-900">
            <HiOutlineCloudArrowDown className="h-7 w-7 text-emerald-600" />
            Offline Downloads
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Access your saved lessons anytime, even without an internet connection.
          </p>
        </div>
        <button
          onClick={fetchDownloads}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors"
        >
          <BiRefresh className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Downloads", value: total, icon: BiDownload, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Videos", value: videoCount, icon: BiWifi, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "PDFs", value: pdfCount, icon: BiBookOpen, color: "text-red-600", bg: "bg-red-50" },
          {
            label: "Storage Est.",
            value: `~${(total * 12).toFixed(0)} MB`,
            icon: HiOutlineCloudArrowDown,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-900">{value}</p>
              <p className="text-[11px] text-zinc-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[180px]">
          <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search lessons or courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 py-2 pl-9 pr-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <BiFilter className="h-4 w-4 text-zinc-400" />
          <select
            value={contentFilter}
            onChange={(e) => setContentFilter(e.target.value)}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <option value="">All Types</option>
            {contentTypes.map((ct) => (
              <option key={ct} value={ct} className="capitalize">
                {ct}
              </option>
            ))}
          </select>
        </div>
        {(search || contentFilter) && (
          <button
            onClick={() => { setSearch(""); setContentFilter(""); }}
            className="text-xs text-zinc-400 hover:text-zinc-700 underline"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-xs text-zinc-400">
          {filtered.length} of {total} downloads
        </span>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
          <BiRefresh className="h-10 w-10 animate-spin mb-3" />
          <p className="text-sm">Loading your downloads…</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          {error}
          <button
            onClick={fetchDownloads}
            className="ml-3 underline font-semibold hover:opacity-80"
          >
            Try again
          </button>
        </div>
      ) : downloads.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center">
          <BiSearch className="h-8 w-8 text-zinc-300 mb-3" />
          <p className="text-sm text-zinc-500">No downloads match your search.</p>
          <button
            onClick={() => { setSearch(""); setContentFilter(""); }}
            className="mt-3 text-xs text-emerald-600 hover:underline font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((record) => (
            <DownloadCard
              key={record._id}
              record={record}
              onRemove={handleRemove}
              removing={removingId === record._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
