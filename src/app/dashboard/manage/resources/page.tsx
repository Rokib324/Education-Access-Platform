"use client";

import ResourceList from "@/components/resources";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { BiLock, BiRefresh } from "react-icons/bi";

export default function ManageResourcesPage() {
  const { isTeacherOrAdmin, loading } = useCurrentUser();

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-zinc-400">
        <BiRefresh className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isTeacherOrAdmin) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-24 text-center">
        <BiLock className="h-10 w-10 text-zinc-300 mb-4" />
        <h3 className="font-semibold text-zinc-800">Access Restricted</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Only teachers and admins can manage resources.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ResourceList />
    </div>
  );
}
