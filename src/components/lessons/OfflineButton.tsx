"use client";

import { useState, useEffect, useCallback } from "react";
import { BiDownload, BiCheck, BiLoader } from "react-icons/bi";

type Props = {
  lessonId: string;
  lessonTitle?: string;
  size?: "sm" | "md";
};

type Status = "idle" | "checking" | "downloading" | "downloaded" | "error";

export default function OfflineButton({ lessonId, lessonTitle, size = "sm" }: Props) {
  const [status, setStatus] = useState<Status>("checking");

  const check = useCallback(async () => {
    try {
      setStatus("checking");
      const res = await fetch(`/api/offline-downloads/check?lesson_id=${lessonId}`);
      if (!res.ok) { setStatus("idle"); return; }
      const data = await res.json();
      setStatus(data.downloaded ? "downloaded" : "idle");
    } catch {
      setStatus("idle");
    }
  }, [lessonId]);

  useEffect(() => { check(); }, [check]);

  const handleDownload = async () => {
    if (status === "downloaded" || status === "downloading" || status === "checking") return;
    try {
      setStatus("downloading");
      const res = await fetch("/api/offline-downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: lessonId }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("downloaded");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  const isSmall = size === "sm";

  if (status === "checking") {
    return (
      <div className={`flex items-center gap-1 text-zinc-400 ${isSmall ? "text-xs" : "text-sm"}`}>
        <BiLoader className={`animate-spin ${isSmall ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
        {!isSmall && <span>Checking…</span>}
      </div>
    );
  }

  if (status === "downloaded") {
    return (
      <div
        className={`flex items-center gap-1 font-medium text-emerald-600 ${isSmall ? "text-xs" : "text-sm"}`}
        title={`${lessonTitle ?? "Lesson"} is saved for offline`}
      >
        <BiCheck className={isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {isSmall ? "Saved" : "Downloaded"}
      </div>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={status === "downloading"}
      title={`Download "${lessonTitle ?? "lesson"}" for offline`}
      className={`flex items-center gap-1.5 rounded-lg font-semibold transition-all
        ${isSmall
          ? "px-2.5 py-1 text-xs"
          : "px-3 py-1.5 text-sm"}
        ${status === "error"
          ? "bg-red-100 text-red-600 border border-red-200"
          : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"}
        disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {status === "downloading" ? (
        <BiLoader className={`animate-spin ${isSmall ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
      ) : (
        <BiDownload className={isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} />
      )}
      {status === "error" ? "Failed" : status === "downloading" ? "Saving…" : "Download"}
    </button>
  );
}
