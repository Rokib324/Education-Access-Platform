"use client";

import { useState, useEffect } from "react";
import {
  BiChat,
  BiChevronRight,
  BiPlus,
} from "react-icons/bi";
import Link from "next/link";

export type ForumType = {
  _id: string;
  title: string;
  description?: string;
  post_count: number;
  created_by: string;
};

// ─── Forum Card ───────────────────────────────────────────────────────────────
export const ForumCard = ({ forum }: { forum: ForumType }) => (
  <Link
    href={`/dashboard/forum/${forum._id}`}
    className="w-full text-left flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all"
  >
    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-zinc-100">
      <BiChat className="h-6 w-6 text-zinc-600" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-semibold text-zinc-900">{forum.title}</h3>
      {forum.description && (
        <p className="mt-0.5 text-xs text-zinc-500 line-clamp-1">
          {forum.description}
        </p>
      )}
      <span className="mt-1 inline-block text-xs text-zinc-400">
        {forum.post_count} posts · By {forum.created_by}
      </span>
    </div>
    <BiChevronRight className="h-5 w-5 shrink-0 text-zinc-400" />
  </Link>
);

// ─── Forum List ───────────────────────────────────────────────────────────────
const ForumList = () => {
  const [forums, setForums] = useState<ForumType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Form State
  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({ title: "", description: "" });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchForums = async () => {
    try {
      const res = await fetch("/api/forums");
      if (res.ok) {
        const data = await res.json();
        setForums(data.forums || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForums();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");

    try {
      const res = await fetch("/api/forums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create forum");

      // Reset form and refresh list
      setCreateData({ title: "", description: "" });
      setShowCreate(false);
      fetchForums();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Forums</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Discuss, ask questions, and support each other
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
        >
          <BiPlus className="h-4 w-4" />
          Create Forum
        </button>
      </div>

       {/* Create Forum Form */}
       {showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-zinc-900">New Forum Page</h2>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <input
            required
            value={createData.title}
            onChange={e => setCreateData({ ...createData, title: e.target.value })}
            placeholder="Forum title…"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
          <textarea
            value={createData.description}
            onChange={e => setCreateData({ ...createData, description: e.target.value })}
            placeholder="Short description (optional)…"
            rows={2}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 resize-none"
          />
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

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
        </div>
      ) : forums.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16">
          <BiChat className="h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-500">No forums created yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {forums.map((forum) => (
            <ForumCard
              key={forum._id}
              forum={forum}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumList;
