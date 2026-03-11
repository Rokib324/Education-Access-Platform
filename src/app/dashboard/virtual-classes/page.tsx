"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiDesktop, BiLoaderAlt } from "react-icons/bi";

export default function VirtualClassesPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user?.role === "teacher" || data.user?.role === "admin") {
          router.replace("/dashboard/teacher/virtual-classes");
        } else {
          router.replace("/dashboard/student/virtual-classes");
        }
      })
      .catch((err) => {
        console.error(err);
        router.replace("/dashboard/student/virtual-classes"); // fallback
      });
  }, [router]);

  return (
    <div className="flex flex-col h-[60vh] items-center justify-center p-6 text-center animate-pulse">
      <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 shadow-xl mb-6">
        <BiDesktop className="w-16 h-16 text-blue-500/80 mb-4 mx-auto" />
        <h2 className="text-xl font-bold text-white mb-2">Preparing Your Classroom</h2>
        <p className="text-zinc-400 text-sm max-w-xs mx-auto mb-6">Connecting you to the right virtual environment based on your role...</p>
        <BiLoaderAlt className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
      </div>
    </div>
  );
}