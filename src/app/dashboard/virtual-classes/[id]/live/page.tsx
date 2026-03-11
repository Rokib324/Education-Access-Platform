"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LiveChat from "@/components/virtual-classes/LiveChat";
import { BiDesktop, BiArrowBack, BiLoaderAlt, BiVideoOff } from "react-icons/bi";

export default function LiveRoomPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string, role: string } | null>(null);
  const [virtualClass, setVirtualClass] = useState<any>(null);

  useEffect(() => {
    // Fetch current user and class details
    Promise.all([
      fetch("/api/auth/me").then(res => res.json()),
      fetch(`/api/virtual-classes/${id}`).then(res => res.json())
    ])
    .then(([userData, classData]) => {
      if (userData.user) setUser(userData.user);
      if (classData.virtualClass) setVirtualClass(classData.virtualClass);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const handleStatusChange = async (action: 'start' | 'end') => {
    try {
      const method = action === 'start' ? 'POST' : 'PATCH';
      const res = await fetch(`/api/virtual-classes/${id}/sessions`, { method });
      if (res.ok) {
        // Refresh class
        const classRes = await fetch(`/api/virtual-classes/${id}`);
        const classData = await classRes.json();
        setVirtualClass(classData.virtualClass);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <BiLoaderAlt className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!virtualClass) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-zinc-950 text-white text-center p-6">
        <BiVideoOff className="w-16 h-16 text-zinc-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">Class Not Found</h2>
        <p className="text-zinc-400 mb-6">The virtual class you are looking for does not exist or has been removed.</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition">Go Back</button>
      </div>
    );
  }

  const isTeacher = user?.role === "teacher" || user?.role === "admin";
  const isLive = virtualClass.status === "live";

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Header */}
      <header className="flex-none h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"
          >
            <BiArrowBack className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-800 rounded-lg">
              <BiDesktop className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h1 className="font-bold text-sm md:text-base hidden sm:block">{virtualClass.class_title}</h1>
              <span className="text-xs text-zinc-500">{virtualClass.course_id?.title}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : virtualClass.status === 'scheduled' ? 'bg-blue-500' : 'bg-zinc-500'}`} />
            <span className="text-sm font-medium uppercase tracking-wider text-zinc-400 text-xs">
              {virtualClass.status}
            </span>
          </div>

          {isTeacher && (
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-zinc-800">
              {virtualClass.status === "scheduled" && (
                <button 
                  onClick={() => handleStatusChange('start')}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition"
                >
                  Start Session
                </button>
              )}
              {isLive && (
                <button 
                  onClick={() => handleStatusChange('end')}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition"
                >
                  End Session
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 bg-black relative flex flex-col justify-center items-center p-4">
          {isLive ? (
            <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-12 text-center aspect-video shadow-2xl">
                <BiDesktop className="w-20 h-20 text-blue-500 mb-6" />
                <h2 className="text-2xl font-bold mb-3">Live Class is in Progress</h2>
                <p className="text-zinc-400 mb-8 max-w-md">The instructor is hosting this session on an external platform.</p>
                <a 
                  href={virtualClass.meeting_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/20"
                >
                  Open Meeting Link
                </a>
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-zinc-500 mb-2 font-medium">Class Status: <span className="uppercase text-zinc-400">{virtualClass.status}</span></p>
              <h2 className="text-xl font-bold text-zinc-300">
                {virtualClass.status === "scheduled" ? "Waiting for the instructor to start the session..." : "This class session has ended."}
              </h2>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="w-full lg:w-80 h-1/2 lg:h-full flex-none">
          <LiveChat classId={id} currentUserId={user?.id} />
        </div>
      </div>
    </div>
  );
}
