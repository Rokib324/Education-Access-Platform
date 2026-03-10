"use client";

import { useState, useEffect, useCallback } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  BiTag, BiPlus, BiTrash, BiRefresh, BiLock, BiLoader, BiX, BiCheckCircle,
} from "react-icons/bi";

type Subject = { _id: string; subject_name: string };

function SubjectFormModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (s: Subject) => void;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject_name: name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      onSaved(data.subject);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h2 className="text-base font-bold text-zinc-900">Add Subject</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100">
            <BiX className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Subject Name *</label>
            <input
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mathematics"
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-60">
              {saving ? <BiLoader className="h-4 w-4 animate-spin" /> : <BiCheckCircle className="h-4 w-4" />}
              {saving ? "Saving…" : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ManageSubjectsPage() {
  const { isTeacherOrAdmin, loading: roleLoading } = useCurrentUser();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      setSubjects(data.subjects ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subject?")) return;
    setDeletingId(id);
    // No delete API yet — show placeholder
    alert("Delete not yet implemented for subjects.");
    setDeletingId(null);
  };

  if (roleLoading) return (
    <div className="flex justify-center py-24 text-zinc-400"><BiRefresh className="h-8 w-8 animate-spin" /></div>
  );

  if (!isTeacherOrAdmin) return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-24 text-center">
      <BiLock className="h-10 w-10 text-zinc-300 mb-4" />
      <h3 className="font-semibold text-zinc-800">Access Restricted</h3>
      <p className="mt-1 text-sm text-zinc-500">Only teachers and admins can manage subjects.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-zinc-900">
            <BiTag className="h-6 w-6 text-zinc-600" /> Manage Subjects
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Add subjects that courses can be categorised under.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchSubjects} className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50">
            <BiRefresh className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-700 shadow-sm">
            <BiPlus className="h-4 w-4" /> Add Subject
          </button>
        </div>
      </div>

      {/* Count */}
      <div className="flex gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-3 shadow-sm">
          <span className="text-2xl font-bold text-zinc-900">{subjects.length}</span>
          <span className="text-xs text-zinc-500">Total Subjects</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-400">
          <BiRefresh className="h-10 w-10 animate-spin mb-3" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 text-center">
          {error} <button onClick={fetchSubjects} className="underline font-semibold">Retry</button>
        </div>
      ) : subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-20 text-center">
          <BiTag className="h-10 w-10 text-zinc-300 mb-4" />
          <h3 className="font-semibold text-zinc-800">No subjects yet</h3>
          <p className="mt-1 text-sm text-zinc-500">Add the first subject for your courses.</p>
          <button onClick={() => setShowModal(true)} className="mt-6 flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700">
            <BiPlus className="h-4 w-4" /> Add First Subject
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div key={subject._id} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100">
                  <BiTag className="h-4 w-4 text-zinc-500" />
                </div>
                <span className="text-sm font-semibold text-zinc-900">{subject.subject_name}</span>
              </div>
              <button onClick={() => handleDelete(subject._id)} disabled={deletingId === subject._id}
                className="rounded-lg border border-red-200 p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40">
                {deletingId === subject._id ? <BiLoader className="h-3.5 w-3.5 animate-spin" /> : <BiTrash className="h-3.5 w-3.5" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <SubjectFormModal
          onClose={() => setShowModal(false)}
          onSaved={(s) => { setSubjects((prev) => [...prev, s]); setShowModal(false); }}
        />
      )}
    </div>
  );
}
