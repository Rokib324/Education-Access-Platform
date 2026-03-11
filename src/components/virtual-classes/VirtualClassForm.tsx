"use client";

import { useState, useEffect } from "react";
import { BiX, BiVideo } from "react-icons/bi";

export default function VirtualClassForm({ onClose, onRefresh }: { onClose: () => void, onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<{ _id: string, title: string }[]>([]);
  const [formData, setFormData] = useState({
    course_id: "",
    class_title: "",
    scheduled_start: "",
    scheduled_end: "",
    meeting_link: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/courses?published=true")
      .then(res => res.json())
      .then(data => setCourses(data.courses || []))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/virtual-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to schedule class");

      onRefresh();
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BiVideo className="text-blue-500" /> Schedule Class
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition">
            <BiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="p-3 bg-red-900/40 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Course</label>
            <select
              required
              value={formData.course_id}
              onChange={e => setFormData({ ...formData, course_id: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition appearance-none"
            >
              <option value="" disabled>Select a course</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Class Title</label>
            <input
              type="text"
              required
              placeholder="E.g. Math Q&A Session"
              value={formData.class_title}
              onChange={e => setFormData({ ...formData, class_title: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Start Time</label>
              <input
                type="datetime-local"
                required
                value={formData.scheduled_start}
                onChange={e => setFormData({ ...formData, scheduled_start: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">End Time</label>
              <input
                type="datetime-local"
                required
                value={formData.scheduled_end}
                onChange={e => setFormData({ ...formData, scheduled_end: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Meeting Link</label>
            <input
              type="url"
              required
              placeholder="https://zoom.us/j/..."
              value={formData.meeting_link}
              onChange={e => setFormData({ ...formData, meeting_link: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Scheduling..." : "Schedule Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
