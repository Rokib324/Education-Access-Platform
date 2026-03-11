"use client";

import { useEffect, useState, use } from "react";
import { BiBook, BiGroup, BiArrowBack, BiUser } from "react-icons/bi";
import Link from "next/link";

export default function StudyGroupRoom({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = use(params);
  const [data, setData] = useState<{ group: any, members: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/study-group/${groupId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load group details.");
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [groupId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin text-zinc-500 border-2 border-r-transparent border-zinc-500 rounded-full w-8 h-8"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <p className="text-zinc-400 mb-4">{error || "Group not found."}</p>
        <Link href="/dashboard/study-groups" className="text-blue-500 hover:underline">
          Return to Study Groups
        </Link>
      </div>
    );
  }

  const { group, members } = data;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <Link href="/dashboard/study-groups" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-4">
          <BiArrowBack /> Back to all groups
        </Link>
        <div className="flex items-start justify-between gap-4 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
             <BiGroup className="w-48 h-48 rotate-12" />
           </div>
           <div>
             <h1 className="text-2xl font-bold text-white mb-2">{group.group_name}</h1>
             <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
               <span className="flex items-center gap-1.5 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700">
                 <BiBook className="text-blue-400" /> {group.course_id?.title}
               </span>
               <span className="flex items-center gap-1.5">
                 <BiGroup /> {members.length} members
               </span>
             </div>
           </div>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Members</h2>
        {members.length === 0 ? (
          <p className="text-zinc-500">No members found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <div key={m._id} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                  <BiUser className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {m.user_id?.full_name || "Unknown User"}
                  </h3>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">
                    {m.user_id?.email || "No email"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}