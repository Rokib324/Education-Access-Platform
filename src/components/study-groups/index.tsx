"use client";

import { useState, useEffect } from "react";
import {
  BiBook,
  BiGroup,
  BiPlus,
  BiUserPlus,
} from "react-icons/bi";

export type StudyGroup = {
  _id: string;
  group_name: string;
  course_title: string;
  member_count: number;
  created_by: string;
  is_member: boolean;
};

// ─── Study Group Card ─────────────────────────────────────────────────────────
export const StudyGroupCard = ({ group, onJoin }: { group: StudyGroup, onJoin?: (id: string) => void }) => (
  <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between gap-2">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-100">
        <BiGroup className="h-5 w-5 text-zinc-600" />
      </div>
      {group.is_member && (
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
          Joined
        </span>
      )}
    </div>

    <div>
      <h3 className="text-sm font-semibold text-zinc-900">{group.group_name}</h3>
      <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
        <BiBook className="h-3.5 w-3.5" />
        <span>{group.course_title}</span>
      </div>
    </div>

    <div className="flex items-center justify-between text-xs text-zinc-500">
      <span className="flex items-center gap-1">
        <BiGroup className="h-3.5 w-3.5" />
        {group.member_count} members
      </span>
      <span>By {group.created_by}</span>
    </div>

    <button
      onClick={group.is_member ? undefined : () => onJoin && onJoin(group._id)}
      className={`flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors ${
        group.is_member
          ? "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          : "bg-zinc-900 text-white hover:bg-zinc-700"
      }`}
    >
      {group.is_member ? (
        <a href={`/dashboard/study-groups/${group._id}`} className="w-full text-center">View Group</a>
      ) : (
        <>
          <BiUserPlus className="h-4 w-4" />
          Join Group
        </>
      )}
    </button>
  </div>
);

// ─── Study Group List ─────────────────────────────────────────────────────────
const StudyGroupList = () => {
  const [tab, setTab] = useState<"all" | "joined">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [courses, setCourses] = useState<{ _id: string, title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Form State
  const [createData, setCreateData] = useState({ group_name: "", course_id: "" });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchGroups = async () => {
    try {
      const res = await fetch("/api/study-group");
      if (res.ok) {
        const data = await res.json();
        const mapped: StudyGroup[] = data.groups.map((g: any) => ({
          _id: g._id,
          group_name: g.group_name,
          course_title: g.course_id.title,
          member_count: g.member_count,
          created_by: g.created_by.full_name,
          is_member: g.is_member
        }));
        setGroups(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    
    // Fetch courses for the create dropdown
    fetch("/api/courses?published=true")
      .then(res => res.json())
      .then(data => setCourses(data.courses || []))
      .catch(console.error);
  }, []);

  const handleJoin = async (id: string) => {
    try {
      const res = await fetch(`/api/study-group/${id}/join`, { method: "POST" });
      if (res.ok) {
        // Optimistically update UI
        setGroups(prev => prev.map(g => 
          g._id === id ? { ...g, is_member: true, member_count: g.member_count + 1 } : g
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");

    try {
      const res = await fetch("/api/study-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create group");

      // Reset form and refresh list
      setCreateData({ group_name: "", course_id: "" });
      setShowCreate(false);
      fetchGroups();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsCreating(false);
    }
  };

  const filtered = tab === "joined"
    ? groups.filter((g) => g.is_member)
    : groups;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Study Groups</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Collaborate with peers in course-based groups
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
        >
          <BiPlus className="h-4 w-4" />
          Create Group
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-zinc-200 bg-white p-1 w-fit shadow-sm">
        {(["all", "joined"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            {t === "joined" ? "My Groups" : "All Groups"}
          </button>
        ))}
      </div>

      {/* Create Group Banner */}
      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-zinc-900">New Study Group</h2>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <input
            required
            value={createData.group_name}
            onChange={e => setCreateData({ ...createData, group_name: e.target.value })}
            placeholder="Group name…"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
          <select 
            required
            value={createData.course_id}
            onChange={e => setCreateData({ ...createData, course_id: e.target.value })}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          >
            <option value="" disabled>Select a course…</option>
            {courses.map(c => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button 
              type="submit"
              disabled={isCreating}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16">
          <BiGroup className="h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-500">You haven't joined any groups yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((group) => (
            <StudyGroupCard key={group._id} group={group} onJoin={handleJoin} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyGroupList;
