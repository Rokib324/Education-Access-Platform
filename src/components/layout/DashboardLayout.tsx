"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { UserRole } from "@/types/auth";

interface SessionUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  profile_photo?: string;
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/auth/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-indigo-600" />
          <p className="text-sm text-zinc-500">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex max-w-7xl">
        <Sidebar role={user.role} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar 
            role={user.role} 
            userName={user.full_name} 
            profilePhoto={user.profile_photo}
          />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
