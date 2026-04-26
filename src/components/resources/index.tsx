"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  BiDownload,
  BiFile,
  BiGlobe,
  BiLink,
  BiLock,
  BiPlus,
  BiTag,
  BiVideo,
  BiTrash,
  BiMusic,
  BiImage,
  BiSearch,
  BiX,
  BiUpload,
  BiCheck,
  BiErrorCircle,
  BiFilter,
  BiBook,
  BiPlay,
  BiCloudUpload,
} from "react-icons/bi";

// ─── Types ─────────────────────────────────────────────────────────────────────
export type ResourceType = "pdf" | "video" | "link" | "document" | "audio" | "image";
export type Visibility = "public" | "private" | "course-only";

export type Resource = {
  _id: string;
  title: string;
  description?: string;
  resource_type: ResourceType;
  visibility: Visibility;
  created_by: string;
  tags: string[];
  file_url: string;
  createdAt?: string;
};

type UploadStatus = "idle" | "uploading" | "uploaded" | "error";

// ─── Config ────────────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<ResourceType, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  accept: string;
  isLink: boolean;
  maxMB: number;
}> = {
  pdf: {
    label: "PDF",
    icon: <BiFile className="w-5 h-5" />,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    accept: "application/pdf",
    isLink: false,
    maxMB: 100,
  },
  video: {
    label: "Video",
    icon: <BiVideo className="w-5 h-5" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    accept: "video/mp4,video/webm,video/ogg,video/quicktime",
    isLink: false,
    maxMB: 100,
  },
  audio: {
    label: "Audio",
    icon: <BiMusic className="w-5 h-5" />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    accept: "audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/aac,audio/flac",
    isLink: false,
    maxMB: 50,
  },
  image: {
    label: "Image",
    icon: <BiImage className="w-5 h-5" />,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    accept: "image/jpeg,image/png,image/gif,image/webp,image/avif",
    isLink: false,
    maxMB: 20,
  },
  document: {
    label: "Document",
    icon: <BiBook className="w-5 h-5" />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accept: ".doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv",
    isLink: false,
    maxMB: 50,
  },
  link: {
    label: "Link",
    icon: <BiLink className="w-5 h-5" />,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    accept: "",
    isLink: true,
    maxMB: 0,
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── File Preview ──────────────────────────────────────────────────────────────
const FilePreview = ({ file, type }: { file: File; type: ResourceType }) => {
  const [objectUrl, setObjectUrl] = useState<string>("");
  useEffect(() => {
    if (type === "image" || type === "video" || type === "audio") {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, type]);

  if (type === "image" && objectUrl) {
    return (
      <div className="mt-3 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 h-40 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={objectUrl} alt="preview" className="h-full w-full object-contain" />
      </div>
    );
  }
  if (type === "video" && objectUrl) {
    return (
      <div className="mt-3 rounded-xl overflow-hidden border border-zinc-200 bg-black h-40">
        <video src={objectUrl} controls className="w-full h-full object-contain" />
      </div>
    );
  }
  if (type === "audio" && objectUrl) {
    return (
      <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
        <audio src={objectUrl} controls className="w-full" />
      </div>
    );
  }
  return (
    <div className="mt-3 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${TYPE_CONFIG[type].bg}`}>
        <span className={TYPE_CONFIG[type].color}>{TYPE_CONFIG[type].icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-800 truncate max-w-xs">{file.name}</p>
        <p className="text-xs text-zinc-400">{formatBytes(file.size)}</p>
      </div>
    </div>
  );
};

// ─── Resource Card ─────────────────────────────────────────────────────────────
export const ResourceCard = ({
  resource,
  userRole,
  onDelete,
}: {
  resource: Resource;
  userRole: string | null;
  onDelete: (id: string) => void;
}) => {
  const cfg = TYPE_CONFIG[resource.resource_type] ?? TYPE_CONFIG.document;
  const isMedia = ["image", "video", "audio"].includes(resource.resource_type);
  const isOwnerOrAdmin = userRole === "teacher" || userRole === "admin";

  return (
    <div className="group flex flex-col rounded-2xl border border-zinc-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      {/* Inline media preview */}
      {resource.resource_type === "image" && resource.file_url && (
        <div className="h-40 bg-zinc-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resource.file_url}
            alt={resource.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      {resource.resource_type === "video" && resource.file_url && (
        <div className="h-40 bg-zinc-900 flex items-center justify-center relative overflow-hidden">
          <video src={resource.file_url} className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <BiPlay className="w-6 h-6 text-zinc-900 ml-0.5" />
            </div>
          </div>
        </div>
      )}
      {resource.resource_type === "audio" && resource.file_url && (
        <div className={`px-4 pt-4 pb-2 ${cfg.bg}`}>
          <audio src={resource.file_url} controls className="w-full h-8" />
        </div>
      )}

      <div className="flex flex-col gap-2.5 p-4 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${cfg.bg} ${cfg.border} border`}>
            <span className={cfg.color}>{cfg.icon}</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
              resource.visibility === "public"
                ? "bg-emerald-50 text-emerald-700"
                : resource.visibility === "course-only"
                ? "bg-blue-50 text-blue-700"
                : "bg-zinc-100 text-zinc-500"
            }`}>
              {resource.visibility === "public" ? <BiGlobe className="inline w-3 h-3 mr-0.5" /> : <BiLock className="inline w-3 h-3 mr-0.5" />}
              {resource.visibility.replace("-", " ")}
            </span>
            {isOwnerOrAdmin && (
              <button
                onClick={() => onDelete(resource._id)}
                className="p-1.5 rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                title="Delete"
              >
                <BiTrash className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title & description */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 leading-snug line-clamp-2">{resource.title}</h3>
          {resource.description && (
            <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{resource.description}</p>
          )}
        </div>

        {/* Tags */}
        {resource.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="flex items-center gap-0.5 rounded-full bg-zinc-50 border border-zinc-100 px-2 py-0.5 text-[10px] text-zinc-500">
                <BiTag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
            {resource.tags.length > 4 && (
              <span className="rounded-full bg-zinc-50 border border-zinc-100 px-2 py-0.5 text-[10px] text-zinc-400">
                +{resource.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-zinc-50 mt-auto">
          <div>
            <p className="text-[11px] text-zinc-400">{resource.created_by}</p>
            {resource.createdAt && (
              <p className="text-[10px] text-zinc-300">{timeAgo(resource.createdAt)}</p>
            )}
          </div>
          <a
            href={resource.file_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${cfg.bg} ${cfg.color} hover:opacity-80 border ${cfg.border}`}
          >
            {resource.resource_type === "link" ? (
              <><BiLink className="w-3.5 h-3.5" /> Open</>
            ) : (
              <><BiDownload className="w-3.5 h-3.5" /> Download</>
            )}
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── Upload Modal ──────────────────────────────────────────────────────────────
const UploadModal = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [step, setStep] = useState<"form" | "done">("form");
  const [resourceType, setResourceType] = useState<ResourceType>("pdf");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [tagsInput, setTagsInput] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [fileError, setFileError] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cfg = TYPE_CONFIG[resourceType];

  const resetFile = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setUploadedUrl("");
    setFileError("");
  };

  const handleTypeChange = (t: ResourceType) => {
    setResourceType(t);
    resetFile();
    setLinkUrl("");
  };

  const uploadFile = useCallback(async (file: File) => {
    setSelectedFile(file);
    setUploadStatus("uploading");
    setUploadProgress(0);
    setFileError("");

    const form = new FormData();
    form.append("file", file);
    form.append("resource_type", resourceType);

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/resources/upload");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setUploadedUrl(data.url);
          setUploadStatus("uploaded");
          resolve(data.url);
        } else {
          let msg = "Upload failed.";
          try { msg = JSON.parse(xhr.responseText).error || msg; } catch {}
          setUploadStatus("error");
          setFileError(msg);
          reject(new Error(msg));
        }
      };

      xhr.onerror = () => {
        setUploadStatus("error");
        setFileError("Network error during upload.");
        reject(new Error("Network error"));
      };

      xhr.send(form);
    });
  }, [resourceType]);

  const handleFileSelect = (file: File) => {
    const maxBytes = cfg.maxMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileError(`File too large. Max ${cfg.maxMB} MB for ${cfg.label}.`);
      return;
    }
    uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const finalUrl = cfg.isLink ? linkUrl : uploadedUrl;
    if (!finalUrl) {
      setSubmitError(cfg.isLink ? "Please enter a URL." : "Please upload a file first.");
      return;
    }
    if (!title.trim()) {
      setSubmitError("Title is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          resource_type: resourceType,
          visibility,
          file_url: finalUrl,
          tags,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save resource.");
      setStep("done");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-gradient-to-r from-zinc-50 to-white">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Upload Resource</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Share a file or link with your students</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
          >
            <BiX className="w-5 h-5" />
          </button>
        </div>

        {step === "done" ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
              <BiCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-base font-semibold text-zinc-900">Resource saved!</p>
            <p className="text-sm text-zinc-400">Redirecting…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-0 overflow-y-auto">
            <div className="px-6 py-5 space-y-5">
              {/* Resource Type Picker */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">Resource Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(TYPE_CONFIG) as ResourceType[]).map((t) => {
                    const c = TYPE_CONFIG[t];
                    const selected = resourceType === t;
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => handleTypeChange(t)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-xs font-semibold transition-all ${
                          selected
                            ? `${c.bg} ${c.border} ${c.color}`
                            : "border-zinc-100 bg-zinc-50 text-zinc-500 hover:border-zinc-200"
                        }`}
                      >
                        <span className={`text-lg ${selected ? c.color : "text-zinc-400"}`}>{c.icon}</span>
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Title <span className="text-red-400">*</span></label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 5 Lecture Notes"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-300 transition"
                />
              </div>

              {/* File / Link field (dynamic) */}
              {cfg.isLink ? (
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5">URL <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <BiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                    <input
                      type="url"
                      required
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com/resource"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 transition"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
                    File <span className="text-red-400">*</span>
                    <span className="ml-1 font-normal normal-case text-zinc-400">(max {cfg.maxMB} MB)</span>
                  </label>

                  {uploadStatus === "idle" ? (
                    <div
                      className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                        isDragging
                          ? `${cfg.border} ${cfg.bg} scale-[1.01]`
                          : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-white"
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cfg.bg} border ${cfg.border}`}>
                        <BiCloudUpload className={`w-6 h-6 ${cfg.color}`} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-zinc-700">
                          Drop your {cfg.label} here, or <span className={cfg.color}>browse</span>
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">Accepted: {cfg.accept.split(",").join(", ")}</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={cfg.accept}
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileSelect(f);
                        }}
                      />
                    </div>
                  ) : uploadStatus === "uploading" ? (
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                          <BiUpload className={`w-5 h-5 ${cfg.color} animate-bounce`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-700 truncate">{selectedFile?.name}</p>
                          <p className="text-xs text-zinc-400">{formatBytes(selectedFile?.size || 0)}</p>
                        </div>
                        <span className="text-sm font-bold text-zinc-600">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${cfg.bg.replace("bg-", "bg-").replace("50", "500")}`}
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : uploadStatus === "uploaded" && selectedFile ? (
                    <div>
                      <FilePreview file={selectedFile} type={resourceType} />
                      <div className="mt-2 flex items-center gap-2">
                        <BiCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-xs text-emerald-600 font-medium">Uploaded successfully</span>
                        <button
                          type="button"
                          onClick={() => { resetFile(); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                          className="ml-auto text-xs text-zinc-400 hover:text-zinc-600 underline"
                        >
                          Change file
                        </button>
                      </div>
                    </div>
                  ) : uploadStatus === "error" ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                      <BiErrorCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-700">Upload failed</p>
                        <p className="text-xs text-red-500 mt-0.5">{fileError}</p>
                        <button
                          type="button"
                          onClick={() => { resetFile(); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                          className="mt-2 text-xs font-semibold text-red-600 hover:underline"
                        >
                          Try again
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="A brief description of this resource…"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 resize-none transition"
                />
              </div>

              {/* Visibility & Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as Visibility)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 transition"
                  >
                    <option value="public">🌐 Public</option>
                    <option value="private">🔒 Private</option>
                    <option value="course-only">📚 Course Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Tags <span className="font-normal text-zinc-400">(comma-separated)</span></label>
                  <input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Math, Grade 5…"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 transition"
                  />
                </div>
              </div>

              {submitError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  <BiErrorCircle className="w-4 h-4 shrink-0" />
                  {submitError}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-zinc-100 px-6 py-4 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting || (uploadStatus === "uploading")}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <BiCheck className="w-4 h-4" />
                )}
                {isSubmitting ? "Saving…" : "Save Resource"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ─── Type Filter Pill ──────────────────────────────────────────────────────────
const FILTER_TYPES: { value: ResourceType | ""; label: string; icon: React.ReactNode }[] = [
  { value: "", label: "All", icon: <BiFilter className="w-3.5 h-3.5" /> },
  { value: "pdf", label: "PDF", icon: <BiFile className="w-3.5 h-3.5" /> },
  { value: "video", label: "Video", icon: <BiVideo className="w-3.5 h-3.5" /> },
  { value: "audio", label: "Audio", icon: <BiMusic className="w-3.5 h-3.5" /> },
  { value: "image", label: "Image", icon: <BiImage className="w-3.5 h-3.5" /> },
  { value: "document", label: "Document", icon: <BiBook className="w-3.5 h-3.5" /> },
  { value: "link", label: "Link", icon: <BiLink className="w-3.5 h-3.5" /> },
];

// ─── Resource List (Main) ──────────────────────────────────────────────────────
const ResourceList = () => {
  const [sessionRole, setSessionRole] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResourceType | "">("");
  const [showUpload, setShowUpload] = useState(false);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setSessionRole(data.user?.role || "student");
      }
    } catch { /* ignore */ }
  };

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resources");
      if (res.ok) {
        const json = await res.json();
        setResources(json.resources || []);
      }
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
    fetchResources();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resource?")) return;
    try {
      const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete.");
    }
  };

  const ALL_TAGS = useMemo(() => {
    const s = new Set<string>();
    resources.forEach((r) => r.tags?.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [resources]);

  const filtered = useMemo(() => resources.filter((r) => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) &&
       !(r.description || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedTag && (!r.tags || !r.tags.includes(selectedTag))) return false;
    if (typeFilter && r.resource_type !== typeFilter) return false;
    return true;
  }), [resources, search, selectedTag, typeFilter]);

  // Counts per type
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    resources.forEach((r) => { counts[r.resource_type] = (counts[r.resource_type] || 0) + 1; });
    return counts;
  }, [resources]);

  const canUpload = sessionRole === "teacher" || sessionRole === "admin";

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Resources</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {resources.length} item{resources.length !== 1 ? "s" : ""} — videos, PDFs, images, audio &amp; more
          </p>
        </div>
        {canUpload && (
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 transition-all shadow-sm hover:shadow-md"
          >
            <BiPlus className="w-4 h-4" />
            Upload Resource
          </button>
        )}
      </div>

      {/* Stats strip */}
      {resources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TYPE_CONFIG) as ResourceType[]).filter(t => typeCounts[t]).map((t) => {
            const c = TYPE_CONFIG[t];
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(typeFilter === t ? "" : t)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
                  typeFilter === t ? `${c.bg} ${c.color} ${c.border}` : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
                }`}
              >
                {c.icon} {c.label} <span className="ml-0.5 opacity-70">{typeCounts[t]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Search & type filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search resources…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 transition w-56"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
              <BiX className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILTER_TYPES.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value as ResourceType | "")}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
                typeFilter === f.value
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tag chips */}
      {ALL_TAGS.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag("")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !selectedTag ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            }`}
          >
            All tags
          </button>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedTag === tag ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}
            >
              <BiTag className="w-3 h-3" /> <span className="capitalize">{tag}</span>
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-zinc-200 border-t-zinc-600 animate-spin" />
            <p className="text-sm text-zinc-400">Loading resources…</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-20 gap-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
            <BiFile className="w-7 h-7 text-zinc-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-zinc-700">No resources found</p>
            <p className="text-xs text-zinc-400 mt-1">
              {search || selectedTag || typeFilter
                ? "Try adjusting your filters"
                : canUpload
                ? "Click Upload Resource to add the first one"
                : "Your teachers haven't shared any resources yet"}
            </p>
          </div>
          {canUpload && !search && !selectedTag && !typeFilter && (
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition"
            >
              <BiPlus className="w-4 h-4" /> Upload first resource
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ResourceCard key={r._id} resource={r} userRole={sessionRole} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => fetchResources()}
        />
      )}
    </div>
  );
};

export default ResourceList;
