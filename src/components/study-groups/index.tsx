"use client";

import { useState } from "react";
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
export const StudyGroupCard = ({ group }: { group: StudyGroup }) => (
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
      className={`flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors ${
        group.is_member
          ? "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          : "bg-zinc-900 text-white hover:bg-zinc-700"
      }`}
    >
      {group.is_member ? (
        "View Group"
      ) : (
        <>
          <BiUserPlus className="h-4 w-4" />
          Join Group
        </>
      )}
    </button>
  </div>
);

// ─── Demo data ────────────────────────────────────────────────────────────────
const DEMO_GROUPS: StudyGroup[] = [
  {
    _id: "sg1",
    group_name: "Math Champions",
    course_title: "Mathematics Fundamentals",
    member_count: 12,
    created_by: "Ms. Fatima",
    is_member: true,
  },
  {
    _id: "sg2",
    group_name: "English Readers Club",
    course_title: "English Reading & Writing",
    member_count: 8,
    created_by: "Mr. Karim",
    is_member: false,
  },
  {
    _id: "sg3",
    group_name: "Future Entrepreneurs",
    course_title: "Entrepreneurship Basics",
    member_count: 15,
    created_by: "Dr. Amina",
    is_member: true,
  },
  {
    _id: "sg4",
    group_name: "Science Explorers",
    course_title: "Science — Our Environment",
    member_count: 6,
    created_by: "Mr. Hasan",
    is_member: false,
  },
  {
    _id: "sg5",
    group_name: "Farm Innovators",
    course_title: "Agricultural Skills",
    member_count: 10,
    created_by: "Ms. Ranu",
    is_member: false,
  },
];

// ─── Study Group List ─────────────────────────────────────────────────────────
const StudyGroupList = () => {
  const [tab, setTab] = useState<"all" | "joined">("all");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = tab === "joined"
    ? DEMO_GROUPS.filter((g) => g.is_member)
    : DEMO_GROUPS;

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
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-zinc-900">New Study Group</h2>
          <input
            placeholder="Group name…"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
          <select className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300">
            <option value="">Select a course…</option>
            <option>Mathematics Fundamentals</option>
            <option>English Reading & Writing</option>
            <option>Entrepreneurship Basics</option>
          </select>
          <div className="flex gap-2">
            <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700">
              Create
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16">
          <BiGroup className="h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-500">You haven't joined any groups yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((group) => (
            <StudyGroupCard key={group._id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyGroupList;
