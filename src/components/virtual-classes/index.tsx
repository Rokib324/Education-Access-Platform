"use client";

import { useState } from "react";
import {
  BiCalendar,
  BiDesktop,
  BiMessageDetail,
  BiTime,
  BiUser,
  BiVideo,
} from "react-icons/bi";

export type VirtualClass = {
  _id: string;
  class_title: string;
  teacher_name: string;
  course_title?: string;
  scheduled_start: string;
  scheduled_end: string;
  meeting_link: string;
  status: "live" | "upcoming" | "past";
};

const STATUS_STYLES: Record<string, string> = {
  live: "bg-red-100 text-red-700",
  upcoming: "bg-blue-100 text-blue-700",
  past: "bg-zinc-100 text-zinc-500",
};

// ─── Virtual Class Card ───────────────────────────────────────────────────────
export const VirtualClassCard = ({ cls }: { cls: VirtualClass }) => (
  <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
    {/* Top row */}
    <div className="flex items-start justify-between gap-2">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-100">
        <BiDesktop className="h-5 w-5 text-zinc-600" />
      </div>
      <span
        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
          STATUS_STYLES[cls.status]
        }`}
      >
        {cls.status === "live" ? "● LIVE" : cls.status}
      </span>
    </div>

    <div>
      <h3 className="text-sm font-semibold text-zinc-900">{cls.class_title}</h3>
      {cls.course_title && (
        <p className="mt-0.5 text-xs text-zinc-500">{cls.course_title}</p>
      )}
    </div>

    {/* Meta */}
    <div className="space-y-1.5 text-xs text-zinc-500">
      <div className="flex items-center gap-2">
        <BiUser className="h-3.5 w-3.5 shrink-0" />
        <span>{cls.teacher_name}</span>
      </div>
      <div className="flex items-center gap-2">
        <BiCalendar className="h-3.5 w-3.5 shrink-0" />
        <span>{cls.scheduled_start}</span>
      </div>
      <div className="flex items-center gap-2">
        <BiTime className="h-3.5 w-3.5 shrink-0" />
        <span>Ends: {cls.scheduled_end}</span>
      </div>
    </div>

    {/* Action */}
    {cls.status === "past" ? (
      <button
        disabled
        className="w-full rounded-lg border border-zinc-200 py-2 text-sm text-zinc-400 cursor-not-allowed"
      >
        Class Ended
      </button>
    ) : (
      <a
        href={cls.meeting_link}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold text-white transition-colors ${
          cls.status === "live"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-zinc-900 hover:bg-zinc-700"
        }`}
      >
        <BiVideo className="h-4 w-4" />
        {cls.status === "live" ? "Join Now" : "Join When Open"}
      </a>
    )}
  </div>
);

// ─── Demo data ────────────────────────────────────────────────────────────────
const DEMO_CLASSES: VirtualClass[] = [
  {
    _id: "vc1",
    class_title: "Math Live Session — Fractions",
    teacher_name: "Ms. Fatima",
    course_title: "Mathematics Fundamentals",
    scheduled_start: "Mar 4, 2026 · 5:00 PM",
    scheduled_end: "6:00 PM",
    meeting_link: "#",
    status: "live",
  },
  {
    _id: "vc2",
    class_title: "English Reading Circle",
    teacher_name: "Mr. Karim",
    course_title: "English Reading & Writing",
    scheduled_start: "Mar 5, 2026 · 4:00 PM",
    scheduled_end: "5:00 PM",
    meeting_link: "#",
    status: "upcoming",
  },
  {
    _id: "vc3",
    class_title: "Entrepreneurship Q&A",
    teacher_name: "Dr. Amina",
    course_title: "Entrepreneurship Basics",
    scheduled_start: "Mar 6, 2026 · 3:00 PM",
    scheduled_end: "4:00 PM",
    meeting_link: "#",
    status: "upcoming",
  },
  {
    _id: "vc4",
    class_title: "Science: Ecosystems",
    teacher_name: "Mr. Hasan",
    course_title: "Science — Our Environment",
    scheduled_start: "Mar 2, 2026 · 2:00 PM",
    scheduled_end: "3:00 PM",
    meeting_link: "#",
    status: "past",
  },
];

// ─── Virtual Class List ───────────────────────────────────────────────────────
const VirtualClassList = () => {
  const [tab, setTab] = useState<"all" | "live" | "upcoming" | "past">("all");

  const filtered = DEMO_CLASSES.filter((c) =>
    tab === "all" ? true : c.status === tab
  );

  const liveCount = DEMO_CLASSES.filter((c) => c.status === "live").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Virtual Classes</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Join live and upcoming classroom sessions
          </p>
        </div>
        {liveCount > 0 && (
          <span className="flex animate-pulse items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {liveCount} live now
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-zinc-200 bg-white p-1 w-fit shadow-sm">
        {(["all", "live", "upcoming", "past"] as const).map((t) => (
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
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16">
          <BiDesktop className="h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-500">No classes in this category.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cls) => (
            <VirtualClassCard key={cls._id} cls={cls} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VirtualClassList;
