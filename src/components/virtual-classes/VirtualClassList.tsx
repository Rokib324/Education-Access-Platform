"use client";

import { useState, useEffect } from "react";
import { BiCalendar, BiDesktop, BiTime, BiUser, BiVideo, BiPlus } from "react-icons/bi";
import VirtualClassForm from "./VirtualClassForm";

export type VirtualClass = {
  _id: string;
  class_title: string;
  teacher_id: { full_name: string; _id: string };
  course_id: { title: string; _id: string };
  scheduled_start: string;
  scheduled_end: string;
  meeting_link: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
};

const STATUS_STYLES: Record<string, string> = {
  live: "bg-red-100 text-red-700",
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-zinc-100 text-zinc-500",
  cancelled: "bg-orange-100 text-orange-700",
};

export const VirtualClassCard = ({ cls, role }: { cls: VirtualClass; role: string }) => {
  const isTeacher = role === "teacher" || role === "admin";
  const start = new Date(cls.scheduled_start);
  const end = new Date(cls.scheduled_end);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-[#0A0A0A] p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-800">
          <BiDesktop className="h-5 w-5 text-zinc-300" />
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
            STATUS_STYLES[cls.status] || "bg-zinc-800 text-zinc-300"
          }`}
        >
          {cls.status === "live" ? "● LIVE" : cls.status}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">{cls.class_title}</h3>
        {cls.course_id?.title && (
          <p className="mt-0.5 text-xs text-zinc-400">{cls.course_id.title}</p>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <BiUser className="h-3.5 w-3.5 shrink-0" />
          <span>{cls.teacher_id?.full_name || "Unknown Teacher"}</span>
        </div>
        <div className="flex items-center gap-2">
          <BiCalendar className="h-3.5 w-3.5 shrink-0" />
          <span>{start.toLocaleDateString()} · {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <BiTime className="h-3.5 w-3.5 shrink-0" />
          <span>Ends: {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {cls.status === "completed" || cls.status === "cancelled" ? (
        <button
          disabled
          className="w-full rounded-lg border border-zinc-800 py-2 text-sm text-zinc-500 cursor-not-allowed"
        >
          Class {cls.status === "completed" ? "Ended" : "Cancelled"}
        </button>
      ) : (
        <a
          href={isTeacher ? `/dashboard/virtual-classes/${cls._id}/live` : (cls.status === "live" ? `/dashboard/virtual-classes/${cls._id}/live` : "#")}
          target={cls.status === "live" ? "_self" : undefined}
          className={`flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold text-white transition-colors ${
            cls.status === "live"
              ? "bg-red-600 hover:bg-red-700"
              : isTeacher ? "bg-blue-600 hover:bg-blue-700" : "bg-zinc-800 hover:bg-zinc-700 cursor-not-allowed"
          }`}
        >
          <BiVideo className="h-4 w-4" />
          {cls.status === "live" ? "Join Live Room" : (isTeacher ? "Manage Session" : "Join When Open")}
        </a>
      )}
    </div>
  );
};

const VirtualClassList = ({ role }: { role: string }) => {
  const [tab, setTab] = useState<"all" | "live" | "scheduled" | "completed">("all");
  const [classes, setClasses] = useState<VirtualClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/virtual-classes");
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filtered = classes.filter((c) =>
    tab === "all" ? true : c.status === tab
  );

  const liveCount = classes.filter((c) => c.status === "live").length;

  return (
    <div className="space-y-6 text-white min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Virtual Classes</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Join live and upcoming classroom sessions
          </p>
        </div>
        <div className="flex items-center gap-3">
          {liveCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-900/40 border border-red-500/20 px-3 py-1 text-xs font-bold text-red-500">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              {liveCount} live now
            </span>
          )}
          {(role === "teacher" || role === "admin") && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              <BiPlus className="w-4 h-4" />
              Schedule Class
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-zinc-800 bg-zinc-900/50 p-1 w-fit shadow-sm">
        {(["all", "live", "scheduled", "completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin text-zinc-500 border-2 border-r-transparent border-zinc-500 rounded-full w-8 h-8"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-16 bg-zinc-900/30">
          <BiDesktop className="h-10 w-10 text-zinc-600" />
          <p className="mt-3 text-sm text-zinc-500">No classes in this category.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cls) => (
            <VirtualClassCard key={cls._id} cls={cls} role={role} />
          ))}
        </div>
      )}

      {showForm && (
        <VirtualClassForm onClose={() => setShowForm(false)} onRefresh={fetchClasses} />
      )}
    </div>
  );
};

export default VirtualClassList;
